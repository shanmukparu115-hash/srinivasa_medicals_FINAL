import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminLayout } from "./layouts/AdminLayout";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

// Pages
import { Welcome } from "./pages/Welcome";
import { Home } from "./pages/Home";
import { Products } from "./pages/Products";
import { ProductDetails } from "./pages/ProductDetails";
import { Categories } from "./pages/Categories";
import { OnlineDelivery } from "./pages/OnlineDelivery";
import { Prescription } from "./pages/Prescription";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { FAQ } from "./pages/FAQ";
import { Track } from "./pages/Track";
import { ForgotPassword } from "./pages/ForgotPassword";

import { CustomerLogin } from "./pages/customer/CustomerLogin";
import { CustomerRegister } from "./pages/customer/CustomerRegister";
import { CustomerProfile } from "./pages/customer/CustomerProfile";
import { Feedback } from "./pages/customer/Feedback";
import { PrescriptionStatus } from "./pages/customer/PrescriptionStatus";

import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminProducts } from "./pages/admin/AdminProducts";
import { AdminOrders } from "./pages/admin/AdminOrders";
import { AdminCustomers } from "./pages/admin/AdminCustomers";
import { AdminPrescriptions } from "./pages/admin/AdminPrescriptions";
import { AdminFeedback } from "./pages/admin/AdminFeedback";
import { AdminMessages } from "./pages/admin/AdminMessages";
import { AdminSettings } from "./pages/admin/AdminSettings";

// Customer shell (header + footer)
const CustomerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-background">
    <Header />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

const AdminPage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute role="admin">
    <AdminLayout>{children}</AdminLayout>
  </ProtectedRoute>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            {/* Welcome / Landing page — no header/footer */}
            <Route path="/" element={<Welcome />} />

            {/* Admin routes */}
            <Route path="/admin/login"         element={<AdminLogin />} />
            <Route path="/admin/dashboard"     element={<AdminPage><AdminDashboard /></AdminPage>} />
            <Route path="/admin/products"      element={<AdminPage><AdminProducts /></AdminPage>} />
            <Route path="/admin/orders"        element={<AdminPage><AdminOrders /></AdminPage>} />
            <Route path="/admin/customers"     element={<AdminPage><AdminCustomers /></AdminPage>} />
            <Route path="/admin/prescriptions" element={<AdminPage><AdminPrescriptions /></AdminPage>} />
            <Route path="/admin/feedback"      element={<AdminPage><AdminFeedback /></AdminPage>} />
            <Route path="/admin/messages"      element={<AdminPage><AdminMessages /></AdminPage>} />
            <Route path="/admin/settings"      element={<AdminPage><AdminSettings /></AdminPage>} />
            <Route path="/admin"               element={<Navigate to="/admin/dashboard" replace />} />

            {/* Customer routes — with header/footer */}
            <Route path="/*" element={
              <CustomerLayout>
                <Routes>
                  <Route path="/home"               element={<Home />} />
                  <Route path="/products"           element={<Products />} />
                  <Route path="/products/:id"       element={<ProductDetails />} />
                  <Route path="/categories"         element={<Categories />} />
                  <Route path="/online-delivery"    element={<OnlineDelivery />} />
                  <Route path="/prescription"       element={<Prescription />} />
                  <Route path="/prescription-status" element={<PrescriptionStatus />} />
                  <Route path="/about"              element={<About />} />
                  <Route path="/contact"            element={<Contact />} />
                  <Route path="/faq"                element={<FAQ />} />
                  <Route path="/feedback"           element={<Feedback />} />
                  <Route path="/track"              element={<Track />} />
                  <Route path="/forgot-password"    element={<ForgotPassword />} />
                  <Route path="/login"              element={<CustomerLogin />} />
                  <Route path="/register"           element={<CustomerRegister />} />
                  <Route path="/profile"            element={
                    <ProtectedRoute role="customer"><CustomerProfile /></ProtectedRoute>
                  } />
                  <Route path="*" element={
                    <div className="flex flex-col items-center justify-center py-32 text-center px-4">
                      <p className="text-7xl font-bold text-muted/40">404</p>
                      <h2 className="mt-4 text-2xl font-bold text-foreground">Page Not Found</h2>
                      <p className="mt-2 text-muted-foreground">The page you're looking for doesn't exist.</p>
                      <a href="/" className="mt-6 inline-flex items-center rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-primary/90">← Go Home</a>
                    </div>
                  } />
                </Routes>
              </CustomerLayout>
            } />
          </Routes>

          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "var(--card)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                fontSize: "14px",
                fontFamily: "'Inter', sans-serif",
              },
              success: { iconTheme: { primary: "var(--primary)", secondary: "var(--primary-foreground)" } },
            }}
          />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
