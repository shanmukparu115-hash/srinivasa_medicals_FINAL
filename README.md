# Medicare Pharmacy Clone

A high-fidelity, premium React + TypeScript clone of the Medicare Pharmacy platform (based on [pharma-joy-online.lovable.app](https://pharma-joy-online.lovable.app)). This application is fully responsive, interactive, and styled using modern web design principles.

---

## 🚀 Key Features

### 🛒 Complete E-commerce Flow
- **Product Exploration**: Discover products via category pages or search by brand and name. Filter by category, price, and customer ratings. Sort by rating, popularity, and price.
- **Dynamic Pagination**: Browse the 100-product catalog via responsive pagination (12 items per page).
- **Rich Product Detail Pages**: Inspect usage, side effects, active ingredients, stock level warnings, and prescription (Rx) requirements. Shows relevant related items based on the product's category.
- **Interactive Cart**: Tracks items, quantities, and calculates shipping thresholds with a dynamic progress bar for free shipping on orders above ₹499.
- **Checkout Flow**: Complete transactions with full address details, PIN code verification, and a choice of payment methods (UPI, Cards, Cash on Delivery).
- **Order Confirmation & Tracking**: Generates unique mock Order IDs and displays a step-by-step progress tracking stepper.

### 📄 Document & Form Submissions
- **Prescription Upload**: Dedicated upload center featuring file size validations, drag-and-drop zone, and pharmacist advice helpline cards.
- **Mock Authentication**: Clean mock screens for Login, Register, and Forgot Password flows.
- **FAQ Section**: Fully animated accordion with smooth chevron rotation transitions.
- **About & Contact**: Company milestone timelines, certified pharmacist team cards, customer service channels, and an embedded interactive OpenStreetMap block.

### 📊 Admin Dashboard
- **Key Metrics**: View total revenue, order count, prescriptions pending review, and stock warnings.
- **Data Visualizations**: Beautiful, interactive charts powered by **Recharts**:
  - *Weekly Sales Trend* (Line Chart)
  - *Sales by Category Distribution* (Bar Chart)
- **Inventory Alerts**: Identifies low-stock items (< 20 units) requiring immediate attention.

---

## 🛠️ Technology Stack

1. **Frontend Core**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) (Scaffolded via [Vite](https://vitejs.dev/))
2. **Styling**: [TailwindCSS v3](https://tailwindcss.com/) with customized color variables (OKLCH tailored hues)
3. **Icons**: [Lucide React](https://lucide.dev/)
4. **Charts**: [Recharts](https://recharts.org/)
5. **Animations**: [Framer Motion](https://www.framer.com/motion/)
6. **Toasts/Notifications**: [React Hot Toast](https://react-hot-toast.com/)
7. **Routing**: `HashRouter` from [React Router DOM v7](https://reactrouter.com/) for reliable navigation without server fallback configuration.

---

## 📂 Project Structure

```
medicare-pharmacy/
├── public/                 # Static assets
│   └── assets/             # Downloaded product images and graphics
├── src/
│   ├── components/         # Shared components (Header, Footer, ProductCard)
│   ├── context/            # AppContext (Cart logic, persist orders to localStorage)
│   ├── data/               # Deterministic 100-product database
│   ├── pages/              # 15 page components (Home, Products, Admin, etc.)
│   ├── App.tsx             # Root router mapping
│   ├── index.css           # Styling base and design tokens
│   └── main.tsx            # Application mount point
├── tailwind.config.js      # Utility styling configuration
├── vite.config.ts          # Compilation configurations
└── package.json            # Scripts & dependencies
```

---

## 💻 Setup and Installation

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (version 18+ recommended).

### Steps
1. Navigate into the project folder:
   ```bash
   cd medicare-pharmacy
   ```

2. Install all dependencies:
   ```bash
   npm install
   ```

3. Launch the local development server:
   ```bash
   npm run dev
   ```
   *The application will start running at `http://localhost:5173/`.*

4. Build the project for production:
   ```bash
   npm run build
   ```
   *Compiles strict type-checked, optimized assets into the `dist/` folder.*
