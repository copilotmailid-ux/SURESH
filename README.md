# SURESH - CafeFlow POS, Live KDS & Executive Admin

A full-stack, real-time Cafe Management System built with **React**, **Node.js**, **Express**, **MongoDB**, and **Socket.io** styled using the **Warm Precision Hospitality** design system.

## 🚀 Key Modules
1. **Waiter Ordering Station**: Interactive floor plan with table selection, metric badges, category filters, quantity steppers, cart review sheet, and "Fire Ticket to Kitchen".
2. **Kitchen Display System (KDS)**: Real-time ticket queue with speed lanes (All, Prep, Ready), station filters (Grill, Fryer, Oven, Barista), individual item strike-out checkboxes, and synthesized audio bell chimes.
3. **Table Billing & Checkout Desk**: Itemized running bills, 5% GST computation, discounts, simulated UPI QR code, Cash Till with change calculation, Card POS, and thermal guest receipt generation.
4. **Admin Executive Sales Dashboard**: Real-time sales metrics, hourly rush curve (Lunch Peak vs Evening Rush), tender breakdown (UPI 62%, Cash 27%, Card 11%), top sellers ranking, and End of Day (EOD) Z-Report.

## 🛠️ How to Run

### Backend Server
```bash
cd server
npm install
npm run dev
```

### Frontend Client
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:3000` (or `http://<your-ip>:3000` on mobile).
