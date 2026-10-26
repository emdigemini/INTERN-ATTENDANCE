import { createContext, useContext } from "react";
import type { InternType, SiteListType, InternWithPagination, EditInternType, SeniorType } from "..";

type InternContextType = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  interns: InternType[] | [];
  seniors: SeniorType[] | [];
  allInterns: InternWithPagination | null;
  fetchAllInterns: () => Promise<void>;
  selectSite: (site: SiteListType) => void;
  fetchUnfinishedInterns: () => Promise<void>;
  editIntern: EditInternType | null;
  setEditIntern: React.Dispatch<React.SetStateAction<EditInternType | null>>;
}

export const InternContext = createContext<InternContextType | undefined>(undefined);

export const useInternContext = () => {
  const context = useContext(InternContext);

  if (!context) {
    throw new Error("useInternContext must be used within an AuthProvider");
  }
  return context;
}