export type PasswordStrengthLevel = "empty" | "weak" | "fair" | "good" | "strong";

export function evaluatePasswordStrength(password: string): {
  level: PasswordStrengthLevel;
  score: number;
  hint: string;
} {
  if (!password) {
    return { level: "empty", score: 0, hint: "" };
  }

  let variety = 0;
  if (/[a-z]/.test(password)) variety++;
  if (/[A-Z]/.test(password)) variety++;
  if (/\d/.test(password)) variety++;
  if (/[^a-zA-Z0-9]/.test(password)) variety++;

  if (password.length < 8) {
    return { level: "weak", score: 1, hint: "Use at least 8 characters" };
  }

  const lengthBonus = password.length >= 12 ? 1 : 0;
  const total = variety + lengthBonus;

  if (total <= 2) {
    return { level: "fair", score: 2, hint: "Add mixed case, numbers, or symbols" };
  }
  if (total <= 3) {
    return { level: "good", score: 3, hint: "Good — consider a longer passphrase" };
  }
  return { level: "strong", score: 4, hint: "Strong password" };
}

export const passwordStrengthBarClass: Record<PasswordStrengthLevel, string> = {
  empty: "bg-muted",
  weak: "bg-red-500",
  fair: "bg-amber-500",
  good: "bg-sky-500",
  strong: "bg-emerald-500",
};
