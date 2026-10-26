import { createContext, useContext } from "react";
import type { AttendanceStatusType, DropdownListType, InternStatsType, PhotoDataType } from "..";

type AttendanceContextType = {
  isLoading: boolean;
  isCamRunning: boolean;
  setIsCamRunning: React.Dispatch<React.SetStateAction<boolean>>;
  photo: PhotoDataType | null;
  setPhoto: React.Dispatch<React.SetStateAction<PhotoDataType | null>>;
  attendanceStatus: AttendanceStatusType | 'time_in';
  internStats: InternStatsType | null;
  handleDropdownSelect: (value: { id: string; name: string }) => void;
  setOTNotes: React.Dispatch<React.SetStateAction<string | null>>;
  timeIn: (internId: string) => Promise<void>;
  timeOut: (internId: string) => Promise<void>;
  selectedIntern: DropdownListType | null;
  setSelectedIntern: React.Dispatch<React.SetStateAction<DropdownListType | null>>;
  selectedSenior: DropdownListType | null;
  setSelectedSenior: React.Dispatch<React.SetStateAction<DropdownListType | null>>;
}

export const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const useAttendanceContext = () => {
  const context = useContext(AttendanceContext);

  if (!context) {
    throw new Error("useAttendanceContext must be used within an AttendanceProvider");
  }

  return context;
}
