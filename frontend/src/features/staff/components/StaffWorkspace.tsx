import { useState } from "react";
import { availableTabs, landingTab } from "../model/access";
import type { StaffAccess, WorkspaceTab } from "../model/types";
import { STAFF_THEME } from "../model/theme";
import MyAccess from "./MyAccess";
import WaitlistSubscriptions from "./WaitlistSubscriptions";

interface StaffWorkspaceProps {
  access: StaffAccess;
  onSignOut: () => void;
}

const TAB_LABELS: Record<WorkspaceTab, string> = {
  waitlist: "Waitlist",
  access: "My access",
};

export default function StaffWorkspace({ access, onSignOut }: StaffWorkspaceProps) {
  const tabs = availableTabs(access);
  const [tab, setTab] = useState<WorkspaceTab>(() => landingTab(access));
  const activeTab = tabs.includes(tab) ? tab : tabs[0];

  return (
    <div className="min-h-screen" style={{ backgroundColor: STAFF_THEME.background }}>
      <header
        className="bg-white border-b"
        style={{ borderColor: STAFF_THEME.border }}
      >
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-6">
          <span className="text-sm font-semibold text-black">
            Bossbaby <span className="text-[#FF4FA3]">Staff</span>
          </span>
          <nav className="flex items-center gap-1">
            {tabs.map((candidate) => (
              <button
                key={candidate}
                type="button"
                onClick={() => setTab(candidate)}
                aria-current={activeTab === candidate ? "page" : undefined}
                className={`text-sm px-3 py-1.5 rounded transition-colors ${
                  activeTab === candidate ? "text-white" : "text-black/60 hover:text-black"
                }`}
                style={
                  activeTab === candidate
                    ? { backgroundColor: STAFF_THEME.accent }
                    : undefined
                }
              >
                {TAB_LABELS[candidate]}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {activeTab === "access" && <MyAccess access={access} onSignOut={onSignOut} />}
        {activeTab === "waitlist" && <WaitlistSubscriptions access={access} />}
      </main>
    </div>
  );
}
