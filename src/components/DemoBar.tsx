"use client";

import { useRef, useState } from "react";
import { RotateCcw, Sparkles } from "lucide-react";
import { useClearGuestData } from "@/lib/hooks/useGuestStoreActions";
import { useDemoMode } from "@/lib/hooks/useDemoMode";
import { useAuth } from "@/components/AuthProvider";
import { DeleteUserDataDialog } from "@/components/settings/DeleteUserDataDialog";
import {
  BANNER_SLOT_WRAPPER_CLASS,
  BANNER_SLOT_CARD_CLASS,
  useActiveBanner,
} from "@/components/bannerSlot";
import { useStatusPillOffset } from "@/lib/hooks/useStatusPillOffset";
import { cn } from "@/lib/utils";
import { NOTIFICATION_LINK_BUTTON_CLASS } from "@/components/ui/notification-link-button";

export function DemoBar() {
  const activeBanner = useActiveBanner();
  const clearGuestData = useClearGuestData();
  const isDemoMode = useDemoMode();
  const { isGuestMode } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isVisible = isGuestMode && activeBanner === "demo";

  useStatusPillOffset(cardRef, isVisible);

  if (!isVisible) return null;

  return (
    <>
      <div data-testid="demo-bar" className={BANNER_SLOT_WRAPPER_CLASS}>
        <div
          ref={cardRef}
          className={cn(
            BANNER_SLOT_CARD_CLASS,
            "bg-card text-foreground border-border/80",
          )}
        >
          <Sparkles
            className="w-4 h-4 text-muted-foreground shrink-0"
            strokeWidth={2.25}
          />
          <span className="text-[13px] font-medium tracking-[0.01em] whitespace-nowrap">
            <span className="hidden sm:inline">Guest sample data</span>
            <span className="sm:hidden">Guest sample</span>
          </span>
          {isDemoMode && (
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className={cn(
                NOTIFICATION_LINK_BUTTON_CLASS,
                "text-brand inline-flex items-center gap-1.5",
              )}
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Start fresh
            </button>
          )}
        </div>
      </div>
      <DeleteUserDataDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={clearGuestData}
      />
    </>
  );
}
