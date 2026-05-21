"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Calendar,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { formatAssistantDisplay } from "@/lib/hge-assistant-format";
import { getLocalHgeResponse } from "@/lib/hge-local-assistant";
import {
  formatOfficeHoursReply,
  HGE_OFFICE_CLOSED_MESSAGE,
  HGE_OFFICE_HOURS_DISPLAY,
} from "@/lib/support-office-hours";
import { getSupportStatus, type SupportStatus } from "@/lib/support-status";
import { cn } from "@/lib/utils";

const WELCOME_MSG_ID = "m0";
const LAUNCHER_IDLE_MS = 8000;

const QUICK_CHIPS: { label: string; prompt: string }[] = [
  { label: "Estimate", prompt: "How do I get an estimate?" },
  { label: "AC HP", prompt: "What HP do I need?" },
  { label: "Cleaning", prompt: "how to schedule cleaning" },
  { label: "Repair", prompt: "Aircon repair concern" },
  { label: "Survey", prompt: "Book a site survey" },
  { label: "Contact", prompt: "Contact Hope Genesis" },
];

type QuickAction = { label: string; kind: "hours" } | { label: string; kind: "link"; href: string };

const SUPPORT_QUICK_ACTIONS: QuickAction[] = [
  { label: "Office Hours", kind: "hours" },
  { label: "Contact us", kind: "link", href: "/contact" },
  { label: "Get Estimate", kind: "link", href: "/estimate" },
  { label: "Emergency Support", kind: "link", href: "/contact" },
  { label: "Services", kind: "link", href: "/services" },
];

const STATUS_REFRESH_MS = 60_000;

const SORRY =
  "Sorry, I couldn't process that request right now. Please try again or contact Hope Genesis Enterprises for assistance.";

type Msg = { id: string; role: "user" | "assistant" | "system"; text: string };

function messagesForApi(thread: Msg[]): { role: "user" | "assistant"; content: string }[] {
  return thread
    .filter((m) => m.id !== WELCOME_MSG_ID && m.role !== "system")
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.text }));
}

function useSupportStatus(): SupportStatus {
  const [status, setStatus] = React.useState<SupportStatus>(() => getSupportStatus());

  React.useEffect(() => {
    const tick = () => setStatus(getSupportStatus());
    tick();
    const id = window.setInterval(tick, STATUS_REFRESH_MS);
    return () => window.clearInterval(id);
  }, []);

  return status;
}

function SupportStatusRow({ status }: { status: SupportStatus }) {
  return (
    <p
      className="mt-1 flex items-center gap-1.5 text-[10px] text-muted-foreground/90"
      role="status"
      aria-live="polite"
    >
      <span
        className={cn("h-1.5 w-1.5 shrink-0 rounded-full", status.dotClassName)}
        aria-hidden
      />
      <span>{status.label}</span>
    </p>
  );
}

function priorUserTextFromThread(thread: Msg[]): string {
  const users = thread.filter((m) => m.role === "user").map((m) => m.text);
  return users.slice(0, -1).join("\n");
}

function lastUserTextFromThread(thread: Msg[]): string {
  const users = thread.filter((m) => m.role === "user");
  return users.length ? users[users.length - 1].text : "";
}

function AssistantMessageBody({ text }: { text: string }) {
  const display = formatAssistantDisplay(text);
  const blocks = display.split(/\n\n+/);

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-2"
    >
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        const bullets = lines.filter((l) => /^[\s]*[•\-*]\s/.test(l));
        const nonBullets = lines.filter((l) => !/^[\s]*[•\-*]\s/.test(l));

        if (bullets.length > 0 && bullets.length === lines.length) {
          return (
            <ul key={i} className="list-none space-y-1 pl-0">
              {bullets.map((line, j) => (
                <li key={j} className="flex gap-2 text-[12.5px] leading-[1.45]">
                  <span className="mt-[0.35em] h-1 w-1 shrink-0 rounded-full bg-primary/70" aria-hidden />
                  <span>{line.replace(/^[\s]*[•\-*]\s*/, "")}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (bullets.length > 0) {
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.18 }}
              className="space-y-1.5"
            >
              {nonBullets.map((line, j) => (
                <p key={j} className="text-[12.5px] leading-[1.5] text-foreground/90">
                  {line}
                </p>
              ))}
              <ul className="list-none space-y-1">
                {bullets.map((line, j) => (
                  <li key={j} className="flex gap-2 text-[12.5px] leading-[1.45]">
                    <span className="mt-[0.35em] h-1 w-1 shrink-0 rounded-full bg-primary/70" aria-hidden />
                    <span>{line.replace(/^[\s]*[•\-*]\s*/, "")}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        }

        return (
          <p key={i} className="text-[12.5px] leading-[1.5] text-foreground/90">
            {block}
          </p>
        );
      })}
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 rounded-xl rounded-bl-sm border border-border/50 bg-muted/40 px-3 py-2"
        aria-live="polite"
        aria-label="Assistant is typing"
      >
        <span className="flex gap-1" aria-hidden>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-muted-foreground/55"
              animate={{ opacity: [0.35, 1, 0.35], y: [0, -2, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
            />
          ))}
        </span>
        <span className="text-[11px] text-muted-foreground">Typing…</span>
      </motion.div>
    </motion.div>
  );
}

export function HgeAssistant() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const supportStatus = useSupportStatus();
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const [launcherCompact, setLauncherCompact] = React.useState(false);
  const [topicsOpen, setTopicsOpen] = React.useState(true);
  const sendLockRef = React.useRef(false);
  const offlineNoticeShownRef = React.useRef(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const msgsRef = React.useRef<Msg[]>([
    {
      id: WELCOME_MSG_ID,
      role: "assistant",
      text: "Hi! I'm HGE Support — here for AC sizing, estimates, cleaning, repair, and bookings.",
    },
  ]);
  const [msgs, setMsgs] = React.useState<Msg[]>(() => msgsRef.current);

  React.useEffect(() => {
    msgsRef.current = msgs;
  }, [msgs]);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [msgs, isSending, reduce]);

  React.useEffect(() => {
    if (open) {
      setLauncherCompact(false);
      return;
    }
    const id = window.setTimeout(() => setLauncherCompact(true), LAUNCHER_IDLE_MS);
    return () => window.clearTimeout(id);
  }, [open]);

  React.useEffect(() => {
    if (!open) {
      offlineNoticeShownRef.current = false;
      return;
    }
    if (supportStatus.isOnline || offlineNoticeShownRef.current) return;
    offlineNoticeShownRef.current = true;
    setMsgs((m) => [
      ...m,
      { id: `${Date.now()}-sys`, role: "system", text: HGE_OFFICE_CLOSED_MESSAGE },
    ]);
  }, [open, supportStatus.isOnline]);

  function pushAssistant(text: string) {
    setMsgs((m) => [...m, { id: `${Date.now()}-a`, role: "assistant", text }]);
  }

  function showOfficeHours() {
    pushAssistant(formatOfficeHoursReply());
  }

  async function fetchReplyForThread(thread: Msg[]) {
    const payload = messagesForApi(thread);
    const lastUser = lastUserTextFromThread(thread);
    const priorUser = priorUserTextFromThread(thread);
    const applyLocal = () => pushAssistant(getLocalHgeResponse(lastUser, priorUser));

    try {
      const res = await fetch("/api/chat/squirly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
      });

      let data: { reply?: unknown; ok?: boolean; source?: string; error?: string } = {};
      try {
        data = (await res.json()) as typeof data;
      } catch {
        if (!res.ok) {
          pushAssistant(SORRY);
          return;
        }
        applyLocal();
        return;
      }

      const raw = typeof data.reply === "string" ? data.reply.trim() : "";
      if (raw.length > 0) {
        pushAssistant(raw);
        return;
      }

      if (data.source === "error" || data.error) {
        pushAssistant(SORRY);
        return;
      }

      applyLocal();
    } catch {
      applyLocal();
    }
  }

  async function send(rawText: string) {
    const trimmed = rawText.trim();
    if (!trimmed || sendLockRef.current || isSending) return;

    sendLockRef.current = true;
    setIsSending(true);

    try {
      const userMsg: Msg = { id: `${Date.now()}-u`, role: "user", text: trimmed };
      const thread = [...msgsRef.current, userMsg];
      msgsRef.current = thread;
      setMsgs(thread);
      setInput("");

      if (!getSupportStatus().isOnline) {
        return;
      }

      await fetchReplyForThread(thread);
    } finally {
      sendLockRef.current = false;
      setIsSending(false);
    }
  }

  const inputTrimmed = input.trim();

  if (pathname.startsWith("/admin")) return null;

  return (
    <motion.div
      className="fixed bottom-4 left-4 z-[60] sm:bottom-5 sm:left-5"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <AnimatePresence mode="popLayout">
        {open ? (
          <motion.div
            key="panel"
            initial={reduce ? false : { opacity: 0, y: 10, scale: 0.98 }}
            animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-label="HGE Support"
            className="mb-2.5 flex w-[min(92vw,380px)] flex-col overflow-hidden rounded-2xl border border-border/60 bg-background/95 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.28)] backdrop-blur-xl dark:border-white/10 dark:bg-background/92 dark:shadow-[0_20px_56px_-16px_rgba(0,0,0,0.55)]"
          >
            {/* Header */}
            <header className="relative flex shrink-0 items-center gap-2.5 border-b border-border/50 bg-background/80 px-3 py-2.5 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex min-w-0 flex-1 items-center gap-2.5"
              >
                <motion.div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  <span
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-2 border-background",
                      supportStatus.dotClassName,
                    )}
                    title={supportStatus.label}
                    aria-hidden
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.03 }}
                  className="min-w-0"
                >
                  <p className="text-[13px] font-semibold leading-tight tracking-tight">HGE Support</p>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.04 }}
                    className="mt-1 space-y-0.5 border-l border-primary/15 pl-2"
                  >
                    <p className="text-[9.5px] font-medium leading-snug text-muted-foreground/85">
                      <span aria-hidden>🕒 </span>
                      {HGE_OFFICE_HOURS_DISPLAY.title}
                    </p>
                    <p className="text-[9.5px] leading-snug text-muted-foreground/75">
                      {HGE_OFFICE_HOURS_DISPLAY.schedule}
                    </p>
                    <p className="text-[9px] leading-snug text-muted-foreground/65">
                      {HGE_OFFICE_HOURS_DISPLAY.sundayNote}
                    </p>
                  </motion.div>
                  <p className="mt-1 truncate text-[10.5px] leading-tight text-muted-foreground">
                    HVAC help • Estimates • Bookings
                  </p>
                  <SupportStatusRow status={supportStatus} />
                </motion.div>
              </motion.div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-7 w-7 shrink-0 rounded-lg text-muted-foreground hover:text-foreground"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </header>

            {/* Messages */}
            <div className="relative min-h-0 flex-1">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25, delay: 0.05 }}
                ref={scrollRef}
                className="max-h-[min(48vh,380px)] min-h-[200px] overflow-y-auto overscroll-contain px-3 py-3 scroll-smooth [scrollbar-width:thin]"
                aria-busy={isSending}
              >
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.04 } },
                  }}
                  className="space-y-2.5"
                >
                  {msgs.map((m) =>
                    m.role === "system" ? (
                      <motion.div
                        key={m.id}
                        variants={{
                          hidden: { opacity: 0, y: 6 },
                          visible: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="flex justify-center px-1"
                      >
                        <p className="max-w-[95%] rounded-lg border border-border/35 bg-muted/20 px-2.5 py-2 text-center text-[11px] leading-relaxed text-muted-foreground">
                          {m.text}
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key={m.id}
                        variants={{
                          hidden: { opacity: 0, y: 6 },
                          visible: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className={cn("flex", m.role === "assistant" ? "justify-start" : "justify-end")}
                      >
                      <div
                        className={cn(
                          "max-w-[80%]",
                          m.role === "assistant"
                            ? "rounded-xl rounded-bl-sm border border-border/45 bg-muted/35 px-2.5 py-2 shadow-sm"
                            : "rounded-xl rounded-br-sm bg-primary px-2.5 py-1.5 text-primary-foreground shadow-sm",
                        )}
                      >
                        {m.role === "assistant" ? (
                          <AssistantMessageBody text={m.text} />
                        ) : (
                          <p className="text-[12.5px] leading-[1.45]">{m.text}</p>
                        )}
                      </div>
                    </motion.div>
                    ),
                  )}
                  {isSending ? <TypingIndicator /> : null}
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.08 }}
                className="pointer-events-none absolute inset-x-0 top-0 h-5 bg-gradient-to-b from-background/95 to-transparent"
                aria-hidden
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.08 }}
                className="pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-background/95 to-transparent"
                aria-hidden
              />
            </div>

            {/* Support quick actions */}
            <motion.div className="shrink-0 border-t border-border/40 bg-muted/10 px-3 py-2">
              <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Quick actions
              </p>
              <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {SUPPORT_QUICK_ACTIONS.map((action) =>
                  action.kind === "link" ? (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="shrink-0 rounded-full border border-border/60 bg-background/90 px-3 py-1 text-[11px] font-medium text-foreground/90 shadow-sm transition-all hover:border-primary/35 hover:bg-primary/5 hover:text-primary"
                    >
                      {action.label}
                    </Link>
                  ) : (
                    <button
                      key={action.label}
                      type="button"
                      disabled={isSending}
                      onClick={() => showOfficeHours()}
                      className="shrink-0 rounded-full border border-border/60 bg-background/90 px-3 py-1 text-[11px] font-medium text-foreground/90 shadow-sm transition-all hover:border-primary/35 hover:bg-primary/5 hover:text-primary disabled:opacity-40"
                    >
                      {action.label}
                    </button>
                  ),
                )}
              </div>
            </motion.div>

            {/* Quick topics — horizontal chips */}
            <div className="shrink-0 border-t border-border/40 bg-muted/10 px-3 py-2">
              <button
                type="button"
                onClick={() => setTopicsOpen((v) => !v)}
                className="mb-1.5 flex w-full items-center justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                aria-expanded={topicsOpen}
              >
                <span>Quick topics</span>
                <span className="text-[9px] normal-case tracking-normal">{topicsOpen ? "Hide" : "Show"}</span>
              </button>
              <AnimatePresence initial={false}>
                {topicsOpen ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {QUICK_CHIPS.map((chip) => (
                        <button
                          key={chip.label}
                          type="button"
                          disabled={isSending}
                          onClick={() => void send(chip.prompt)}
                          className="shrink-0 rounded-full border border-border/60 bg-background/90 px-3 py-1 text-[11px] font-medium text-foreground/90 shadow-sm transition-all hover:border-primary/35 hover:bg-primary/5 hover:text-primary disabled:opacity-40"
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            {/* Input */}
            <form
              className="shrink-0 border-t border-border/40 px-3 py-2.5"
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.06 }}
                className="flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/20 py-1 pl-3.5 pr-1 shadow-inner focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/20"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about AC sizing, cleaning, booking…"
                  className="min-w-0 flex-1 bg-transparent py-1.5 text-[12.5px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
                  disabled={isSending}
                  aria-label="Message HGE Support"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="h-7 w-7 shrink-0 rounded-full"
                  aria-label="Send message"
                  disabled={isSending || inputTrimmed.length === 0}
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </motion.div>
            </form>

            {/* Footer CTA */}
            <motion.div className="shrink-0 border-t border-border/40 bg-muted/15 px-3 py-2.5">
              <div className="flex items-center gap-2">
                <Button asChild size="sm" className="h-8 flex-1 rounded-lg text-[12px] font-semibold shadow-sm">
                  <Link href="/estimate">Get Estimate</Link>
                </Button>
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                  className="flex shrink-0 items-center gap-0.5"
                >
                  <Button
                    asChild
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary"
                    aria-label="Call Hope Genesis"
                  >
                    <Link href="/contact">
                      <Phone className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary"
                    aria-label="Open chat"
                    onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    asChild
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary"
                    aria-label="Book survey"
                  >
                    <Link href="/contact">
                      <Calendar className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
              <p className="mt-2 text-center text-[9.5px] leading-snug text-muted-foreground/55">
                Emergency support available for selected clients.
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Launcher */}
      <motion.div layout transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}>
        <Button
          type="button"
          onClick={() => setOpen((v) => !v)}
          onMouseEnter={() => setLauncherCompact(false)}
          onFocus={() => setLauncherCompact(false)}
          className={cn(
            "h-10 gap-2 rounded-full border border-border/50 bg-primary text-primary-foreground shadow-[0_8px_24px_-6px_rgba(0,0,0,0.35)] ring-1 ring-primary/20 transition-all duration-300 hover:shadow-[0_10px_28px_-6px_rgba(0,0,0,0.4)]",
            launcherCompact && !open ? "w-10 px-0" : "px-3.5 pr-4",
          )}
          variant="default"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={open ? "Close HGE Support" : "Open HGE Support"}
        >
          <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
          <AnimatePresence mode="wait">
            {!launcherCompact || open ? (
              <motion.span
                key="label"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap text-[13px] font-semibold"
              >
                HGE Support
              </motion.span>
            ) : null}
          </AnimatePresence>
        </Button>
      </motion.div>
    </motion.div>
  );
}
