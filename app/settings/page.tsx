import { Suspense } from "react";
import { SettingsClient } from "@/components/settings/SettingsClient";

// Performance: Root settings page is now a Server Component (PERF-01).
export default function SettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsClient />
    </Suspense>
  );
}
