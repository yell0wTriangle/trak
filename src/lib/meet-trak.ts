import type { RecurrenceRule } from "@/lib/utils/recurrence";

// One list for the guest demo and the opt-in project for accounts.
export const MEET_TRAK_PROJECT = {
  name: "This Week",
  color: "#B56C5A",
} as const;

export interface TutorialStep {
  content: string;
  description: string;
  // do_date keeps a step off the Calendar; due_date puts it on. null: undated.
  schedule: { field: "do_date" | "due_date"; hour: number } | null;
  recurrence?: RecurrenceRule;
  subtasks?: string[];
}

// 7:00 is before every timed step; equal times keep this order.
const PLANNED = { field: "do_date", hour: 7 } as const;

// Titles stay short enough not to truncate on a phone.
export function meetTrakSteps(): TutorialStep[] {
  return [
    {
      content: "Finish statistics problem set",
      description: "Work through the questions due this week.",
      schedule: PLANNED,
    },
    {
      content: "Read biology chapter 6",
      description: "Review the chapter before the next lecture.",
      schedule: PLANNED,
    },
    {
      content: "Email professor about office hours",
      description: "Ask about a time to go over the last assignment.",
      schedule: PLANNED,
    },
    {
      content: "Draft lab report",
      description: "Put together the results and discussion.",
      schedule: PLANNED,
      subtasks: ["Organize the results", "Write the discussion"],
    },
    {
      content: "Meet study group at the library",
      description: "Go over the problem set together.",
      schedule: PLANNED,
    },
    {
      content: "Pick up groceries",
      description: "Get a few things for the week.",
      schedule: PLANNED,
    },
    {
      content: "Call home",
      description: "Check in with family this weekend.",
      schedule: { field: "due_date", hour: 9 },
      recurrence: { freq: "WEEKLY", interval: 1 },
    },
    {
      content: "Study group",
      description: "A recurring weekly library session.",
      schedule: { field: "due_date", hour: 15 },
    },
    {
      content: "Make dinner",
      description: "Keep tonight open for a meal at home.",
      schedule: null,
    },
  ];
}

export function stepDates(
  step: TutorialStep,
  day: Date,
): { due_date: string | null; do_date: string | null } {
  if (!step.schedule) return { due_date: null, do_date: null };
  const date = new Date(day);
  date.setHours(step.schedule.hour, 0, 0, 0);
  const iso = date.toISOString();
  return step.schedule.field === "due_date"
    ? { due_date: iso, do_date: null }
    : { due_date: null, do_date: iso };
}
