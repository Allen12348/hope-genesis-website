import { NextResponse } from "next/server";
import { getLocalHgeResponse } from "@/lib/hge-local-assistant";
import { detectHgeIntent } from "@/lib/hge-intent";
import { HGE_ASSISTANT_SYSTEM_PROMPT } from "@/lib/squirly-system-prompt";

export const runtime = "nodejs";

/** Shown only for malformed requests where we cannot read a user message. */
const ASSISTANT_UNAVAILABLE =
  "Sorry, I couldn't process that request right now. Please try again or contact Hope Genesis Enterprises for assistance.";

const MAX_USER_CHARS = 2000;
const MAX_HISTORY_MESSAGES = 24;

type ChatRole = "user" | "assistant";

type IncomingMessage = { role: ChatRole; content: string };

function trimHistory(messages: IncomingMessage[]): IncomingMessage[] {
  const slice = messages.slice(-MAX_HISTORY_MESSAGES);
  return slice.map((m) => ({
    role: m.role,
    content: String(m.content).slice(0, MAX_USER_CHARS),
  }));
}

function buildAugmentedSystemPrompt(detectedIntent: string): string {
  return [
    HGE_ASSISTANT_SYSTEM_PROMPT,
    "",
    `Classifier intent hint (non-authoritative, may be imperfect): "${detectedIntent}".`,
    "Answer strictly according to the customer's latest message plus prior transcript context.",
  ].join("\n");
}

async function fetchOpenAiChatCompletion(parameters: {
  apiKey: string;
  model: string;
  messages: { role: "system" | "user" | "assistant"; content: string }[];
}): Promise<string | null> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${parameters.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: parameters.model,
      messages: parameters.messages,
      temperature: 0.45,
      max_tokens: 900,
    }),
  });

  const data = (await res.json()) as {
    error?: { message?: string };
    choices?: { message?: { content?: string | null } }[];
  };

  if (!res.ok) {
    console.error("OpenAI error:", res.status, data?.error?.message);
    console.log("AI raw response:", "[error]", JSON.stringify(data));
    return null;
  }

  const text = data.choices?.[0]?.message?.content?.trim() ?? "";
  return text.length > 0 ? text : null;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    console.log("User message:", "[parse error]");
    console.log("Detected intent:", "general");
    console.log("AI response:", "");
    console.log("Used fallback:", true);
    return NextResponse.json(
      { ok: false, reply: ASSISTANT_UNAVAILABLE, error: "invalid_json", source: "error" },
      { status: 400 },
    );
  }

  if (
    !body ||
    typeof body !== "object" ||
    !("messages" in body) ||
    !Array.isArray((body as { messages: unknown }).messages)
  ) {
    console.log("User message:", "[invalid body]");
    console.log("Detected intent:", "general");
    console.log("AI response:", "");
    console.log("Used fallback:", true);
    return NextResponse.json(
      { ok: false, reply: ASSISTANT_UNAVAILABLE, error: "invalid_body", source: "error" },
      { status: 400 },
    );
  }

  const rawMessages = (body as { messages: IncomingMessage[] }).messages;
  const cleaned: IncomingMessage[] = [];
  for (const m of rawMessages) {
    if (
      m &&
      typeof m === "object" &&
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string"
    ) {
      const c = m.content.trim();
      if (c.length > 0) cleaned.push({ role: m.role, content: c });
    }
  }

  if (cleaned.length === 0 || cleaned[cleaned.length - 1].role !== "user") {
    console.log("User message:", "[missing user message]");
    console.log("Detected intent:", "general");
    console.log("AI response:", "");
    console.log("Used fallback:", true);
    return NextResponse.json(
      { ok: false, reply: ASSISTANT_UNAVAILABLE, error: "missing_user_message", source: "error" },
      { status: 400 },
    );
  }

  const history = trimHistory(cleaned);
  const latestMessage = history[history.length - 1]?.content ?? "";
  const userPriorMessages = history
    .filter((m) => m.role === "user")
    .slice(0, -1)
    .map((m) => m.content)
    .join("\n");

  console.log("LATEST USER MESSAGE:", latestMessage);

  const detectedIntent = detectHgeIntent(latestMessage);
  const localReply = getLocalHgeResponse(latestMessage, userPriorMessages);

  console.log("User message:", latestMessage);
  console.log("Detected intent:", detectedIntent);

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const model = process.env.OPENAI_CHAT_MODEL?.trim() || "gpt-4o-mini";

  if (!apiKey) {
    console.log("AI response:", "[skipped — no API key]");
    console.log("Used fallback:", true);
    return NextResponse.json({
      ok: true,
      reply: localReply,
      source: "local",
      intent: detectedIntent,
    });
  }

  const openaiMessages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: buildAugmentedSystemPrompt(detectedIntent) },
    ...history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
  ];

  try {
    const aiResponse = await fetchOpenAiChatCompletion({
      apiKey,
      model,
      messages: openaiMessages,
    });

    if (aiResponse) {
      console.log("AI response:", aiResponse);
      console.log("Used fallback:", false);
      return NextResponse.json({ ok: true, reply: aiResponse, source: "openai", intent: detectedIntent });
    }

    console.log("AI response:", "");
    console.log("Used fallback:", true);
    return NextResponse.json({
      ok: true,
      reply: localReply,
      source: "local_openai_empty",
      intent: detectedIntent,
    });
  } catch (e) {
    console.error("HGE Assistant chat fetch failed:", e);
    console.log("AI raw response:", "[exception]", String(e));
    console.log("AI response:", "");
    console.log("Used fallback:", true);
    return NextResponse.json({
      ok: true,
      reply: localReply,
      source: "local_exception",
      intent: detectedIntent,
    });
  }
}
