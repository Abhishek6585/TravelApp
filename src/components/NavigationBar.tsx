import { Home, BarChart3, Plus, Settings, Map, Cloud } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";

interface NavigationBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function NavigationBar({ activeTab, onTabChange }: NavigationBarProps) {
  const { t } = useLanguage();
  const { actualTheme } = useTheme();
  
  const tabs = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'insights', label: t.insights, icon: BarChart3 },
    { id: 'add', label: t.addTrip, icon: Plus },
    { id: 'maps', label: 'Maps', icon: Map },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 px-4 py-2 safe-area-pb backdrop-blur-xl transition-all duration-300 ${
      actualTheme === 'dark' 
        ? 'bg-gray-900/90 border-t border-gray-800/50' 
        : 'bg-white/90 border-t border-gray-200/50'
    }`}>
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isAddButton = tab.id === 'add';
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 p-2 min-w-[60px] transition-all duration-200 ${
                isAddButton 
                  ? 'bg-gradient-to-br from-green-600 to-green-700 text-white rounded-full p-3 -mt-4 shadow-2xl shadow-green-600/40 hover:shadow-green-600/60 hover:scale-105' 
                  : isActive 
                    ? `${actualTheme === 'dark' ? 'text-green-400' : 'text-green-600'} bg-green-500/10 rounded-lg` 
                    : `${actualTheme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} hover:bg-gray-500/10 rounded-lg`
              }`}
            >
              <Icon className={`w-5 h-5 ${isAddButton ? 'w-6 h-6' : ''} transition-transform duration-200 ${
                isActive && !isAddButton ? 'scale-110' : ''
              }`} />
              {!isAddButton && (
                <span className={`text-xs font-medium transition-all duration-200 ${
                  isActive ? 'opacity-100' : 'opacity-80'
                }`}>
                  {tab.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}