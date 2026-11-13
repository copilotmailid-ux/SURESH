import express from 'express';
import Order from '../models/Order.js';
import Table from '../models/Table.js';
import Counter from '../models/Counter.js';

const router = express.Router();

// Helper to generate next unique Order Number atomically
const generateOrderNumber = async () => {
  // Find current max order number in DB to prevent any collision
  const allOrders = await Order.find({}, { orderNumber: 1 });
  let maxFound = 1050;

  for (const ord of allOrders) {
    if (ord.orderNumber) {
      const match = ord.orderNumber.match(/\d+/);
      if (match) {
        const val = parseInt(match[0], 10);
        if (val > maxFound) maxFound = val;
      }
    }
  }

  // Atomically increment counter
  const counter = await Counter.findByIdAndUpdate(
    'orderNumber',
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  let seqNum = counter.seq;
  if (seqNum <= maxFound) {
    seqNum = maxFound + 1;
    await Counter.findByIdAndUpdate('orderNumber', { seq: seqNum });
  }

  let candidate = `#${seqNum}`;
  while (await Order.exists({ orderNumber: candidate })) {
    seqNum++;
    candidate = `#${seqNum}`;
    await Counter.findByIdAndUpdate('orderNumber', { seq: seqNum });
  }

  return candidate;
};

// GET all orders (with optional status filter)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET live active kitchen & floor orders
router.get('/live', async (req, res) => {
  try {
    const activeStatuses = ['pending', 'preparing', 'ready', 'served', 'billed'];
    const orders = await Order.find({ status: { $in: activeStatuses } }).sort({ createdAt: 1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST Create new order (fires from Waiter menu)
router.post('/', async (req, res) => {
  try {
    const { tableNumber, waiterName, guestCount, orderType, items, kitchenNotes } = req.body;

    if (!tableNumber || !items || items.length === 0) {
      return res.status(400).json({ error: 'Table number and order items are required' });
    }

    const orderNumber = await generateOrderNumber();

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    const tax = Math.round(subtotal * 0.05); // 5% GST
    const discount = 0;
    const total = subtotal + tax - discount;

    const formattedItems = items.map((it) => ({
      menuItemId: it.menuItemId || it._id,
      name: it.name,
      price: it.price,
      quantity: it.quantity || 1,
      station: it.station || 'grill',
      notes: it.notes || '',
      isCompleted: false,
    }));

    const order = new Order({
      orderNumber,
      tableNumber,
      waiterName: waiterName || 'Rahul S.',
      guestCount: guestCount || 2,
      orderType: orderType || 'dine_in',
      items: formattedItems,
      kitchenNotes: kitchenNotes || '',
      status: 'preparing',
      subtotal,
      tax,
      discount,
      total,
      paymentStatus: 'unpaid',
      paymentMethod: 'none',
    });

    try {
      await order.save();
    } catch (saveErr) {
      // Auto-retry once if race collision occurred
      if (saveErr.code === 11000) {
        order.orderNumber = await generateOrderNumber();
        await order.save();
      } else {
        throw saveErr;
      }
    }

    // Update table status
    const table = await Table.findOneAndUpdate(
      { tableNumber },
      {
        $set: {
          status: 'preparing',
          activeOrderId: order._id,
          totalAmount: total,
          guestCount: guestCount || 2,
          currentWaiter: waiterName || 'Rahul S.',
          seatedAt: new Date(),
        },
      },
      { new: true }
    ).populate('activeOrderId');

    const io = req.app.get('io');
    if (io) {
      io.emit('order:created', order);
      if (table) io.emit('table:updated', table);
    }

    res.status(201).json({ order, table });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH Update order status (KDS actions, Waiter serving, etc.)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    if (status === 'completed' || status === 'served') {
      order.completedAt = new Date();
    }
    await order.save();

    // Map order status to table status
    let mappedTableStatus = null;
    if (status === 'ready') mappedTableStatus = 'ready';
    else if (status === 'served') mappedTableStatus = 'occupied';
    else if (status === 'billed') mappedTableStatus = 'billing';
    else if (status === 'preparing') mappedTableStatus = 'preparing';

    let table = null;
    if (mappedTableStatus) {
      table = await Table.findOneAndUpdate(
        { tableNumber: order.tableNumber },
        { $set: { status: mappedTableStatus } },
        { new: true }
      ).populate('activeOrderId');
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('order:status_changed', order);
      if (table) io.emit('table:updated', table);
    }

    res.json({ order, table });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH Toggle item completion on KDS ticket
router.patch('/:id/items/:itemIndex/toggle', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const index = parseInt(req.params.itemIndex, 10);
    if (index >= 0 && index < order.items.length) {
      order.items[index].isCompleted = !order.items[index].isCompleted;
      await order.save();

      req.app.get('io')?.emit('order:status_changed', order);
      return res.json(order);
    }

    res.status(400).json({ error: 'Invalid item index' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST Settle payment for table/order (from Admin Billing Desk)
router.post('/:id/settle', async (req, res) => {
  try {
    const { paymentMethod, discount = 0 } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.discount = discount;
    order.total = Math.max(0, order.subtotal + order.tax - discount);
    order.paymentStatus = 'paid';
    order.paymentMethod = paymentMethod || 'upi';
    order.status = 'completed';
    order.paidAt = new Date();
    order.completedAt = new Date();
    await order.save();

    // Reset table to available
    const table = await Table.findOneAndUpdate(
      { tableNumber: order.tableNumber },
      {
        $set: {
          status: 'available',
          activeOrderId: null,
          totalAmount: 0,
          guestCount: 0,
          seatedAt: null,
        },
      },
      { new: true }
    );

    const io = req.app.get('io');
    if (io) {
      io.emit('payment:completed', { order, table });
      io.emit('order:status_changed', order);
      if (table) io.emit('table:updated', table);
    }

    res.json({ success: true, order, table });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
