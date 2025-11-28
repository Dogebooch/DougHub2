import { Book, Brain, LayoutDashboard, Library } from 'lucide-react';

interface NavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ currentTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'learning', label: 'Learning Pipeline', icon: Brain },
    { id: 'browser', label: 'Card Browser', icon: Library },
    { id: 'notebook', label: 'Notebook', icon: Book },
  ];

  return (
    <div className="bg-[#2F3A48] border-b border-[#506256] px-4">
      <div className="flex items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors
              ${currentTab === tab.id
                ? 'border-[#C8A92A] text-[#F0DED3]'
                : 'border-transparent text-[#A79385] hover:text-[#DEC28C] hover:border-[#506256]'
              }
            `}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
