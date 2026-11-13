import express from 'express';
import MenuItem from '../models/MenuItem.js';

const router = express.Router();

// GET all menu items (optional category filter)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isAvailable: true };
    if (category && category !== 'all') {
      filter.category = category.toLowerCase();
    }
    const items = await MenuItem.find(filter).sort({ category: 1, name: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET categories summary
router.get('/categories', async (req, res) => {
  try {
    const categories = ['all', 'burgers', 'pizza', 'snacks', 'momos', 'beverages', 'desserts'];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

