import { createContext, useContext } from "react";
import type { AdminType, LoginType, NewInternFormType } from "..";

type AdminContextType = {
  isLoading: boolean;
  isAuthenticated: boolean;
  admin: AdminType | null;
  loginAdmin: ({ username, password }: LoginType) => Promise<void>;
  logoutAdmin:  () => Promise<void>;
  addNewIntern: ({ firstName, lastName, schoolName, requiredHours, companySite }: NewInternFormType) => Promise<void>;
}

export const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdminContext = () => {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error("useAdminContext must be used within an AdminProvider");
  }
  return context;
}