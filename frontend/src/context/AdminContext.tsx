import { createContext, useContext } from "react";
import type { AdminType, LoginType, NewInternFormType } from "..";

type AdminContextType = {
  isLoading: boolean;
  isAuthenticated: boolean;
  admin: AdminType | null;
  loginAdmin: ({ username, password }: LoginType) => Promise<void>;
  logoutAdmin:  () => Promise<void>;
  addNewIntern: ({ firstName, lastName, schoolName, requiredHours, companySite }: NewInternFormType) => Promise<void>;
  firstName: string; 
  setFirstName: React.Dispatch<React.SetStateAction<string>>; 
  lastName: string; 
  setLastName: React.Dispatch<React.SetStateAction<string>>;
  schoolName: string; 
  setSchoolName: React.Dispatch<React.SetStateAction<string>>; 
  requiredHours: number; 
  setRequiredHours: React.Dispatch<React.SetStateAction<number>>;
  companySite: string; 
  setCompanySite: React.Dispatch<React.SetStateAction<string>>;
  adminConfirmation: boolean;
  setAdminConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  passwordConfirmation: string;
  setPasswordConfirmation: React.Dispatch<React.SetStateAction<string>>;
}

export const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdminContext = () => {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error("useAdminContext must be used within an AdminProvider");
  }
  return context;
}