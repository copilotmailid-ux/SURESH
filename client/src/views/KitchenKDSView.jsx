import React, { useState, useMemo } from 'react';
import { formatElapsedTime } from '../utils/formatters';
import { playKitchenChime } from '../utils/audio';

export const KitchenKDSView = ({ orders, onUpdateOrderStatus, onToggleItemCompletion }) => {
  const [activeLane, setActiveLane] = useState('ALL'); // 'ALL' | 'PREP' | 'READY'
  const [selectedStation, setSelectedStation] = useState('all');

  const stations = ['all', 'grill', 'fryer', 'oven', 'steamer', 'barista'];

  // Counts
  const counts = useMemo(() => {
    const prep = orders.filter((o) => o.status === 'preparing' || o.status === 'pending').length;
    const ready = orders.filter((o) => o.status === 'ready').length;
    const all = prep + ready;
    return { all, prep, ready };
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Must be active kitchen status
      if (!['pending', 'preparing', 'ready'].includes(order.status)) return false;

      // Lane filter
      if (activeLane === 'PREP' && order.status !== 'preparing' && order.status !== 'pending') return false;
      if (activeLane === 'READY' && order.status !== 'ready') return false;

      // Station filter
      if (selectedStation !== 'all') {
        const hasItemInStation = order.items.some((it) => it.station === selectedStation);
        if (!hasItemInStation) return false;
      }

      return true;
    });
  }, [orders, activeLane, selectedStation]);

  const handleDoneNotify = (order) => {
    playKitchenChime();
    onUpdateOrderStatus(order._id, 'ready');
  };

  const handleOrderPickedUp = (order) => {
    onUpdateOrderStatus(order._id, 'served');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 space-y-4">
      {/* Live Operational Metronome & Station Strip */}
      <section className="w-full bg-surface-container-low border border-outline-variant/40 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex w-3 h-3 rounded-full bg-on-tertiary-container animate-pulse"></span>
            <span className="text-xl font-bold text-primary tracking-tight">
              KDS Master Station: {selectedStation === 'all' ? 'All Kitchen' : selectedStation.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => playKitchenChime()}
              className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-lowest border border-outline-variant/40 rounded-full text-xs font-semibold text-primary hover:bg-surface-container shadow-sm active:scale-95 transition-all"
              title="Test Audio Chime"
            >
              <span className="material-symbols-outlined text-[16px] text-on-tertiary-container">
                notifications_active
              </span>
              <span>Test Bell 🔔</span>
            </button>

            <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1 rounded-full text-on-surface">
              <span className="material-symbols-outlined text-[16px] text-on-tertiary-container">speed</span>
              <span className="text-xs uppercase font-bold text-on-surface-variant">Pace: Optimal</span>
            </div>
          </div>
        </div>

        {/* Quick Status Stat Cards */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-3 flex flex-col items-center justify-center shadow-sm">
            <span className="text-xs text-on-tertiary-container uppercase font-bold tracking-wider">
              Pending
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-2xl font-extrabold text-primary tabular-nums">
                {orders.filter((o) => o.status === 'pending').length}
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-on-tertiary-container"></span>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-3 flex flex-col items-center justify-center shadow-sm">
            <span className="text-xs text-secondary uppercase font-bold tracking-wider">
              Cooking / Prep
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-2xl font-extrabold text-primary tabular-nums">{counts.prep}</span>
              <span className="inline-block w-2 h-2 rounded-full bg-secondary"></span>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-3 flex flex-col items-center justify-center shadow-sm">
            <span className="text-xs text-rose-600 uppercase font-bold tracking-wider">
              At The Pass (Ready)
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-2xl font-extrabold text-rose-700 tabular-nums">{counts.ready}</span>
              <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            </div>
          </div>
        </div>

        {/* Station Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <span className="text-xs text-on-surface-variant font-semibold mr-1">Station:</span>
          {stations.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStation(st)}
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                selectedStation === st
                  ? 'bg-primary-container text-on-primary shadow-sm'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </section>

      {/* Segmented Speed Lane Filter */}
      <div className="w-full bg-surface-container p-1 rounded-xl flex gap-1 shadow-inner border border-outline-variant/20">
        <button
          onClick={() => setActiveLane('ALL')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeLane === 'ALL'
              ? 'bg-surface-container-lowest text-primary shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          <span>ALL TICKETS</span>
          <span className="w-5 h-5 rounded-full bg-primary-container text-on-primary text-xs flex items-center justify-center">
            {counts.all}
          </span>
        </button>

        <button
          onClick={() => setActiveLane('PREP')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeLane === 'PREP'
              ? 'bg-surface-container-lowest text-primary shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          <span>IN PREPARATION</span>
          <span className="w-5 h-5 rounded-full bg-secondary-container text-on-secondary-container text-xs flex items-center justify-center">
            {counts.prep}
          </span>
        </button>

        <button
          onClick={() => setActiveLane('READY')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeLane === 'READY'
              ? 'bg-surface-container-lowest text-rose-800 shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          <span>READY AT PASS</span>
          <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-900 text-xs flex items-center justify-center">
            {counts.ready}
          </span>
        </button>
      </div>

      {/* Tickets Continuous Feed (Responsive Grid: 1 col on mobile, 2 on tablet, 3 on desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full py-16 text-center text-on-surface-variant flex flex-col items-center justify-center bg-surface-container-low rounded-2xl border border-outline-variant/30">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/50 mb-2">
              soup_kitchen
            </span>
            <p className="font-semibold text-base">No active tickets in this lane</p>
            <p className="text-xs text-on-surface-variant/70 mt-1">All orders plated & dispatched smoothly!</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isReady = order.status === 'ready';
            const stripeColor = isReady ? 'bg-rose-600' : 'bg-on-tertiary-container';
            const statusLabel = isReady ? 'AT THE PASS' : 'IN PREP';
            const badgeBg = isReady ? 'bg-rose-600 text-white' : 'bg-tertiary-container text-tertiary-fixed';

            return (
              <article
                key={order._id}
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div>
                  {/* Top Stripe */}
                  <div className={`h-2.5 w-full ${stripeColor}`}></div>

                  <div className="p-4 flex flex-col gap-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 pb-2 border-b border-outline-variant/30">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl sm:text-2xl font-extrabold text-primary tracking-tight">
                            {order.orderNumber}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed text-sm font-bold">
                            TABLE {order.tableNumber}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          Waiter: {order.waiterName || 'Rahul S.'} • {formatElapsedTime(order.createdAt)}
                        </p>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${badgeBg}`}>
                          {statusLabel}
                        </span>
                      </div>
                    </div>

                    {/* Order-level Kitchen Notes */}
                    {order.kitchenNotes && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-xs text-amber-900 font-medium flex items-start gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-amber-700 shrink-0 mt-0.5">
                          info
                        </span>
                        <span>{order.kitchenNotes}</span>
                      </div>
                    )}

                    {/* Checklist of Items */}
                    <div className="flex flex-col gap-2.5">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className={`rounded-xl p-3 flex flex-col gap-1 transition-all ${
                            item.isCompleted
                              ? 'bg-surface-container opacity-60'
                              : 'bg-surface-container-low border border-outline-variant/30'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5 min-w-0">
                              {/* Plating toggle checkbox */}
                              <button
                                type="button"
                                onClick={() => onToggleItemCompletion(order._id, idx)}
                                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                                  item.isCompleted
                                    ? 'bg-primary-container text-white'
                                    : 'bg-surface-container-lowest border border-outline-variant/60 text-primary hover:bg-surface-container'
                                }`}
                              >
                                <span className="material-symbols-outlined text-[18px]">
                                  {item.isCompleted ? 'done' : 'check_box_outline_blank'}
                                </span>
                              </button>

                              <span className="w-6 h-6 rounded bg-primary text-on-primary text-xs font-bold flex items-center justify-center shrink-0">
                                {item.quantity}
                              </span>

                              <span
                                className={`text-sm font-bold text-on-surface truncate ${
                                  item.isCompleted ? 'line-through text-on-surface-variant' : ''
                                }`}
                              >
                                {item.name}
                              </span>
                            </div>

                            <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant text-[10px] font-bold uppercase shrink-0">
                              {item.station}
                            </span>
                          </div>

                          {/* Item-specific Notes */}
                          {item.notes && (
                            <div className="pl-9">
                              <span className="inline-block bg-tertiary-container/10 border border-tertiary-container/30 text-tertiary-container text-xs font-semibold px-2 py-0.5 rounded">
                                ⚡ Note: {item.notes}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Big Tactile Action Buttons */}
                <div className="p-4 pt-0">
                  {!isReady ? (
                    <button
                      onClick={() => handleDoneNotify(order)}
                      className="w-full h-12 bg-primary hover:bg-primary-container text-on-primary rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px] text-tertiary-fixed">
                        notifications_active
                      </span>
                      <span>DONE • NOTIFY WAITER</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOrderPickedUp(order)}
                      className="w-full h-12 bg-surface-container-highest hover:bg-surface-container text-primary rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer border border-outline-variant/40"
                    >
                      <span className="material-symbols-outlined text-[20px] text-emerald-700">done_all</span>
                      <span>ORDER PICKED UP / SERVED</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Ambient Sound Cue Reminder for Kitchen Floor */}
      <div className="flex items-center justify-center gap-2 py-3 text-on-surface-variant text-xs">
        <span className="material-symbols-outlined text-[18px]">volume_up</span>
        <span className="font-semibold uppercase tracking-wider">
          Live Real-Time Audio Chimes Active • Auto-Refresh Enabled
        </span>
      </div>
    </div>
  );
};

