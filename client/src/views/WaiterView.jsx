import React, { useState, useMemo } from 'react';
import { formatCurrency } from '../utils/formatters';

export const WaiterView = ({ tables, onSelectTable, onMarkServed, onOpenBilling }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Metric counts
  const metrics = useMemo(() => {
    const total = tables.length;
    const vacant = tables.filter((t) => t.status === 'available').length;
    const seated = tables.filter((t) => t.status === 'occupied' || t.status === 'preparing').length;
    const ready = tables.filter((t) => t.status === 'ready').length;
    const billing = tables.filter((t) => t.status === 'billing').length;
    return { total, vacant, seated, ready, billing };
  }, [tables]);

  // Filtered tables
  const filteredTables = useMemo(() => {
    return tables.filter((table) => {
      const matchesQuery =
        !searchQuery.trim() ||
        table.tableNumber.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        parseInt(table.tableNumber, 10) === parseInt(searchQuery.trim(), 10);

      const matchesFilter =
        activeFilter === 'all' ||
        (activeFilter === 'available' && table.status === 'available') ||
        (activeFilter === 'ready' && table.status === 'ready') ||
        (activeFilter === 'occupied' && (table.status === 'occupied' || table.status === 'preparing')) ||
        (activeFilter === 'billing' && table.status === 'billing');

      return matchesQuery && matchesFilter;
    });
  }, [tables, searchQuery, activeFilter]);

  const handleTableClick = (table) => {
    if (table.status === 'available') {
      showToast(`Starting new order for Table ${table.tableNumber}...`);
      onSelectTable(table);
    } else if (table.status === 'ready') {
      showToast(`Order Ready! Serving Table ${table.tableNumber}...`);
      // If table is ready, allow marking served or opening details
      onSelectTable(table);
    } else if (table.status === 'billing') {
      showToast(`Opening Table ${table.tableNumber} bill...`);
      onOpenBilling(table);
    } else {
      showToast(`Opening Table ${table.tableNumber} active ticket...`);
      onSelectTable(table);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 space-y-4">
      {/* Top Welcome & Shift Note */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Floor 1 Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">Select Table</h1>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low border border-outline-variant/40 rounded-full shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-semibold text-on-surface">Service Live</span>
        </div>
      </div>

      {/* Status Metric Strip */}
      <div className="grid grid-cols-4 gap-2.5">
        <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-container shadow-sm border border-outline-variant/30 text-center">
          <span className="text-xs text-on-surface-variant font-medium">Total</span>
          <span className="text-xl sm:text-2xl font-bold text-primary tabular-nums">{metrics.total}</span>
        </div>

        <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-50/80 shadow-sm border border-emerald-200 text-center">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span className="text-xs text-emerald-800 font-semibold">Vacant</span>
          </div>
          <span className="text-xl sm:text-2xl font-bold text-emerald-900 tabular-nums">{metrics.vacant}</span>
        </div>

        <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-amber-50/80 shadow-sm border border-amber-200 text-center">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            <span className="text-xs text-amber-800 font-semibold">Seated</span>
          </div>
          <span className="text-xl sm:text-2xl font-bold text-amber-900 tabular-nums">{metrics.seated}</span>
        </div>

        <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-rose-50 shadow-md border border-rose-300 text-center relative overflow-hidden">
          {metrics.ready > 0 && (
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500 animate-ping"></div>
          )}
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            <span className="text-xs text-rose-800 font-bold">Serve!</span>
          </div>
          <span className="text-xl sm:text-2xl font-bold text-rose-900 tabular-nums">{metrics.ready}</span>
        </div>
      </div>

      {/* Table Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        {/* Table Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter table number (e.g. 04)..."
            className="w-full h-11 pl-11 pr-10 bg-surface-container-lowest border border-outline-variant/50 rounded-xl text-sm text-on-surface placeholder:text-outline shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[18px]">cancel</span>
            </button>
          )}
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setActiveFilter('all')}
            className={`filter-chip shrink-0 h-9 px-3.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              activeFilter === 'all'
                ? 'bg-primary-container text-on-primary'
                : 'bg-surface-container text-on-surface'
            }`}
          >
            <span>All</span>
            <span className="px-1.5 py-0.2 bg-white/20 rounded-full font-bold">{metrics.total}</span>
          </button>

          <button
            onClick={() => setActiveFilter('ready')}
            className={`filter-chip shrink-0 h-9 px-3.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              activeFilter === 'ready'
                ? 'bg-rose-600 text-white ring-2 ring-rose-300'
                : 'bg-rose-100 text-rose-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
            <span>Food Ready</span>
            <span className="font-bold">{metrics.ready}</span>
          </button>

          <button
            onClick={() => setActiveFilter('available')}
            className={`filter-chip shrink-0 h-9 px-3.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              activeFilter === 'available'
                ? 'bg-emerald-700 text-white'
                : 'bg-surface-container text-on-surface'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Available</span>
            <span className="font-bold">{metrics.vacant}</span>
          </button>

          <button
            onClick={() => setActiveFilter('occupied')}
            className={`filter-chip shrink-0 h-9 px-3.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              activeFilter === 'occupied'
                ? 'bg-amber-700 text-white'
                : 'bg-surface-container text-on-surface'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            <span>Occupied</span>
            <span className="font-bold">{metrics.seated}</span>
          </button>

          <button
            onClick={() => setActiveFilter('billing')}
            className={`filter-chip shrink-0 h-9 px-3.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              activeFilter === 'billing'
                ? 'bg-purple-700 text-white'
                : 'bg-surface-container text-on-surface'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-600"></span>
            <span>Billing</span>
            <span className="font-bold">{metrics.billing}</span>
          </button>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-1">
        {filteredTables.map((table) => {
          const isAvailable = table.status === 'available';
          const isReady = table.status === 'ready';
          const isPreparing = table.status === 'preparing';
          const isBilling = table.status === 'billing';
          const isOccupied = table.status === 'occupied';

          // Accent colors & styling
          let stripeColor = 'bg-emerald-500';
          let cardBg = 'bg-surface-container-lowest';
          let ringClass = '';
          let badge = (
            <span className="px-1.5 py-0.5 rounded text-[11px] bg-emerald-100 text-emerald-800 font-semibold">
              Vacant
            </span>
          );
          let bottomAction = (
            <span className="text-sm text-emerald-700 font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">add_circle</span> Order
            </span>
          );

          if (isReady) {
            stripeColor = 'bg-rose-600';
            cardBg = 'bg-rose-50/90';
            ringClass = 'ring-2 ring-rose-400 shadow-md animate-pulse';
            badge = (
              <span className="px-2 py-0.5 rounded-full text-[11px] bg-rose-600 text-white font-bold flex items-center gap-1 shadow-sm">
                <span className="material-symbols-outlined text-[12px] animate-bounce">notifications_active</span> READY
              </span>
            );
            bottomAction = (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs text-rose-900 font-bold">Serve Now! 🔔</span>
                <span className="text-xs font-bold text-primary">{formatCurrency(table.totalAmount)}</span>
              </div>
            );
          } else if (isPreparing) {
            stripeColor = 'bg-blue-500';
            cardBg = 'bg-blue-50/60';
            badge = (
              <span className="px-1.5 py-0.5 rounded text-[11px] bg-blue-100 text-blue-900 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px] animate-spin">soup_kitchen</span> Prep
              </span>
            );
            bottomAction = (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs text-blue-800 font-medium">In Kitchen</span>
                <span className="text-sm font-bold text-primary">{formatCurrency(table.totalAmount)}</span>
              </div>
            );
          } else if (isBilling) {
            stripeColor = 'bg-purple-600';
            cardBg = 'bg-purple-50/80';
            ringClass = 'ring-1 ring-purple-300';
            badge = (
              <span className="px-1.5 py-0.5 rounded text-[11px] bg-purple-200 text-purple-900 font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">receipt</span> Bill
              </span>
            );
            bottomAction = (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs text-purple-800 font-semibold">Print / Pay</span>
                <span className="text-sm font-bold text-purple-950">{formatCurrency(table.totalAmount)}</span>
              </div>
            );
          } else if (isOccupied) {
            stripeColor = 'bg-amber-500';
            cardBg = 'bg-amber-50/50';
            badge = (
              <span className="px-1.5 py-0.5 rounded text-[11px] bg-amber-100 text-amber-900 font-semibold">
                {table.guestCount || 2}p
              </span>
            );
            bottomAction = (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs text-on-surface-variant font-medium">Dining</span>
                <span className="text-sm font-bold text-primary">{formatCurrency(table.totalAmount)}</span>
              </div>
            );
          }

          return (
            <button
              key={table.tableNumber}
              onClick={() => handleTableClick(table)}
              className={`table-card flex flex-col justify-between h-[115px] p-3 rounded-xl ${cardBg} ${ringClass} border border-outline-variant/40 shadow-sm text-left relative overflow-hidden active:scale-95 transition-all hover:shadow-md cursor-pointer`}
            >
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${stripeColor}`}></div>

              <div className="flex items-center justify-between w-full">
                <span className="text-lg font-bold text-primary tracking-tight">
                  {table.tableNumber}
                </span>
                {badge}
              </div>

              <div className="flex flex-col w-full">
                <span className="text-[11px] text-on-surface-variant mb-0.5">
                  {table.capacity} seats • {table.currentWaiter || 'Floor'}
                </span>
                {bottomAction}
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Legend Bar */}
      <div className="p-3.5 rounded-xl bg-surface-container shadow-sm border border-outline-variant/30 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">
            Table Status Legend
          </span>
          <span className="text-xs text-on-surface-variant">Tap any table to start order or view bill</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-on-surface">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
            <span><strong>Green:</strong> Vacant / New Order</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></span>
            <span><strong>Blue:</strong> In Kitchen Prep</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
            <span><strong>Red:</strong> Food Ready to Serve!</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0"></span>
            <span><strong>Purple:</strong> Bill Requested</span>
          </div>
        </div>
      </div>

      {/* Micro-interaction Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2.5 bg-primary text-on-primary rounded-full shadow-2xl text-xs font-semibold flex items-center gap-2 z-50 animate-bounce">
          <span className="material-symbols-outlined text-[18px] text-tertiary-fixed">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

