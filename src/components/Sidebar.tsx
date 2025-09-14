import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight, BookOpen, CoinsIcon } from 'lucide-react';

interface MenuItem {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  hasSubmenu?: boolean;
  onClick?: () => void;
  comingSoon?: boolean;
  submenu?: MenuItem[];
  isOpen?: boolean;
  externalLink?: string;
}

interface SidebarProps {
  menuItems: MenuItem[];
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems, onClose }) => {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const toggleSubmenu = (label: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.submenu) {
      toggleSubmenu(item.label);
    } else if (item.externalLink) {
      window.open(item.externalLink, '_blank');
      onClose();
    } else if (!item.comingSoon && item.onClick) {
      item.onClick();
      onClose();
    }
  };

  const renderMenuItem = (item: MenuItem, depth: number = 0) => (
    <div key={item.label}>
      <div
        onClick={() => handleItemClick(item)}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer mb-1 transition-all duration-300
          ${depth > 0 ? 'ml-6' : ''}
          ${item.active 
            ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white' 
            : 'hover:bg-gray-800/50 text-gray-400 hover:text-white'}
          ${item.comingSoon ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <item.icon className="h-5 w-5" />
        <span className="text-sm">{item.label}</span>
        {item.submenu && (
          openMenus[item.label] 
            ? <ChevronDown className="w-4 h-4 ml-auto" />
            : <ChevronRight className="w-4 h-4 ml-auto" />
        )}
        {item.comingSoon && !item.submenu && (
          <span className="ml-auto text-xs text-gray-500">Soon</span>
        )}
      </div>
      {item.submenu && openMenus[item.label] && (
        <div className="transition-all duration-300">
          {item.submenu.map(subItem => renderMenuItem(subItem, depth + 1))}
        </div>
      )}
    </div>
  );

  return (
    <div ref={sidebarRef} className="w-64 h-full bg-gray-900/30 backdrop-blur-md border-r border-gray-800 flex flex-col">
      <div 
        className="flex items-center gap-2 px-4 py-3 mb-2 cursor-pointer hover:bg-gray-800/50 rounded-lg transition-colors shrink-0"
        onClick={() => {
          const swapMenuItem = menuItems.find(item => item.label === 'Trade');
          if (swapMenuItem?.onClick) {
            swapMenuItem.onClick();
            onClose();
          }
        }}
      >
        <img 
          src="https://swap.falcox.net/images/tokens/0x49cc83dc4cf5d3ecdb0b6dd9657c951c52ec7dfa.png"
          alt="FalcoX"
          className="h-8 w-8"
        />
        <span className="text-lg font-semibold text-white">FalcoX Swap</span>
      </div>
      <nav className="flex-1 overflow-y-auto px-4 pb-4">
        {menuItems.map(item => renderMenuItem(item))}
      </nav>
    </div>
  );
};

export default Sidebar;