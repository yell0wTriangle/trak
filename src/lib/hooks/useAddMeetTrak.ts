"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { projectMutations } from "@/lib/mutations/project";
import { taskMutations } from "@/lib/mutations/task";
import {
  MEET_TRAK_PROJECT,
  meetTrakSteps,
  stepDates,
} from "@/lib/meet-trak";
import { handleMutationError } from "@/lib/utils/mutation-error";
import { runAfterModalBack } from "@/lib/hooks/useBackNavigation";
import type { Project } from "@/lib/types/task";

// Normal rows through the normal save path, so sync and encryption apply.
export async function addMeetTrakProject(): Promise<Project> {
  const project = await projectMutations.create({ ...MEET_TRAK_PROJECT });
  const today = new Date();
  // One at a time: each insert reads the last day_order to append after it.
  for (const step of meetTrakSteps()) {
    const { due_date, do_date } = stepDates(step, today);
    const task = await taskMutations.create({
      content: step.content,
      description: step.description,
      project_id: project.id,
      due_date: due_date ?? undefined,
      do_date: do_date ?? undefined,
      recurrence: step.recurrence,
    });
    for (const subtask of step.subtasks ?? []) {
      await taskMutations.create({
        content: subtask,
        project_id: project.id,
        parent_id: task.id,
      });
    }
  }
  return project;
}

export function useAddMeetTrak() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationKey: ["addMeetTrak"],
    mutationFn: addMeetTrakProject,
    onError: handleMutationError,
    onSettled: () => {
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: ["projects"] }),
        queryClient.invalidateQueries({ queryKey: ["tasks"] }),
        queryClient.invalidateQueries({ queryKey: ["calendar-tasks"] }),
      ]);
    },
  });

  // Awaited rather than onSuccess: the sheet or menu that started it may
  // unmount before the save finishes.
  const addAndOpen = async (closeSheet?: () => void) => {
    if (mutation.isPending) return null;
    // onError already reports a failure.
    const project = await mutation.mutateAsync().catch(() => null);
    if (!project) return null;

    closeSheet?.();
    runAfterModalBack(() => router.push(`/?project=${project.id}`));
    return project;
  };

  return { addAndOpen, isPending: mutation.isPending };
}
