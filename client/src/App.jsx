import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { WaiterView } from './views/WaiterView';
import { MenuView } from './views/MenuView';
import { KitchenKDSView } from './views/KitchenKDSView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { TableBillingView } from './views/TableBillingView';
import { useSocket } from './context/useSocket';
import { playKitchenChime } from './utils/audio';

export default function App() {
  const { socket } = useSocket();

  const [currentRole, setCurrentRole] = useState('waiter'); // 'waiter' | 'menu' | 'kitchen' | 'admin' | 'billing'
  const [activeTable, setActiveTable] = useState(null);

  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [metrics, setMetrics] = useState({
    todaySales: 18450,
    totalOrders: 86,
    aov: 214,
    activeKitchenCount: 4,
    occupiedTablesCount: 8,
  });
  const [hourlySales, setHourlySales] = useState([]);
  const [tenderBreakdown, setTenderBreakdown] = useState({ total: 18450, tenders: [] });
  const [topSellers, setTopSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all initial data
  const loadData = useCallback(async () => {
    try {
      const [tRes, mRes, oRes, metRes, hRes, tbRes, topRes] = await Promise.all([
        fetch('/api/tables'),
        fetch('/api/menu'),
        fetch('/api/orders'),
        fetch('/api/admin/metrics'),
        fetch('/api/admin/hourly-sales'),
        fetch('/api/admin/tender-breakdown'),
        fetch('/api/admin/top-sellers'),
      ]);

      if (tRes.ok) setTables(await tRes.json());
      if (mRes.ok) setMenuItems(await mRes.json());
      if (oRes.ok) setOrders(await oRes.json());
      if (metRes.ok) setMetrics(await metRes.json());
      if (hRes.ok) setHourlySales(await hRes.json());
      if (tbRes.ok) setTenderBreakdown(await tbRes.json());
      if (topRes.ok) setTopSellers(await topRes.json());
    } catch (err) {
      console.error('Error fetching initial data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Socket.io real-time listeners
  useEffect(() => {
    if (!socket) return;

    const handleOrderCreated = (newOrder) => {
      console.log('[Socket] Order Created:', newOrder.orderNumber);
      setOrders((prev) => [newOrder, ...prev]);

      // If user is currently looking at Kitchen, play audible chime!
      playKitchenChime();

      // Refresh tables & metrics
      fetch('/api/tables')
        .then((r) => r.json())
        .then((data) => setTables(data));
      fetch('/api/admin/metrics')
        .then((r) => r.json())
        .then((data) => setMetrics(data));
    };

    const handleOrderStatusChanged = (updatedOrder) => {
      console.log('[Socket] Order Status Changed:', updatedOrder.orderNumber, updatedOrder.status);
      setOrders((prev) =>
        prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
      );
    };

    const handleTableUpdated = (updatedTable) => {
      console.log('[Socket] Table Updated:', updatedTable.tableNumber, updatedTable.status);
      setTables((prev) =>
        prev.map((t) => (t.tableNumber === updatedTable.tableNumber ? updatedTable : t))
      );
    };

    const handlePaymentCompleted = ({ order, table }) => {
      console.log('[Socket] Payment Completed for Table:', table?.tableNumber);
      if (table) {
        setTables((prev) =>
          prev.map((t) => (t.tableNumber === table.tableNumber ? table : t))
        );
      }
      if (order) {
        setOrders((prev) =>
          prev.map((o) => (o._id === order._id ? order : o))
        );
      }
      fetch('/api/admin/metrics')
        .then((r) => r.json())
        .then((data) => setMetrics(data));
      fetch('/api/admin/tender-breakdown')
        .then((r) => r.json())
        .then((data) => setTenderBreakdown(data));
    };

    const handleTablesReset = (newTables) => {
      console.log('[Socket] Tables Reset');
      setTables(newTables);
      loadData();
    };

    socket.on('order:created', handleOrderCreated);
    socket.on('order:status_changed', handleOrderStatusChanged);
    socket.on('table:updated', handleTableUpdated);
    socket.on('payment:completed', handlePaymentCompleted);
    socket.on('tables:reset', handleTablesReset);

    return () => {
      socket.off('order:created', handleOrderCreated);
      socket.off('order:status_changed', handleOrderStatusChanged);
      socket.off('table:updated', handleTableUpdated);
      socket.off('payment:completed', handlePaymentCompleted);
      socket.off('tables:reset', handleTablesReset);
    };
  }, [socket, loadData]);

  // Handlers
  const handleSelectTable = (table) => {
    setActiveTable(table);
    setCurrentRole('menu');
  };

  const handleOrderSubmitted = () => {
    setActiveTable(null);
    setCurrentRole('waiter');
    loadData();
  };

  const handleBackToFloor = () => {
    setActiveTable(null);
    setCurrentRole('waiter');
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const { order, table } = await res.json();
        setOrders((prev) => prev.map((o) => (o._id === order._id ? order : o)));
        if (table) {
          setTables((prev) => prev.map((t) => (t.tableNumber === table.tableNumber ? table : t)));
        }
      }
    } catch (e) {
      console.error('Error updating order status:', e);
    }
  };

  const handleToggleItemCompletion = async (orderId, itemIndex) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/items/${itemIndex}/toggle`, {
        method: 'PATCH',
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
      }
    } catch (e) {
      console.error('Error toggling item:', e);
    }
  };

  const handleSettleOrder = (order, table) => {
    if (table) {
      setTables((prev) => prev.map((t) => (t.tableNumber === table.tableNumber ? table : t)));
    }
    loadData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-primary-container text-white flex items-center justify-center animate-bounce shadow-lg">
          <span className="material-symbols-outlined text-[28px]">coffee</span>
        </div>
        <p className="font-bold text-primary text-base">Loading CafeFlow System...</p>
        <span className="text-xs text-on-surface-variant">Connecting local MongoDB & WebSockets</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface flex flex-col">
      <Header
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeTable={activeTable}
        onBackToFloor={handleBackToFloor}
      />

      <main className="flex-1 pt-16">
        {currentRole === 'waiter' && (
          <WaiterView
            tables={tables}
            onSelectTable={handleSelectTable}
            onOpenBilling={(table) => {
              setActiveTable(table);
              setCurrentRole('billing');
            }}
          />
        )}

        {currentRole === 'menu' && (
          <MenuView
            table={activeTable || tables[0]}
            menuItems={menuItems}
            onBackToFloor={handleBackToFloor}
            onOrderSubmitted={handleOrderSubmitted}
          />
        )}

        {currentRole === 'kitchen' && (
          <KitchenKDSView
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onToggleItemCompletion={handleToggleItemCompletion}
          />
        )}

        {currentRole === 'admin' && (
          <AdminDashboardView
            metrics={metrics}
            hourlySales={hourlySales}
            tenderBreakdown={tenderBreakdown}
            topSellers={topSellers}
            orders={orders}
            onNavigateToBilling={() => setCurrentRole('billing')}
          />
        )}

        {currentRole === 'billing' && (
          <TableBillingView
            tables={tables}
            orders={orders}
            onSettleOrder={handleSettleOrder}
            onRefreshData={loadData}
          />
        )}
      </main>
    </div>
  );
}
