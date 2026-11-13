import React from 'react';
import { useSocket } from '../context/useSocket';

export const Header = ({ currentRole, setCurrentRole, activeTable, onBackToFloor }) => {
  const { isConnected } = useSocket();

  // User badge info based on active role
  const getRoleInfo = () => {
    switch (currentRole) {
      case 'waiter':
      case 'menu':
        return { name: 'Rahul S.', title: 'Waiter', icon: 'badge', color: 'bg-primary' };
      case 'kitchen':
        return { name: 'Chef Suresh', title: 'Head Cook', icon: 'soup_kitchen', color: 'bg-tertiary-container' };
      case 'admin':
      case 'billing':
      default:
        return { name: 'Anand M.', title: 'Owner/Manager', icon: 'shield_person', color: 'bg-primary-container' };
    }
  };

  const roleInfo = getRoleInfo();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-xl border-b border-outline-variant/40 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between gap-2">
        {/* Brand & Context */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center text-on-primary shadow-sm">
            <span className="material-symbols-outlined text-[20px]">coffee</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-primary tracking-tight text-base sm:text-lg">CafeFlow</span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-surface-container-high text-[10px] font-semibold text-on-surface-variant">
                <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-rose-500 animate-ping'}`}></span>
                {isConnected ? 'LIVE' : 'SYNCING'}
              </span>
            </div>
            <span className="text-xs text-on-surface-variant truncate hidden sm:inline">
              Morning Shift • Central Floor
            </span>
          </div>
        </div>

        {/* Global Station / Role Switcher Tabs */}
        <nav className="flex items-center gap-1 bg-surface-container p-1 rounded-xl overflow-x-auto no-scrollbar shadow-inner text-xs sm:text-sm">
          <button
            onClick={() => setCurrentRole('waiter')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              currentRole === 'waiter' || currentRole === 'menu'
                ? 'bg-primary-container text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">table_restaurant</span>
            <span>Waiter</span>
          </button>

          <button
            onClick={() => setCurrentRole('kitchen')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              currentRole === 'kitchen'
                ? 'bg-primary-container text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">soup_kitchen</span>
            <span>Kitchen (KDS)</span>
          </button>

          <button
            onClick={() => setCurrentRole('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              currentRole === 'admin'
                ? 'bg-primary-container text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">dashboard</span>
            <span>Admin</span>
          </button>

          <button
            onClick={() => setCurrentRole('billing')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              currentRole === 'billing'
                ? 'bg-primary-container text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            <span>Table Billing</span>
          </button>
        </nav>

        {/* User Identity Chip */}
        <div className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full bg-surface-container-low border border-outline-variant/30 shrink-0">
          <div className="flex flex-col text-right leading-tight pr-1 hidden md:flex">
            <span className="text-xs font-semibold text-on-surface">{roleInfo.name}</span>
            <span className="text-[10px] text-on-surface-variant">{roleInfo.title}</span>
          </div>
          <div className={`w-8 h-8 rounded-full ${roleInfo.color} flex items-center justify-center text-on-primary shadow-sm`}>
            <span className="material-symbols-outlined text-[18px]">{roleInfo.icon}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
