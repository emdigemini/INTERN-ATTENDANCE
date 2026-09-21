import { createContext, useContext } from "react";
import type { InternType, SiteListType, InternWithPagination, DropdownListType, InternStatsType, PhotoDataType, AttendanceStatusType } from "..";

type InternContextType = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  interns: InternType[] | [];
  allInterns: InternWithPagination | null;
  selectedIntern: DropdownListType | null;
  internStats: InternStatsType | null;
  photo: PhotoDataType | null;
  attendanceStatus: AttendanceStatusType | 'time_in';
  setPhoto: React.Dispatch<React.SetStateAction<PhotoDataType | null>>;
  timeIn: (internId: string) => Promise<void>;
  timeOut: (internId: string) => Promise<void>;
  fetchAllInterns: () => Promise<void>;
  selectSite: (site: SiteListType) => void;
  fetchUnfinishedInterns: () => Promise<void>;
  handleInternSelect: (value: { id: string; name: string }) => void;
}

export const InternContext = createContext<InternContextType | undefined>(undefined);

export const useInternContext = () => {
  const context = useContext(InternContext);

  if (!context) {
    throw new Error("useInternContext must be used within an AuthProvider");
  }
  return context;
}