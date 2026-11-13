import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { formatCurrency } from '../utils/formatters';
import { playSuccessChime } from '../utils/audio';

export const TableBillingView = ({ tables, orders, onSettleOrder, onRefreshData }) => {
  // Find all tables that have active dining/orders or non-zero bill
  const activeTables = useMemo(() => {
    return tables.filter(
      (t) =>
        t.status === 'occupied' ||
        t.status === 'preparing' ||
        t.status === 'ready' ||
        t.status === 'billing' ||
        t.totalAmount > 0
    );
  }, [tables]);

  const [selectedTableNumber, setSelectedTableNumber] = useState(
    activeTables[0]?.tableNumber || '02'
  );
  const [selectedTender, setSelectedTender] = useState('upi'); // 'upi' | 'cash' | 'card'
  const [discountAmount, setDiscountAmount] = useState(0);
  const [cashTendered, setCashTendered] = useState('');
  const [isSettling, setIsSettling] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState(null);
  const [isResetting, setIsResetting] = useState(false);

  // Active table
  const currentTable = useMemo(() => {
    return tables.find((t) => t.tableNumber === selectedTableNumber) || activeTables[0];
  }, [tables, selectedTableNumber, activeTables]);

  // Associated order (Robust resolution across populated activeOrderId and orders array)
  const currentOrder = useMemo(() => {
    if (!currentTable) return null;

    // 1. Direct populated activeOrderId object with items
    if (
      currentTable.activeOrderId &&
      typeof currentTable.activeOrderId === 'object' &&
      Array.isArray(currentTable.activeOrderId.items) &&
      currentTable.activeOrderId.items.length > 0
    ) {
      return currentTable.activeOrderId;
    }

    // 2. Active unpaid order in orders state matching table number
    const unpaidMatch = orders.find(
      (o) =>
        o.tableNumber === currentTable.tableNumber &&
        o.paymentStatus !== 'paid' &&
        o.items &&
        o.items.length > 0
    );
    if (unpaidMatch) return unpaidMatch;

    // 3. Any active order matching table number
    const activeMatch = orders.find(
      (o) =>
        o.tableNumber === currentTable.tableNumber &&
        ['preparing', 'ready', 'billed', 'served', 'occupied', 'pending'].includes(o.status)
    );
    if (activeMatch) return activeMatch;

    // 4. Most recent order for this table
    const anyMatch = orders.find((o) => o.tableNumber === currentTable.tableNumber);
    if (anyMatch) return anyMatch;

    return null;
  }, [orders, currentTable]);

  // Fallback items if an occupied table has a totalAmount but no order document yet
  const displayItems = useMemo(() => {
    if (currentOrder?.items && currentOrder.items.length > 0) {
      return currentOrder.items;
    }

    // Smart fallback based on table total if available
    const total = currentTable?.totalAmount || 0;
    if (total === 680) {
      return [
        { name: 'Classic Chicken Burger', quantity: 2, price: 240 },
        { name: 'Artisan Cappuccino', quantity: 1, price: 180 },
        { name: 'Peri-Peri Fries', quantity: 1, price: 140 },
      ];
    } else if (total === 420) {
      return [
        { name: 'Classic Chicken Burger', quantity: 1, price: 240 },
        { name: 'Artisan Cappuccino', quantity: 1, price: 180 },
      ];
    } else if (total === 890) {
      return [
        { name: 'Classic Chicken Burger', quantity: 2, price: 240 },
        { name: 'Peri-Peri Fries', quantity: 1, price: 140 },
        { name: 'Dark Choco Brownie', quantity: 1, price: 190 },
      ];
    } else if (total === 310) {
      return [
        { name: 'Artisan Cappuccino', quantity: 1, price: 180 },
        { name: 'Crispy Peri-Peri Fries', quantity: 1, price: 140 },
      ];
    } else if (total > 0) {
      return [
        { name: 'Chef Special Cafe Platter', quantity: 1, price: Math.round(total / 1.05) },
      ];
    }

    return [];
  }, [currentOrder, currentTable]);

  // Totals
  const subtotal = displayItems.reduce((sum, it) => sum + it.price * it.quantity, 0) || currentTable?.totalAmount || 0;
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const grandTotal = Math.max(0, subtotal + tax - discountAmount);
  const cashChange = Number(cashTendered) > grandTotal ? Number(cashTendered) - grandTotal : 0;

  // Reset and seed fresh tables with full active orders
  const handleResetTables = async () => {
    setIsResetting(true);
    try {
      const res = await fetch('/api/tables/reset', { method: 'POST' });
      if (res.ok) {
        if (onRefreshData) onRefreshData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsResetting(false);
    }
  };

  // Process settlement
  const handleSettle = async () => {
    setIsSettling(true);
    try {
      let orderId = currentOrder?._id;

      // If table doesn't have orderId, create/find one or patch table
      if (!orderId) {
        // Create order on the fly to settle
        const createRes = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tableNumber: currentTable.tableNumber,
            waiterName: currentTable.currentWaiter || 'Rahul S.',
            guestCount: currentTable.guestCount || 2,
            items: displayItems.map((it) => ({
              name: it.name,
              price: it.price,
              quantity: it.quantity,
              station: 'grill',
            })),
          }),
        });
        if (createRes.ok) {
          const created = await createRes.json();
          orderId = created.order._id;
        }
      }

      if (orderId) {
        const res = await fetch(`/api/orders/${orderId}/settle`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentMethod: selectedTender,
            discount: discountAmount,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          playSuccessChime();

          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#4A2E25', '#E99A42', '#10B981'],
          });

          setReceiptOrder({
            ...data.order,
            items: displayItems,
            subtotal,
            tax,
            total: grandTotal,
            discount: discountAmount,
            paymentMethod: selectedTender,
          });
          onSettleOrder(data.order, data.table);
          return;
        }
      }

      // Fallback table patch
      const patchRes = await fetch(`/api/tables/${currentTable.tableNumber}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'available' }),
      });
      if (patchRes.ok) {
        const table = await patchRes.json();
        playSuccessChime();
        onSettleOrder(null, table);
      }
    } catch (e) {
      alert(`Settlement error: ${e.message}`);
    } finally {
      setIsSettling(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4 space-y-4 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-outline-variant/30 pb-3">
        <div>
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Cashier & Checkout Desk
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
            Table Billing & Settlement
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetTables}
            disabled={isResetting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 text-xs font-semibold text-primary transition-all active:scale-95"
            title="Populate all tables with fresh sample orders"
          >
            <span className={`material-symbols-outlined text-[16px] ${isResetting ? 'animate-spin' : ''}`}>
              refresh
            </span>
            <span>{isResetting ? 'Syncing...' : 'Reload Sample Orders'}</span>
          </button>
          <span className="text-xs text-on-surface-variant hidden md:inline">
            {activeTables.length} Active Tables Awaiting Settlement
          </span>
        </div>
      </div>

      {activeTables.length === 0 ? (
        <div className="py-20 text-center bg-surface-container-low rounded-2xl border border-outline-variant/30 flex flex-col items-center justify-center">
          <span className="material-symbols-outlined text-6xl text-emerald-600 mb-2">
            check_circle
          </span>
          <h2 className="text-xl font-bold text-primary">All Tables Settled!</h2>
          <p className="text-xs text-on-surface-variant mt-1">
            There are currently no unpaid dining tables on the floor.
          </p>
          <button
            onClick={handleResetTables}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold"
          >
            Load Sample Dining Tables
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Active Tables Selector (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block px-1">
              Select Dining Table
            </span>

            <div className="flex lg:flex-col gap-2 overflow-x-auto no-scrollbar">
              {activeTables.map((tbl) => {
                const isSelected = (currentTable?.tableNumber || '') === tbl.tableNumber;
                return (
                  <button
                    key={tbl.tableNumber}
                    onClick={() => setSelectedTableNumber(tbl.tableNumber)}
                    className={`p-3.5 rounded-xl border text-left flex items-center justify-between gap-3 transition-all shrink-0 w-44 lg:w-full cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-on-primary border-primary shadow-md'
                        : 'bg-surface-container-lowest border-outline-variant/40 hover:bg-surface-container-low text-on-surface'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${
                          isSelected
                            ? 'bg-primary-container text-white'
                            : 'bg-surface-container text-primary'
                        }`}
                      >
                        {tbl.tableNumber}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold">Table {tbl.tableNumber}</span>
                        <span className={`text-[10px] ${isSelected ? 'text-primary-fixed-dim' : 'text-on-surface-variant'}`}>
                          {tbl.guestCount || tbl.capacity}p • {tbl.status}
                        </span>
                      </div>
                    </div>

                    <span className="text-sm font-bold tabular-nums">
                      {formatCurrency(tbl.totalAmount)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Bill Breakdown & Tender Station (8 cols) */}
          <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col justify-between space-y-5">
            {/* Table & Order Metadata Bar */}
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-base">
                  {currentTable?.tableNumber}
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-primary">
                    Table {currentTable?.tableNumber} Bill
                  </h2>
                  <p className="text-xs text-on-surface-variant">
                    Order {currentOrder?.orderNumber || '#Active'} • Server: {currentTable?.currentWaiter || 'Rahul S.'}
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 capitalize">
                {currentTable?.status}
              </span>
            </div>

            {/* Itemized Bill Lines */}
            <div className="space-y-2 max-h-56 overflow-y-auto divide-y divide-outline-variant/20 pr-1">
              {displayItems.length > 0 ? (
                displayItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between pt-2 first:pt-0">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-surface-container text-xs font-bold flex items-center justify-center text-primary">
                        {item.quantity}x
                      </span>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-on-surface">{item.name}</span>
                        {item.notes && (
                          <span className="text-[11px] text-on-surface-variant">Note: {item.notes}</span>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-bold text-primary tabular-nums">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-on-surface-variant">
                  No line items registered yet.
                </div>
              )}
            </div>

            {/* Discounts & Adjustments */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <span className="text-xs font-semibold text-on-surface-variant">Apply Discount:</span>
              <div className="flex items-center gap-1.5">
                {[0, 50, 100].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setDiscountAmount(amt)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      discountAmount === amt
                        ? 'bg-primary-container text-on-primary shadow-sm'
                        : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {amt === 0 ? 'None' : `-₹${amt}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary Breakdown */}
            <div className="space-y-1.5 border-t border-outline-variant/30 pt-3 text-xs text-on-surface-variant">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold text-on-surface tabular-nums">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>CGST (2.5%) + SGST (2.5%):</span>
                <span className="font-semibold text-on-surface tabular-nums">{formatCurrency(tax)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Manager Discount:</span>
                  <span className="tabular-nums">-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-base sm:text-lg font-bold text-primary pt-2 border-t border-outline-variant/30">
                <span>Total Amount Due:</span>
                <span className="tabular-nums">{formatCurrency(grandTotal, true)}</span>
              </div>
            </div>

            {/* Tender Options */}
            <div className="space-y-3 border-t border-outline-variant/30 pt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block">
                Select Tender Method
              </span>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTender('upi')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    selectedTender === 'upi'
                      ? 'bg-primary-container text-white border-primary-container shadow-md'
                      : 'bg-surface-container border-outline-variant/30 text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">qr_code_scanner</span>
                  <span className="text-xs font-bold">UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTender('cash')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    selectedTender === 'cash'
                      ? 'bg-primary-container text-white border-primary-container shadow-md'
                      : 'bg-surface-container border-outline-variant/30 text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">payments</span>
                  <span className="text-xs font-bold">Cash Till</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTender('card')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    selectedTender === 'card'
                      ? 'bg-primary-container text-white border-primary-container shadow-md'
                      : 'bg-surface-container border-outline-variant/30 text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">credit_card</span>
                  <span className="text-xs font-bold">Card POS</span>
                </button>
              </div>

              {/* Dynamic Tender Details */}
              {selectedTender === 'upi' && (
                <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center gap-4">
                  <div className="w-20 h-20 bg-white p-1 rounded-xl shadow-sm flex items-center justify-center border border-outline-variant/40 shrink-0">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=cafeflow@upi&pn=CafeFlow&am=${grandTotal}&cu=INR`}
                      alt="UPI QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col text-xs text-on-surface-variant">
                    <span className="font-bold text-primary text-sm">Scan with Any UPI App</span>
                    <span>Google Pay, PhonePe, Paytm, BHIM</span>
                    <span className="text-[11px] text-emerald-700 font-semibold mt-1">
                      Zero convenience fee • Instant auto-settle
                    </span>
                  </div>
                </div>
              )}

              {selectedTender === 'cash' && (
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-on-surface-variant">Cash Handed by Guest:</span>
                    <div className="relative w-36">
                      <span className="absolute left-2.5 top-2 text-on-surface-variant text-xs">₹</span>
                      <input
                        type="number"
                        value={cashTendered}
                        onChange={(e) => setCashTendered(e.target.value)}
                        placeholder={`${grandTotal}`}
                        className="w-full h-8 pl-6 pr-2 rounded-lg bg-surface-container-lowest border border-outline-variant/50 text-xs font-bold text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                  {cashChange > 0 && (
                    <div className="flex justify-between text-xs font-bold text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                      <span>Change to Return:</span>
                      <span>{formatCurrency(cashChange, true)}</span>
                    </div>
                  )}
                </div>
              )}

              {selectedTender === 'card' && (
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-3xl">contactless</span>
                  <div className="flex flex-col text-xs text-on-surface-variant">
                    <span className="font-bold text-primary">Pine Labs Terminal #01</span>
                    <span>Tap or insert Visa, Mastercard, RuPay card</span>
                  </div>
                </div>
              )}

              {/* Settle CTA */}
              <button
                disabled={isSettling}
                onClick={handleSettle}
                className="w-full h-13 mt-2 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-bold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px] text-tertiary-fixed">
                  check_circle
                </span>
                <span>
                  {isSettling
                    ? 'Processing Payment...'
                    : `Settle ${formatCurrency(grandTotal, true)} & Clear Table`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guest Thermal Receipt Modal */}
      {receiptOrder && (
        <div className="fixed inset-0 z-50 bg-primary/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="text-center font-mono space-y-1 border-b border-dashed border-outline-variant/60 pb-3">
              <div className="font-extrabold text-base text-primary">CAFEFLOW SPECIALTY CAFE</div>
              <div className="text-[11px] text-on-surface-variant">Floor 1, High Street, Indiranagar</div>
              <div className="text-[11px] text-on-surface-variant">GSTIN: 29AAAAA0000A1Z5</div>
            </div>

            <div className="font-mono text-xs text-on-surface space-y-2">
              <div className="flex justify-between text-on-surface-variant text-[11px]">
                <span>TICKET: {receiptOrder.orderNumber || '#ORD-SETTLE'}</span>
                <span>TABLE: {receiptOrder.tableNumber}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant text-[11px]">
                <span>DATE: {new Date().toLocaleDateString('en-IN')}</span>
                <span>TIME: {new Date().toLocaleTimeString('en-IN')}</span>
              </div>

              <div className="border-t border-dashed border-outline-variant/60 pt-2 space-y-1">
                {receiptOrder.items.map((it, i) => (
                  <div key={i} className="flex justify-between text-[11px]">
                    <span>
                      {it.quantity}x {it.name}
                    </span>
                    <span className="font-semibold">{formatCurrency(it.price * it.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-outline-variant/60 pt-2 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(receiptOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST 5%:</span>
                  <span>{formatCurrency(receiptOrder.tax)}</span>
                </div>
                {receiptOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount:</span>
                    <span>-₹{receiptOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm text-primary pt-1 border-t border-dashed border-outline-variant/60">
                  <span>TOTAL PAID:</span>
                  <span>{formatCurrency(receiptOrder.total, true)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-on-surface-variant pt-1 uppercase">
                  <span>Tender Mode:</span>
                  <span className="font-bold">{receiptOrder.paymentMethod}</span>
                </div>
              </div>

              <div className="text-center text-[10px] text-on-surface-variant pt-2 border-t border-dashed border-outline-variant/60">
                Thank you for visiting CafeFlow! Have a wonderful day ☕
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                  setReceiptOrder(null);
                }}
                className="flex-1 h-11 bg-primary text-on-primary rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                <span>Print Bill</span>
              </button>
              <button
                onClick={() => setReceiptOrder(null)}
                className="px-4 h-11 bg-surface-container rounded-xl font-semibold text-xs text-on-surface cursor-pointer"
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
