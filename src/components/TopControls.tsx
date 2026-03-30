"use client";

import MusicToggle from "@/components/MusicToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function TopControls() {
  return (
    <div className="fixed top-4 left-0 right-0 z-50 pointer-events-none">
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
        {/* Музыка — слева */}
        <div className="pointer-events-auto">
          <MusicToggle />
        </div>

        {/* Язык — справа */}
        <div className="pointer-events-auto">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}
