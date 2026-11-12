import type { Metadata } from "next";
import { Suspense } from "react";
import { LiveAccount } from "@/components/live/live-account";

export const metadata: Metadata = {
  title: "Live test — ENTRAIQ",
  description: "Sign in with your own email to test ENTRAIQ with your real accounts.",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <Suspense>
      <LiveAccount />
    </Suspense>
  );
}
