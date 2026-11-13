import React, { useState, useMemo } from 'react';
import { formatCurrency } from '../utils/formatters';
import { playSuccessChime } from '../utils/audio';

export const MenuView = ({ table, menuItems, onBackToFloor, onOrderSubmitted }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState({}); // { [itemId]: { item, quantity, notes } }
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [guestCount, setGuestCount] = useState(table?.guestCount || 2);
  const [kitchenNotes, setKitchenNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'burgers', label: 'Burgers' },
    { id: 'pizza', label: 'Pizza' },
    { id: 'snacks', label: 'Snacks' },
    { id: 'momos', label: 'Momos' },
    { id: 'beverages', label: 'Beverages' },
    { id: 'desserts', label: 'Desserts' },
  ];

  // Filtered menu items
  const filteredMenu = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesQuery =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  // Cart operations
  const updateQuantity = (item, delta) => {
    setCart((prev) => {
      const current = prev[item._id]?.quantity || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[item._id];
        return copy;
      }
      return {
        ...prev,
        [item._id]: {
          item,
          quantity: next,
          notes: prev[item._id]?.notes || '',
        },
      };
    });
  };

  const cartList = Object.values(cart);
  const totalItemCount = cartList.reduce((sum, c) => sum + c.quantity, 0);
  const subtotal = cartList.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const grandTotal = subtotal + tax;

  // Fire ticket to kitchen
  const handleFireTicket = async () => {
    if (isSubmitting || cartList.length === 0) return;
    setIsSubmitting(true);
    try {
      const orderPayload = {
        tableNumber: table.tableNumber,
        waiterName: table.currentWaiter || 'Rahul S.',
        guestCount,
        orderType: 'dine_in',
        kitchenNotes,
        items: cartList.map((c) => ({
          menuItemId: c.item._id,
          name: c.item.name,
          price: c.item.price,
          quantity: c.quantity,
          station: c.item.station || 'grill',
          notes: c.notes || '',
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (res.ok) {
        setCart({});
        setIsCartOpen(false);
        playSuccessChime();
        onOrderSubmitted();
      } else {
        const data = await res.json();
        alert(`Failed to place order: ${data.error}`);
      }
    } catch (err) {
      alert(`Network error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-32">
      {/* Context Sub-Bar (Sticky Top) */}
      <div className="sticky top-16 z-30 bg-surface-container-low border-b border-outline-variant/30 px-4 py-2.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBackToFloor}
            className="w-10 h-10 rounded-full bg-surface-container-lowest border border-outline-variant/40 flex items-center justify-center text-primary active:scale-95 shadow-sm transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-primary text-base sm:text-lg">
                Table {table?.tableNumber || '01'}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-[11px] font-semibold">
                {guestCount} Guests
              </span>
            </div>
            <span className="text-xs text-on-surface-variant truncate">
              Server: {table?.currentWaiter || 'Rahul S.'} • Floor 1
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-surface-container-lowest border border-outline-variant/40 rounded-full px-2.5 py-1 text-xs text-primary font-medium">
            <span className="material-symbols-outlined text-[16px] mr-1">restaurant</span>
            <span>Dine-in</span>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="px-4 pt-3 pb-1">
        <div className="relative w-full flex items-center">
          <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px] pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dishes, drinks (e.g. Burger, Coffee)..."
            className="w-full h-11 pl-11 pr-10 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm text-on-surface placeholder:text-on-surface-variant/70 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-outline hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[18px]">cancel</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="px-4 py-2 overflow-x-auto no-scrollbar flex items-center gap-2">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold shadow-sm transition-all cursor-pointer ${
                isSelected
                  ? 'bg-primary-container text-on-primary ring-2 ring-primary-container/20'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Food Catalog 2-Column Responsive Card Grid */}
      <div className="px-4 pt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filteredMenu.map((item) => {
          const qty = cart[item._id]?.quantity || 0;
          return (
            <div
              key={item._id}
              className="flex flex-col bg-surface-container-lowest border border-outline-variant/40 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <div className="relative w-full h-32 bg-surface-container overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
                {item.tag && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur text-primary text-[10px] font-bold shadow-sm">
                    {item.tag}
                  </span>
                )}
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-primary-container/80 text-white text-[9px] font-bold uppercase tracking-wider">
                  {item.station}
                </span>
              </div>

              <div className="p-3 flex flex-col justify-between flex-1 gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm text-on-surface truncate leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-1">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-base font-bold text-primary tabular-nums">
                    {formatCurrency(item.price)}
                  </span>
                </div>

                {/* Quantity Controls */}
                {qty === 0 ? (
                  <button
                    onClick={() => updateQuantity(item, 1)}
                    className="h-10 w-full rounded-xl bg-surface-container-low hover:bg-primary-container hover:text-on-primary text-primary text-xs font-semibold flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span>Add</span>
                  </button>
                ) : (
                  <div className="h-10 w-full rounded-xl bg-surface-container-low flex items-center justify-between px-1 border border-outline-variant/40">
                    <button
                      onClick={() => updateQuantity(item, -1)}
                      className="w-8 h-8 rounded-lg bg-surface-container-lowest text-primary flex items-center justify-center font-bold text-base shadow-sm active:scale-95 transition-transform"
                    >
                      <span className="material-symbols-outlined text-[16px]">remove</span>
                    </button>
                    <span className="text-sm font-bold text-primary tabular-nums px-2">
                      {qty}
                    </span>
                    <button
                      onClick={() => updateQuantity(item, 1)}
                      className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-bold text-base shadow-sm active:scale-95 transition-transform"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Sticky Order Summary Floating Bar */}
      {totalItemCount > 0 && (
        <div className="fixed bottom-4 left-0 right-0 z-40 px-4 pointer-events-none">
          <div className="w-full max-w-lg mx-auto bg-surface-container-lowest/95 backdrop-blur-md border border-outline-variant/40 rounded-2xl p-2.5 shadow-2xl flex items-center justify-between gap-3 pointer-events-auto">
            <div className="flex items-center gap-3 pl-2 min-w-0">
              <div className="relative w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-on-tertiary-container text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
                  {totalItemCount}
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">
                  Total ({totalItemCount} items)
                </span>
                <span className="text-base font-bold text-primary tabular-nums leading-tight">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="h-11 px-4 rounded-xl bg-primary-container hover:bg-primary text-on-primary text-sm font-semibold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <span>Review & Send</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* Cart / KDS Review Modal Sheet */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm flex flex-col justify-end transition-opacity duration-200">
          <div className="w-full max-w-lg mx-auto bg-surface-container-lowest rounded-t-3xl max-h-[85vh] flex flex-col p-4 sm:p-6 shadow-2xl border-t border-outline-variant/40">
            {/* Handle */}
            <div className="w-12 h-1.5 bg-surface-variant rounded-full mx-auto mb-3 shrink-0"></div>

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary">Review Kitchen Ticket</span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-primary text-xs font-bold">
                  T{table?.tableNumber}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Items List */}
            <div className="overflow-y-auto flex-1 divide-y divide-outline-variant/20 py-2 space-y-2">
              {cartList.map(({ item, quantity, notes }) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low"
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="text-sm font-semibold text-on-surface truncate">
                      {item.name}
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      {formatCurrency(item.price)} × {quantity}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-bold text-primary tabular-nums">
                      {formatCurrency(item.price * quantity)}
                    </span>
                    <div className="flex items-center gap-1 bg-surface-container-lowest rounded-lg p-0.5 shadow-sm border border-outline-variant/30">
                      <button
                        onClick={() => updateQuantity(item, -1)}
                        className="w-7 h-7 flex items-center justify-center text-primary font-bold text-sm"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-primary px-1">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(item, 1)}
                        className="w-7 h-7 flex items-center justify-center text-primary font-bold text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Kitchen Instructions */}
              <div className="pt-2">
                <label className="text-xs text-on-surface-variant uppercase tracking-wider block mb-1 font-semibold">
                  Kitchen Instructions (Notes for Chef)
                </label>
                <div className="h-11 w-full rounded-xl bg-surface-container-low border border-outline-variant/40 flex items-center px-3 gap-2">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                    note_alt
                  </span>
                  <input
                    type="text"
                    value={kitchenNotes}
                    onChange={(e) => setKitchenNotes(e.target.value)}
                    placeholder="e.g. Less spicy, fries crispy, coffee extra hot..."
                    className="bg-transparent border-0 outline-none w-full text-xs text-on-surface placeholder:text-on-surface-variant/70"
                  />
                </div>
              </div>

              {/* Guest Count Selector */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-on-surface-variant font-semibold">Guest Count:</span>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuestCount(num)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                        guestCount === num
                          ? 'bg-primary-container text-on-primary'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-3 border-t border-outline-variant/30 shrink-0 flex flex-col gap-2">
              <div className="flex items-center justify-between px-1 text-xs text-on-surface-variant">
                <span>Subtotal ({totalItemCount} items)</span>
                <span className="font-semibold text-on-surface tabular-nums">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between px-1 text-xs text-on-surface-variant">
                <span>GST (5%)</span>
                <span className="font-semibold text-on-surface tabular-nums">{formatCurrency(tax)}</span>
              </div>
              <div className="flex items-center justify-between px-1 pt-1 border-t border-outline-variant/20">
                <span className="text-sm font-bold text-on-surface">Total Payable</span>
                <span className="text-lg font-bold text-primary tabular-nums">
                  {formatCurrency(grandTotal, true)}
                </span>
              </div>

              <button
                disabled={isSubmitting}
                onClick={handleFireTicket}
                className="h-12 w-full mt-1 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-bold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px] text-tertiary-fixed">
                  local_fire_department
                </span>
                <span>{isSubmitting ? 'Firing Ticket...' : 'Fire Ticket to Kitchen'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

