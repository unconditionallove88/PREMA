import { router } from "expo-router";
import React from "react";

import { DisclaimerFlow } from "@/components/DisclaimerFlow";
import { useSession } from "@/context/SessionContext";

export default function DisclaimerScreen() {
  const { lang, completeDisclaimer } = useSession();

  return (
    <DisclaimerFlow
      lang={lang}
      onComplete={() => {
        completeDisclaimer();
        router.replace("/(tabs)");
      }}
    />
  );
}
