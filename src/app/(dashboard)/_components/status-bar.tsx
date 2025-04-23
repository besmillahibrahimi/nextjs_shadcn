"use client";
import { useApp } from "@/providers/app.provider";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function StatusBar() {
  const { auth } = useApp();
  return (
    <div>
      <Icon icon={"mdi:bill"} />
      <div>
        <div className="flex justify-between">
          <p>Credit Balance:</p>
          <data value={auth?.user?.credits}>{auth?.user?.credits} credits</data>
        </div>
        <div className="flex justify-between">
          <p>Monthly Credits Remaining:</p>
          <data value={auth?.user?.monthlyCredits}>{auth?.user?.monthlyCredits} credits</data>
        </div>
      </div>
    </div>
  );
}
