import React, { useState } from 'react';
import { formatCurrency, formatElapsedTime } from '../utils/formatters';

export const AdminDashboardView = ({
  metrics,
  hourlySales,
  tenderBreakdown,
  topSellers,
  orders,
  onNavigateToBilling,
}) => {
  const [trendFilter, setTrendFilter] = useState('daily');
  const [isZReportOpen, setIsZReportOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 space-y-5 pb-24">
      {/* Operational Live Status Banner */}
      <section className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-surface-container-low shrink-0 border border-outline-variant/30">
            <span className="material-symbols-outlined text-primary text-[24px]">coffee_maker</span>
            <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-on-tertiary-container opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-on-tertiary-container"></span>
            </span>
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg text-primary truncate">Cafe Central Deck</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-on-surface text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container"></span>
                LIVE SYNC
              </span>
            </div>
            <p className="text-xs text-on-surface-variant truncate">
              Peak evening surge active • 2 baristas logged in • Register 01
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToBilling}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-primary-container hover:bg-primary text-on-primary rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">receipt_long</span>
            <span>Table Billing Desk</span>
          </button>

          <button
            onClick={handleRefresh}
            className="w-10 h-10 rounded-xl bg-surface-container hover:bg-surface-variant border border-outline-variant/30 flex items-center justify-center text-primary transition-all active:scale-95 shrink-0"
            title="Refresh Metrics"
          >
            <span className={`material-symbols-outlined text-[20px] ${isRefreshing ? 'animate-spin' : ''}`}>
              sync
            </span>
          </button>
        </div>
      </section>

      {/* Section 1: Today's Overview (2x2 Grid) */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-bold text-primary tracking-tight">Today's Pulse</h2>
          <span className="text-xs text-on-tertiary-container font-semibold">Auto-sync 15s</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full">
          {/* Revenue */}
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-4 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs text-on-surface-variant font-medium">Today's Sales</span>
              <span className="material-symbols-outlined text-on-tertiary-container text-[20px]">
                currency_rupee
              </span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-primary tabular-nums">
                {formatCurrency(metrics.todaySales)}
              </div>
              <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-700 font-semibold">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                <span>+14% vs yesterday</span>
              </div>
            </div>
          </div>

          {/* Orders */}
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-4 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs text-on-surface-variant font-medium">Total Orders</span>
              <span className="material-symbols-outlined text-primary text-[20px]">receipt_long</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-primary tabular-nums">
                {metrics.totalOrders}{' '}
                <span className="text-xs font-normal text-on-surface-variant">tickets</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-[11px] text-on-surface-variant">
                <span>Floor: 64 • Takeaway: 22</span>
              </div>
            </div>
          </div>

          {/* AOV */}
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-4 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs text-on-surface-variant font-medium">Average Order (AOV)</span>
              <span className="material-symbols-outlined text-primary text-[20px]">analytics</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-primary tabular-nums">
                {formatCurrency(metrics.aov)}
              </div>
              <div className="flex items-center gap-1 mt-1 text-[11px] text-on-tertiary-container font-semibold">
                <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                <span>+₹18 above benchmark</span>
              </div>
            </div>
          </div>

          {/* Live Kitchen */}
          <div className="bg-surface-container-low border border-outline-variant/40 rounded-2xl p-4 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs text-primary font-bold">Active in Kitchen</span>
              <span className="material-symbols-outlined text-on-tertiary-container text-[20px]">
                soup_kitchen
              </span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-primary tabular-nums flex items-center gap-2">
                <span>{metrics.activeKitchenCount}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-white">
                  Cooking
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-[11px] text-on-surface font-medium">
                <span>Avg prep time: 8.4 mins</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Sales Velocity & Hourly Flow */}
      <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-primary">Sales Velocity</h3>
            <p className="text-xs text-on-surface-variant">Today's rush curve (10 AM - 10 PM)</p>
          </div>

          <div className="inline-flex p-0.5 rounded-lg bg-surface-container border border-outline-variant/30 text-xs">
            {['daily', 'weekly', 'monthly'].map((f) => (
              <button
                key={f}
                onClick={() => setTrendFilter(f)}
                className={`px-2.5 py-1 rounded-md font-semibold capitalize transition-all ${
                  trendFilter === f
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Rush Highlights */}
        <div className="grid grid-cols-2 gap-2.5 mt-1">
          <div className="bg-surface-container-low rounded-xl p-3 flex items-center gap-3 border border-outline-variant/30">
            <div className="w-2.5 h-8 rounded-full bg-primary-container shrink-0"></div>
            <div className="min-w-0">
              <span className="text-xs text-on-surface-variant block font-medium">Lunch Peak (1 PM)</span>
              <span className="text-base font-bold text-primary tabular-nums">₹4,200 (19 tkts)</span>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-xl p-3 flex items-center gap-3 border border-outline-variant/30">
            <div className="w-2.5 h-8 rounded-full bg-on-tertiary-container shrink-0"></div>
            <div className="min-w-0">
              <span className="text-xs text-on-surface-variant block font-medium">Evening Rush (6 PM)</span>
              <span className="text-base font-bold text-primary tabular-nums">₹5,600 (26 tkts)</span>
            </div>
          </div>
        </div>

        {/* Scaled Hourly Bar Visualization (SVG) */}
        <div className="w-full flex flex-col gap-1 pt-2">
          <div className="h-36 w-full flex items-end justify-between gap-2 px-2 pt-4 bg-surface-container-low/50 rounded-xl border border-outline-variant/20">
            {hourlySales.map((item, idx) => {
              const maxSale = 5600;
              const heightPercent = Math.max(15, Math.round((item.sales / maxSale) * 100));
              const isPeak = item.isPeak;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[10px] text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity font-semibold tabular-nums">
                    ₹{item.sales}
                  </span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[28px] rounded-t-md transition-all group-hover:brightness-110 shadow-sm ${
                      isPeak ? 'bg-primary-container' : 'bg-primary-fixed-dim'
                    }`}
                  ></div>
                  <span className={`text-[10px] truncate ${isPeak ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 3: Payment Method Breakdown */}
      <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-primary">Settlement Breakdown</h3>
            <p className="text-xs text-on-surface-variant">Real-time revenue split across tenders</p>
          </div>
          <span className="text-base font-bold text-primary tabular-nums">
            {formatCurrency(tenderBreakdown.total)}
          </span>
        </div>

        {/* Segmented Multi-Color Progress Bar */}
        <div className="w-full flex flex-col gap-1.5">
          <div className="h-3.5 w-full rounded-full bg-surface-container flex overflow-hidden shadow-inner">
            <div style={{ width: '62%' }} className="h-full bg-primary-container" title="UPI: 62%"></div>
            <div style={{ width: '27%' }} className="h-full bg-on-tertiary-container" title="Cash: 27%"></div>
            <div style={{ width: '11%' }} className="h-full bg-secondary" title="Card POS: 11%"></div>
          </div>
        </div>

        {/* Detailed Tender Tiles */}
        <div className="flex flex-col gap-2 mt-1">
          {tenderBreakdown.tenders.map((tender, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/30"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">
                    {tender.code === 'upi' ? 'qr_code_scanner' : tender.code === 'cash' ? 'payments' : 'credit_card'}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-primary truncate">
                      {tender.name}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-primary-fixed text-on-primary-fixed">
                      {tender.tag}
                    </span>
                  </div>
                  <span className="text-xs text-on-surface-variant">{tender.description}</span>
                </div>
              </div>

              <div className="flex flex-col text-right shrink-0">
                <span className="text-sm font-bold text-primary tabular-nums">
                  {formatCurrency(tender.amount)}
                </span>
                <span className="text-xs text-on-surface-variant font-medium">
                  {tender.percentage}% ({tender.orderCount} orders)
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Top Selling Items */}
      <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-on-tertiary-container text-[22px]">
              local_fire_department
            </span>
            <h3 className="font-bold text-base text-primary">Top Sellers</h3>
          </div>
          <span className="text-xs text-on-surface-variant font-medium">By item volume</span>
        </div>

        <div className="flex flex-col gap-2.5 divide-y divide-outline-variant/20">
          {topSellers.map((item) => (
            <div key={item.rank} className="flex items-center justify-between gap-3 pt-2.5 first:pt-0">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-sm"
                />
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-on-primary bg-primary w-4 h-4 rounded-full flex items-center justify-center shrink-0">
                      {item.rank}
                    </span>
                    <span className="text-sm font-semibold text-primary truncate">{item.name}</span>
                  </div>
                  <span className="text-xs text-on-surface-variant">
                    {item.unitsSold} portions dispatched • {item.category}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <span className="text-sm font-bold text-primary tabular-nums">
                  {formatCurrency(item.revenue)}
                </span>
                <span className="text-[11px] text-on-tertiary-container font-semibold">
                  {formatCurrency(item.avgPrice)} avg
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 5: Recent Live Order Feed */}
      <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">find_replace</span>
            <h3 className="font-bold text-base text-primary">Live Transactions & Orders Feed</h3>
          </div>
          <span className="text-xs text-on-tertiary-container font-semibold">Real-Time</span>
        </div>

        <div className="flex flex-col gap-2">
          {orders.slice(0, 5).map((ord) => {
            const isPaid = ord.paymentStatus === 'paid';
            return (
              <div
                key={ord._id}
                className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col items-center justify-center text-primary font-bold text-xs shrink-0 shadow-sm">
                    <span className="text-[9px] text-on-surface-variant font-medium">TBL</span>
                    <span>{ord.tableNumber}</span>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-primary">{ord.orderNumber}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-surface-container text-on-surface uppercase">
                        {ord.paymentMethod || 'Dine-in'}
                      </span>
                    </div>
                    <span className="text-xs text-on-surface-variant">
                      {formatElapsedTime(ord.createdAt)} • Server: {ord.waiterName || 'Rahul S.'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <span className="text-sm font-bold text-primary tabular-nums">
                    {formatCurrency(ord.total)}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                      isPaid ? 'text-emerald-700' : 'text-on-tertiary-container'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isPaid ? 'bg-emerald-600' : 'bg-on-tertiary-container animate-pulse'
                      }`}
                    ></span>
                    {isPaid ? 'Paid' : 'Unsettled'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 6: End of Day Z-Report Banner */}
      <section className="w-full bg-primary text-on-primary rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-col min-w-0">
          <span className="text-base sm:text-lg font-bold">End of Day (EOD) Z-Report</span>
          <span className="text-xs text-primary-fixed-dim">
            Reconcile daily cash till drawer, print GST tax audit, and close register
          </span>
        </div>
        <button
          onClick={() => setIsZReportOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-surface-container-lowest hover:bg-surface text-primary font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap"
        >
          Generate Z-Report
        </button>
      </section>

      {/* Z-Report Modal */}
      {isZReportOpen && (
        <div className="fixed inset-0 z-50 bg-primary/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">receipt</span>
                <span className="font-bold text-base text-primary">Daily Z-Report Audit</span>
              </div>
              <button
                onClick={() => setIsZReportOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="font-mono text-xs text-on-surface-variant bg-surface-container-low p-4 rounded-xl space-y-2 border border-outline-variant/30">
              <div className="text-center font-bold text-primary text-sm pb-1 border-b border-dashed border-outline-variant/60">
                CAFEFLOW POS • AUDIT RECEIPT
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span className="font-bold text-on-surface">24 Oct 2024</span>
              </div>
              <div className="flex justify-between">
                <span>Register:</span>
                <span className="font-bold text-on-surface">POS-TILL-01</span>
              </div>
              <div className="flex justify-between">
                <span>Manager:</span>
                <span className="font-bold text-on-surface">Anand M.</span>
              </div>
              <div className="border-t border-dashed border-outline-variant/60 my-2 pt-2 space-y-1">
                <div className="flex justify-between">
                  <span>Gross Sales:</span>
                  <span className="font-bold text-on-surface">₹17,571.00</span>
                </div>
                <div className="flex justify-between">
                  <span>GST 5%:</span>
                  <span className="font-bold text-on-surface">₹879.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Net Revenue:</span>
                  <span className="font-bold text-primary text-sm">₹18,450.00</span>
                </div>
              </div>
              <div className="border-t border-dashed border-outline-variant/60 my-2 pt-2 space-y-1">
                <div className="flex justify-between">
                  <span>UPI Settlements:</span>
                  <span className="font-bold">₹11,450.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Cash in Drawer:</span>
                  <span className="font-bold">₹5,000.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Card POS Swipes:</span>
                  <span className="font-bold">₹2,000.00</span>
                </div>
              </div>
              <div className="text-center font-bold text-emerald-700 pt-2 border-t border-dashed border-outline-variant/60">
                STATUS: RECONCILED & BALANCED ✓
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                  setIsZReportOpen(false);
                }}
                className="flex-1 h-11 bg-primary text-on-primary rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                <span>Print Thermal Copy</span>
              </button>
              <button
                onClick={() => setIsZReportOpen(false)}
                className="px-4 h-11 bg-surface-container rounded-xl font-semibold text-xs text-on-surface"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

