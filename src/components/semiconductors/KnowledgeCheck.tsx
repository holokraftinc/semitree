"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/knowledge/semi-lessons";
import { cn } from "@/lib/utils/cn";

/**
 * Lightweight, client-only multiple-choice knowledge checks. No accounts, no
 * storage, no tracking — selecting an option reveals whether it's correct and
 * explains why. Purely to reinforce understanding (not a certification).
 */
function Question({ q, index }: { q: QuizQuestion; index: number }) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;
  const groupName = `kc-${index}`;

  return (
    <fieldset className="rounded-xl border border-border bg-card p-5">
      <legend className="px-1 text-sm font-semibold text-foreground">
        {index + 1}. {q.question}
      </legend>
      <div className="mt-3 space-y-2" role="radiogroup" aria-label={q.question}>
        {q.options.map((opt, i) => {
          const isCorrect = i === q.answer;
          const isPicked = i === picked;
          const show = answered && (isPicked || isCorrect);
          return (
            <label
              key={opt}
              className={cn(
                "flex cursor-pointer items-start gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                !answered && "border-border hover:border-brand/40 hover:bg-muted/40",
                show && isCorrect && "border-success/50 bg-success/5",
                answered && isPicked && !isCorrect && "border-danger/50 bg-danger/5",
                answered && !isPicked && !isCorrect && "border-border opacity-70",
              )}
            >
              <input
                type="radio"
                name={groupName}
                className="mt-0.5 h-4 w-4 shrink-0 text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                checked={isPicked}
                disabled={answered}
                onChange={() => setPicked(i)}
              />
              <span>{opt}</span>
              {show && isCorrect && <span className="ml-auto text-xs font-semibold text-success">Correct</span>}
              {answered && isPicked && !isCorrect && <span className="ml-auto text-xs font-semibold text-danger">Not quite</span>}
            </label>
          );
        })}
      </div>
      {answered && (
        <div className="mt-3 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground" role="status">
          {q.explanation}
          <button
            type="button"
            onClick={() => setPicked(null)}
            className="mt-2 block text-xs font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Try again
          </button>
        </div>
      )}
    </fieldset>
  );
}

export function KnowledgeCheck({ questions }: { questions: QuizQuestion[] }) {
  if (!questions || questions.length === 0) return null;
  return (
    <section aria-labelledby="knowledge-check-h" className="space-y-4">
      <div>
        <h2 id="knowledge-check-h" className="text-lg font-semibold tracking-tight">Check your understanding</h2>
        <p className="text-sm text-muted-foreground">Quick self-check — not a test, and nothing is recorded.</p>
      </div>
      <div className="space-y-3">
        {questions.map((q, i) => <Question key={q.question} q={q} index={i} />)}
      </div>
    </section>
  );
}
