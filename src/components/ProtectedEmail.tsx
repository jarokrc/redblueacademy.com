import { useId, useMemo, useState } from "react";

type ProtectedEmailTexts = {
  prompt: string;
  placeholder: string;
  error: string;
  revealCta: string;
  openingCta?: string;
  copy: string;
  copied: string;
};

type ProtectedEmailProps = {
  encodedEmail: number[];
  texts: ProtectedEmailTexts;
  className?: string;
  buttonClassName?: string;
  underline?: boolean;
  openOnReveal?: boolean;
};

const ProtectedEmail = ({
  encodedEmail,
  texts,
  className = "",
  buttonClassName = "rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-blue-600",
  underline = false,
  openOnReveal = false,
}: ProtectedEmailProps) => {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [captchaInput, setCaptchaInput] = useState("");
  const [error, setError] = useState("");
  const [honeypotFilled, setHoneypotFilled] = useState(false);
  const [captcha] = useState(() => {
    const a = Math.floor(Math.random() * 4) + 2;
    const b = Math.floor(Math.random() * 5) + 3;
    return { question: `${a} + ${b}`, answer: a + b };
  });

  const email = useMemo(() => encodedEmail.map((c) => String.fromCharCode(c)).join(""), [encodedEmail]);

  const inputId = useId();
  const isCaptchaValid = Number(captchaInput.trim()) === captcha.answer && !honeypotFilled;

  const handlePrimaryClick = () => {
    if (honeypotFilled) return;
    if (!revealed) {
      if (!isCaptchaValid) {
        setError(texts.error);
        return;
      }
      setError("");
      setRevealed(true);
      setCopied(false);
      if (openOnReveal) {
        window.location.href = `mailto:${email}`;
      }
      return;
    }
    window.location.href = `mailto:${email}`;
  };

  const handleCopy = async () => {
    if (!revealed) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className={`${underline ? "underline-sweep-fast" : ""} flex flex-wrap items-center gap-3`}>
        <label htmlFor={inputId} className="text-sm font-semibold text-slate-800">
          {texts.prompt} {captcha.question}?
        </label>
        <input
          type="number"
          inputMode="numeric"
          id={inputId}
          value={captchaInput}
          onChange={(e) => setCaptchaInput(e.target.value)}
          placeholder={texts.placeholder}
          className="w-36 rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 md:w-44"
        />
        <input
          type="text"
          name="contact_hp"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          onChange={(e) => setHoneypotFilled(Boolean(e.target.value))}
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={handlePrimaryClick} disabled={!revealed && !isCaptchaValid} className={buttonClassName}>
          {revealed ? email : texts.revealCta}
        </button>

        {revealed && (
          <button
            type="button"
            onClick={handleCopy}
            className="rounded px-3 py-2 text-sm font-semibold text-blue-700 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            {copied ? texts.copied : texts.copy}
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default ProtectedEmail;
