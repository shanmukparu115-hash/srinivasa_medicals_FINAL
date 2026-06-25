// ============================================================
// AppContext.tsx — Minimal context (no cart/order — this is an
// availability-check site, not an e-commerce platform)
// ============================================================
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from "react";
import type { PrescriptionFile } from "../types";
import { prescriptionService } from "../services/prescriptionService";
import { useAuth } from "./AuthContext";

interface AppContextProps {
  uploadPrescription: (
    name: string,
    phone: string,
    notes: string,
    files: PrescriptionFile[]
  ) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const uploadPrescription = async (
    name: string,
    phone: string,
    notes: string,
    files: PrescriptionFile[]
  ) => {
    await prescriptionService.create(user?.id, name, phone, notes, files);
  };

  return (
    <AppContext.Provider value={{ uploadPrescription }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

// Kept for backward compat with any remaining imports
export type { PrescriptionFile };
