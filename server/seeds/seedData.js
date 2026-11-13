import mongoose from 'mongoose';
import Table from '../models/Table.js';
import MenuItem from '../models/MenuItem.js';
import Order from '../models/Order.js';

export const seedInitialData = async (forceReset = false) => {
  try {
    const tableCount = await Table.countDocuments();
    const orderCount = await Order.countDocuments();

    // If tables already exist and forceReset is false, ensure existing tables have orders
    if (!forceReset && tableCount >= 15 && orderCount >= 8) {
      console.log('[Seed] Database already contains populated tables and orders.');
      return;
    }

    console.log('[Seed] Seeding complete CafeFlow tables and active orders...');

    // Clear existing
    await Table.deleteMany({});
    await MenuItem.deleteMany({});
    await Order.deleteMany({});

    // 1. Seed Menu Items
    const menuItems = [
      {
        name: 'Classic Chicken Burger',
        category: 'burgers',
        price: 240,
        description: 'Classic toasted brioche, seasoned patty, cheddar & crisp lettuce',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTib-6kQ9GzyUb3vc77pKuY2CVZWmD64pXTNxJgUWkk0BG39oaXyY6F_et33BYi-K2bKIMj0jLzZVX-RxxIIRymGOHXIL_SX1K-gu3l8yEGWxpF6hnHzl0UOSPJw2IYuMwTeoXwBjQkjlIIYMJ3kDAcwVW43TlFsRnbRkZugjbyjC5kMET54HBDSRtnOHoTGzVQWiyD_M6y-cC1YCD5LUTmPjyfLCRpIsw42iUyd4',
        tag: 'Chef Pick',
        station: 'grill',
        isAvailable: true,
      },
      {
        name: 'Truffle Mushroom Pizza',
        category: 'pizza',
        price: 380,
        description: 'Wild shiitake & portobello mushrooms, mozzarella, truffle glaze',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7KSPuDqb53eIEXI9JpxE9-jW5Ot-gWbaGG7P75ri2iD1JjFEQ94shNnQSwW_BSVkKargVRsCK4BFiffEdJ6Vbc1wjItyNBUHkuoraoBLcEYR1AmnJwAxLQKfhuplqfxG8aZhFjx1dLnQq5pChA-wpcY1N0oVl1fEbXboMlUJ7dXRfx4wy2TwWz2WHSwJxZlh7rL3j-a5Etozgh2G3okeBbfRgI9xbNBSQ6xVMooU',
        tag: 'Artisanal',
        station: 'oven',
        isAvailable: true,
      },
      {
        name: 'Crispy Peri-Peri Fries',
        category: 'snacks',
        price: 140,
        description: 'Golden hand-cut fries generously dusted with zesty peri-peri',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKDtdAPwHsPMyyOyaHV7fXdNro5irvMxfgv9_r_EM3hx3CUT1EssZqcIPl6eldfRv2cQhLsFyywcNqbt70Qiw0FZGE7mA4IdTbrSOTrO2Syz5x3l-CRE7Eo16fzyTnKtPgraxDueqnEBRHf_BhRZe5sGeJ237POiBgKTdeSRiBhUIkLrufA_Vv-XAk_yGRg3emCI0oDxosqpITxw-8H7Bbe9Q8xN0fYGKWrTQwWW8',
        tag: 'Extra Crisp',
        station: 'fryer',
        isAvailable: true,
      },
      {
        name: 'Steamed Veg Momos',
        category: 'momos',
        price: 160,
        description: '6 pcs delicate dumplings with fiery chili garlic chutney',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8pUTDkGNSQ9ywanTScSLBkNXU_7AOi_Rp_4ipRjAUySIjFQDrfH276_aPX82zsABMHDXvbkFpnaCanUHHoJCmfl7HvtDSNV8_nkwbUeYuyQiRc-eZWLgeadeQQE2Nz7rMNMOuuKav0DwLJlaVxfLFwU0zDIHNuU2y3fiKnZxqp4ICQH53mpEI0POZHOp6BDvQr2bE03G6tli1c5NqRKnhasjGTBMUDP9BsOOejZQ',
        tag: 'Freshly Steamed',
        station: 'steamer',
        isAvailable: true,
      },
      {
        name: 'Artisan Cappuccino',
        category: 'beverages',
        price: 180,
        description: 'Double espresso shot with velvety micro-foam rosetta latte art',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_cIn_rzTLTHmDXO4V819rZP0VXnvvz-1GE8sRhMTQCdmDSaciQohpI-4r0fVHszN8uFgrBqH3RylzDMbQKt6UbHrxvlHZrGok4J_Ilc3JF4EJS7zt_lTbNLnX-vokVwkEGf7iWecXpT-EDtFXzMHRejGDdo9BR5d9f_E-TGFGvraCadZuRWPMFsEtwpwVQJV8sEdkBOM99rUM5uiaEg4YQLB6fAAHyboa87CohNw',
        tag: 'Hot',
        station: 'barista',
        isAvailable: true,
      },
      {
        name: 'Dark Choco Hazelnut Brownie',
        category: 'desserts',
        price: 190,
        description: 'Dense fudge dark chocolate brownie topped with roasted hazelnuts',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOn_zL6VOlO4yJ51tCzkBBz17fk0I9S6kaFX0wGoBABtZMtHCyuEr-SonBw_cQuo0Yrr1SBIV84nilxIkgB4Qg8I7QiKYSTb-F7Ws4DT8Ca2FbGuYAGTA99sFByczabLP9KKHZyfby7NdGV4bkU41SZ_MsVSBEEmrfmaMyhxHyM0a5ZMagCTBDAL1ki7BO7AREcP6Sh5TcMePuD7V_HoO0bcsBZQ3HkOkYy4RYBzk',
        tag: 'Bestseller',
        station: 'bakery',
        isAvailable: true,
      },
      {
        name: 'BBQ Smokey Bacon Burger',
        category: 'burgers',
        price: 280,
        description: 'Double grilled patty, crispy bacon strips, sweet hickory barbecue',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEWCu0K7y2WOQhYltxElehJeMTULzHc-ETl-KoeOUTHFeV3fUPC5OgKAM3e7iZvPAP9f8-iyjDgS54_kXMXNtkdqvbBoDZmruPkaBXWhAKElOkjZ5ZuGy8UpCYyp6KGzvFPWcZrhWSc8yrNapGdWdmMU6OPhC37JxcBiBsdZG6bmbg9MX-ebVd_Klc__h55d6s1UkhdvxHZ-qT0tjL7xtkaZXNW5FSaSOYITKMLak',
        tag: 'Chef Pick',
        station: 'grill',
        isAvailable: true,
      },
      {
        name: 'Farmhouse Garden Pizza',
        category: 'pizza',
        price: 340,
        description: 'Bell peppers, sweet corn, black olives, jalapenos and fresh basil',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7KSPuDqb53eIEXI9JpxE9-jW5Ot-gWbaGG7P75ri2iD1JjFEQ94shNnQSwW_BSVkKargVRsCK4BFiffEdJ6Vbc1wjItyNBUHkuoraoBLcEYR1AmnJwAxLQKfhuplqfxG8aZhFjx1dLnQq5pChA-wpcY1N0oVl1fEbXboMlUJ7dXRfx4wy2TwWz2WHSwJxZlh7rL3j-a5Etozgh2G3okeBbfRgI9xbNBSQ6xVMooU',
        tag: 'Vegetarian',
        station: 'oven',
        isAvailable: true,
      },
      {
        name: 'Loaded Cheese Jalapeno Poppers',
        category: 'snacks',
        price: 170,
        description: 'Crispy herb-crusted bites packed with molten cheddar and jalapenos',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsEDMt-j1ub6kWeB-pd9ALkNf14ZDX4e2OoyX1JptGZUw-yU0GQhT96HfJVK31vNV1yLvdTLctXolMYEfQp-RXFXzVXNmMPErP-I201IMqtVBS4daLC12yBiWHnAUvzUu2A_DCMcOChBr_6wi0BNDOe59y5FXwg9qUn7P03WeYakDituqpRO4z9dH26NCWu7AQ-cNrOPsdaG2v_m9c9aijkdILlhBH-Dpt6vJoGRY',
        tag: 'Cheesy',
        station: 'fryer',
        isAvailable: true,
      },
      {
        name: 'Fried Schezwan Momos',
        category: 'momos',
        price: 180,
        description: 'Crispy fried dumplings tossed in spicy Sichuan wok sauce',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDogMmF7cuVfC3ffmw-V33HLUoW8Fd6LPfWiIcCA0O32jlH0sc765kVu9Nsz6UyTRZTQH898iOU1scAWtkqry_Zuhg6kBVqptHOtExamtmuYSrdkbqN3fWPybC8dTwD3LQBT-UpTdUvEK4VAKJHEUWFFHT1UnLyUPDFRa-cNEhQRiVW57zsfTJwOCtswG5q9YrcN4epSaiPcc7Ae91Z9f5rG61vGxFkq3PBgf_tN-Q',
        tag: 'Spicy',
        station: 'fryer',
        isAvailable: true,
      },
      {
        name: 'Iced Caramel Macchiato',
        category: 'beverages',
        price: 210,
        description: 'Chilled whole milk marked with bold espresso and vanilla caramel drizzle',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_cIn_rzTLTHmDXO4V819rZP0VXnvvz-1GE8sRhMTQCdmDSaciQohpI-4r0fVHszN8uFgrBqH3RylzDMbQKt6UbHrxvlHZrGok4J_Ilc3JF4EJS7zt_lTbNLnX-vokVwkEGf7iWecXpT-EDtFXzMHRejGDdo9BR5d9f_E-TGFGvraCadZuRWPMFsEtwpwVQJV8sEdkBOM99rUM5uiaEg4YQLB6fAAHyboa87CohNw',
        tag: 'Cold Brew',
        station: 'barista',
        isAvailable: true,
      },
      {
        name: 'Warm Belgian Chocolate Waffle',
        category: 'desserts',
        price: 230,
        description: 'Golden Brussels waffle topped with melted Belgian dark chocolate & strawberries',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDl3_1c11N57kjzp3S0BsrvwzIY0Go3s9Q9CVUqBMMI-yUgJt9ZjLR3ElT4JvpxFD0mrH1EZylilTWHCtatBmQihrIclCnyHY14JQkZulbzlRKjgCxDiitDgim-aKqVU4P1qh1C40MZnbfzdS9xdQCRpl3LDPFE-Qx84C0Vlps6h0LvS27CGW9nTgiwPvT0nUVu98AsnjudHqXs1p2tOzLx-4YyaJQx2Jw80FyJp9o',
        tag: 'Sweet Treat',
        station: 'bakery',
        isAvailable: true,
      },
    ];

    const insertedMenu = await MenuItem.insertMany(menuItems);
    console.log(`[Seed] Inserted ${insertedMenu.length} menu items.`);

    const burger = insertedMenu.find((m) => m.name === 'Classic Chicken Burger');
    const fries = insertedMenu.find((m) => m.name === 'Crispy Peri-Peri Fries');
    const pizza = insertedMenu.find((m) => m.name === 'Truffle Mushroom Pizza');
    const momos = insertedMenu.find((m) => m.name === 'Steamed Veg Momos');
    const coffee = insertedMenu.find((m) => m.name === 'Artisan Cappuccino');
    const brownie = insertedMenu.find((m) => m.name === 'Dark Choco Hazelnut Brownie');

    // 2. Create Active Orders for Occupied/Active Tables

    // Table 02 Order (₹680: 2x Burger + 1x Cappuccino + 1x Fries)
    const orderT02 = await Order.create({
      orderNumber: '#1048',
      tableNumber: '02',
      waiterName: 'Rahul S.',
      guestCount: 4,
      orderType: 'dine_in',
      items: [
        {
          menuItemId: burger._id,
          name: burger.name,
          price: burger.price,
          quantity: 2,
          station: 'grill',
          notes: 'Medium rare, extra cheese',
          isCompleted: true,
        },
        {
          menuItemId: coffee._id,
          name: coffee.name,
          price: coffee.price,
          quantity: 1,
          station: 'barista',
          notes: 'Hot rosetta foam',
          isCompleted: true,
        },
      ],
      kitchenNotes: 'Table seated for lunch.',
      status: 'served',
      subtotal: 660,
      tax: 33,
      discount: 0,
      total: 680,
      paymentStatus: 'unpaid',
      paymentMethod: 'none',
    });

    // Table 03 Order (₹1,029: In Kitchen Prep)
    const orderT03 = await Order.create({
      orderNumber: '#1042',
      tableNumber: '03',
      waiterName: 'Rahul S.',
      guestCount: 2,
      orderType: 'dine_in',
      items: [
        {
          menuItemId: burger._id,
          name: burger.name,
          price: burger.price,
          quantity: 2,
          station: 'grill',
          notes: 'Well done patty, extra cheese',
          isCompleted: false,
        },
        {
          menuItemId: fries._id,
          name: fries.name,
          price: fries.price,
          quantity: 1,
          station: 'fryer',
          notes: 'Less spicy / mild seasoning',
          isCompleted: false,
        },
        {
          menuItemId: coffee._id,
          name: coffee.name,
          price: coffee.price,
          quantity: 2,
          station: 'barista',
          notes: 'Double shot extra hot',
          isCompleted: false,
        },
      ],
      kitchenNotes: 'Party is in a slight rush, serve burgers together.',
      status: 'preparing',
      subtotal: 980,
      tax: 49,
      discount: 0,
      total: 1029,
      paymentStatus: 'unpaid',
      paymentMethod: 'none',
    });

    // Table 04 Order (₹798: Ready to Serve!)
    const orderT04 = await Order.create({
      orderNumber: '#1039',
      tableNumber: '04',
      waiterName: 'Rahul S.',
      guestCount: 3,
      orderType: 'dine_in',
      items: [
        {
          menuItemId: burger._id,
          name: burger.name,
          price: burger.price,
          quantity: 2,
          station: 'grill',
          notes: 'Regular seasoning',
          isCompleted: true,
        },
        {
          menuItemId: fries._id,
          name: fries.name,
          price: fries.price,
          quantity: 2,
          station: 'fryer',
          notes: 'Extra crisp with dip',
          isCompleted: true,
        },
      ],
      kitchenNotes: 'Plated at the pass lamp.',
      status: 'ready',
      subtotal: 760,
      tax: 38,
      discount: 0,
      total: 798,
      paymentStatus: 'unpaid',
      paymentMethod: 'none',
    });

    // Table 06 Order (₹420: 1x Burger + 1x Cappuccino)
    const orderT06 = await Order.create({
      orderNumber: '#1044',
      tableNumber: '06',
      waiterName: 'Priya K.',
      guestCount: 2,
      orderType: 'dine_in',
      items: [
        {
          menuItemId: burger._id,
          name: burger.name,
          price: burger.price,
          quantity: 1,
          station: 'grill',
          notes: 'Brioche toasted crisp',
          isCompleted: true,
        },
        {
          menuItemId: coffee._id,
          name: coffee.name,
          price: coffee.price,
          quantity: 1,
          station: 'barista',
          notes: 'Oat milk',
          isCompleted: true,
        },
      ],
      kitchenNotes: 'Served at counter.',
      status: 'served',
      subtotal: 420,
      tax: 21,
      discount: 0,
      total: 420,
      paymentStatus: 'unpaid',
      paymentMethod: 'none',
    });

    // Table 07 Order (₹1,462: Billing Requested)
    const orderT07 = await Order.create({
      orderNumber: '#1045',
      tableNumber: '07',
      waiterName: 'Priya K.',
      guestCount: 4,
      orderType: 'dine_in',
      items: [
        {
          menuItemId: pizza._id,
          name: pizza.name,
          price: pizza.price,
          quantity: 2,
          station: 'oven',
          notes: 'Crispy thin crust',
          isCompleted: true,
        },
        {
          menuItemId: momos._id,
          name: momos.name,
          price: momos.price,
          quantity: 2,
          station: 'steamer',
          notes: 'Extra spicy dip',
          isCompleted: true,
        },
        {
          menuItemId: coffee._id,
          name: coffee.name,
          price: coffee.price,
          quantity: 2,
          station: 'barista',
          notes: 'Oat milk if available',
          isCompleted: true,
        },
      ],
      kitchenNotes: 'Bill requested by table.',
      status: 'billed',
      subtotal: 1440,
      tax: 72,
      discount: 50,
      total: 1462,
      paymentStatus: 'unpaid',
      paymentMethod: 'none',
    });

    // Table 09 Order (₹640: Ready to Serve!)
    const orderT09 = await Order.create({
      orderNumber: '#1047',
      tableNumber: '09',
      waiterName: 'Rahul S.',
      guestCount: 4,
      orderType: 'dine_in',
      items: [
        {
          menuItemId: pizza._id,
          name: pizza.name,
          price: pizza.price,
          quantity: 1,
          station: 'oven',
          isCompleted: true,
        },
        {
          menuItemId: momos._id,
          name: momos.name,
          price: momos.price,
          quantity: 1,
          station: 'steamer',
          isCompleted: true,
        },
        {
          menuItemId: coffee._id,
          name: coffee.name,
          price: coffee.price,
          quantity: 1,
          station: 'barista',
          isCompleted: true,
        },
      ],
      kitchenNotes: 'Plated at counter.',
      status: 'ready',
      subtotal: 720,
      tax: 36,
      discount: 0,
      total: 640,
      paymentStatus: 'unpaid',
      paymentMethod: 'none',
    });

    // Table 10 Order (₹890: Dining)
    const orderT10 = await Order.create({
      orderNumber: '#1043',
      tableNumber: '10',
      waiterName: 'Priya K.',
      guestCount: 4,
      orderType: 'dine_in',
      items: [
        {
          menuItemId: burger._id,
          name: burger.name,
          price: burger.price,
          quantity: 2,
          station: 'grill',
          isCompleted: true,
        },
        {
          menuItemId: fries._id,
          name: fries.name,
          price: fries.price,
          quantity: 1,
          station: 'fryer',
          isCompleted: true,
        },
        {
          menuItemId: brownie._id,
          name: brownie.name,
          price: brownie.price,
          quantity: 1,
          station: 'bakery',
          isCompleted: true,
        },
      ],
      kitchenNotes: 'Course 2 served.',
      status: 'served',
      subtotal: 810,
      tax: 40,
      discount: 0,
      total: 890,
      paymentStatus: 'unpaid',
      paymentMethod: 'none',
    });

    // Table 12 Order (₹310: Drinks)
    const orderT12 = await Order.create({
      orderNumber: '#1041',
      tableNumber: '12',
      waiterName: 'Rahul S.',
      guestCount: 1,
      orderType: 'dine_in',
      items: [
        {
          menuItemId: coffee._id,
          name: coffee.name,
          price: coffee.price,
          quantity: 1,
          station: 'barista',
          isCompleted: true,
        },
        {
          menuItemId: fries._id,
          name: fries.name,
          price: fries.price,
          quantity: 1,
          station: 'fryer',
          isCompleted: true,
        },
      ],
      kitchenNotes: 'Express barista order.',
      status: 'served',
      subtotal: 320,
      tax: 16,
      discount: 0,
      total: 310,
      paymentStatus: 'unpaid',
      paymentMethod: 'none',
    });

    // Table 14 Order (₹540: Dessert Ready)
    const orderT14 = await Order.create({
      orderNumber: '#1040',
      tableNumber: '14',
      waiterName: 'Rahul S.',
      guestCount: 2,
      orderType: 'dine_in',
      items: [
        {
          menuItemId: brownie._id,
          name: brownie.name,
          price: brownie.price,
          quantity: 2,
          station: 'bakery',
          notes: 'Warm with extra nuts',
          isCompleted: true,
        },
        {
          menuItemId: momos._id,
          name: momos.name,
          price: momos.price,
          quantity: 1,
          station: 'steamer',
          isCompleted: true,
        },
      ],
      kitchenNotes: 'Dessert counter 1.',
      status: 'ready',
      subtotal: 540,
      tax: 27,
      discount: 0,
      total: 540,
      paymentStatus: 'unpaid',
      paymentMethod: 'none',
    });

    // 3. Seed 15 Tables directly linked to their Orders via activeOrderId
    const tablesData = [
      { tableNumber: '01', capacity: 4, section: 'Floor 1', status: 'available', totalAmount: 0 },
      { tableNumber: '02', capacity: 4, section: 'Floor 1', status: 'occupied', totalAmount: 680, activeOrderId: orderT02._id, currentWaiter: 'Rahul S.', guestCount: 4, seatedAt: new Date(Date.now() - 1000 * 60 * 40) },
      { tableNumber: '03', capacity: 2, section: 'Floor 1', status: 'preparing', totalAmount: 1029, activeOrderId: orderT03._id, currentWaiter: 'Rahul S.', guestCount: 2, seatedAt: new Date(Date.now() - 1000 * 60 * 18) },
      { tableNumber: '04', capacity: 4, section: 'Floor 1', status: 'ready', totalAmount: 798, activeOrderId: orderT04._id, currentWaiter: 'Rahul S.', guestCount: 3, seatedAt: new Date(Date.now() - 1000 * 60 * 22) },
      { tableNumber: '05', capacity: 2, section: 'Floor 1', status: 'available', totalAmount: 0 },
      { tableNumber: '06', capacity: 2, section: 'Floor 1', status: 'occupied', totalAmount: 420, activeOrderId: orderT06._id, currentWaiter: 'Priya K.', guestCount: 2, seatedAt: new Date(Date.now() - 1000 * 60 * 35) },
      { tableNumber: '07', capacity: 4, section: 'Floor 1', status: 'billing', totalAmount: 1462, activeOrderId: orderT07._id, currentWaiter: 'Priya K.', guestCount: 4, seatedAt: new Date(Date.now() - 1000 * 60 * 55) },
      { tableNumber: '08', capacity: 6, section: 'Floor 1', status: 'available', totalAmount: 0 },
      { tableNumber: '09', capacity: 4, section: 'Floor 1', status: 'ready', totalAmount: 640, activeOrderId: orderT09._id, currentWaiter: 'Rahul S.', guestCount: 4, seatedAt: new Date(Date.now() - 1000 * 60 * 15) },
      { tableNumber: '10', capacity: 4, section: 'Floor 1', status: 'occupied', totalAmount: 890, activeOrderId: orderT10._id, currentWaiter: 'Priya K.', guestCount: 4, seatedAt: new Date(Date.now() - 1000 * 60 * 28) },
      { tableNumber: '11', capacity: 2, section: 'Floor 1', status: 'available', totalAmount: 0 },
      { tableNumber: '12', capacity: 2, section: 'Floor 1', status: 'occupied', totalAmount: 310, activeOrderId: orderT12._id, currentWaiter: 'Rahul S.', guestCount: 1, seatedAt: new Date(Date.now() - 1000 * 60 * 12) },
      { tableNumber: '13', capacity: 4, section: 'Floor 1', status: 'available', totalAmount: 0 },
      { tableNumber: '14', capacity: 4, section: 'Floor 1', status: 'ready', totalAmount: 540, activeOrderId: orderT14._id, currentWaiter: 'Rahul S.', guestCount: 2, seatedAt: new Date(Date.now() - 1000 * 60 * 19) },
      { tableNumber: '15', capacity: 2, section: 'Floor 1', status: 'available', totalAmount: 0 },
    ];

    await Table.insertMany(tablesData);
    console.log(`[Seed] Inserted ${tablesData.length} tables fully linked with active orders.`);
  } catch (error) {
    console.error(`[Seed] Error seeding data: ${error.message}`);
  }
};
