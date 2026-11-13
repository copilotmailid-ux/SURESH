import express from 'express';
import Table from '../models/Table.js';
import Order from '../models/Order.js';
import { seedInitialData } from '../seeds/seedData.js';

const router = express.Router();

// GET all tables with populated active order
router.get('/', async (req, res) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 }).populate('activeOrderId');
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST Reset and seed fresh tables with full active orders
router.post('/reset', async (req, res) => {
  try {
    await seedInitialData(true);
    const tables = await Table.find().sort({ tableNumber: 1 }).populate('activeOrderId');
    req.app.get('io')?.emit('tables:reset', tables);
    res.json({ success: true, count: tables.length, tables });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single table by table number
router.get('/:tableNumber', async (req, res) => {
  try {
    const table = await Table.findOne({ tableNumber: req.params.tableNumber }).populate('activeOrderId');
    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }
    res.json(table);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH update table status
router.patch('/:tableNumber/status', async (req, res) => {
  try {
    const { status, guestCount, currentWaiter } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (guestCount !== undefined) updateData.guestCount = guestCount;
    if (currentWaiter) updateData.currentWaiter = currentWaiter;

    if (status === 'available') {
      updateData.activeOrderId = null;
      updateData.totalAmount = 0;
      updateData.guestCount = 0;
      updateData.seatedAt = null;
    } else if (status === 'occupied' && !updateData.seatedAt) {
      updateData.seatedAt = new Date();
    }

    const table = await Table.findOneAndUpdate(
      { tableNumber: req.params.tableNumber },
      { $set: updateData },
      { new: true }
    ).populate('activeOrderId');

    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }

    req.app.get('io')?.emit('table:updated', table);
    res.json(table);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
