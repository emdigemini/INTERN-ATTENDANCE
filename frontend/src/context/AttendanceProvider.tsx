import { useEffect, useState } from "react";
import { AttendanceContext } from "./AttendanceContext"
import type { AttendanceStatusType, DropdownListType, InternStatsType, PhotoDataType, Props } from "..";
import { based_url } from "../axios";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

const AttendanceProvider = ({ children }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCamRunning, setIsCamRunning] = useState(false);
  const [photo, setPhoto] = useState<PhotoDataType | null>(null);
  const [selectedIntern, setSelectedIntern] = useState<DropdownListType | null>(null);
  const [internStats, setInternStats] = useState<InternStatsType | null>(null);

  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatusType | 'time_in'>('time_in');

  const handleInternSelect = ({ id, name }: DropdownListType) => {
    setSelectedIntern({ id, name });
  }

  const timeIn = async (internId: string) => {
    if (!photo?.data) return;
    setIsLoading(true);
    try {
      const formData = new FormData(); 
      formData.append("photo", photo.data);
      formData.append("internId", internId);
      
      const res = await based_url.post('/attendance_cnx/time-in', formData);
      setSelectedIntern(null);
      toast.success(res.data.message);
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Something went wrong.');
      }
    } finally {
      setIsLoading(false);
      setPhoto(null);
    }
  }

  const timeOut = async (internId: string) => {
    if (!photo?.data) return;
    setIsLoading(true);
    try {
      const formData = new FormData(); 
      formData.append("photo", photo.data);
      formData.append("internId", internId);
      
      const res = await based_url.patch('/attendance_cnx/time-out', formData);
      toast.success(res.data.message);
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Something went wrong.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (selectedIntern?.id === '' || !selectedIntern) return;

    const fetchInternStats = async () => {
      try {
        const res = await based_url.get('/attendance_cnx/intern-stats', {
          params: {
            id: selectedIntern.id
          }
        });

        setInternStats(res.data.intern);
      } catch (err: unknown) {
        if (isAxiosError(err)) {
          toast.error(err.response?.data?.message || 'Something went wrong.');
        }
      }
    }

    const checkAttendanceStatus = async () => {
    if (selectedIntern?.id === '' || !selectedIntern) return;
      setIsLoading(true);
      try {
        const res = await based_url.get('/attendance_cnx/attendance-status', {
          params: {
            id: selectedIntern.id
          }
        });
        setAttendanceStatus(res.data.status);
      } catch (err: unknown) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchInternStats();
    checkAttendanceStatus();
  }, [selectedIntern]);

  return (
    <AttendanceContext.Provider value={{
      isLoading, isCamRunning, setIsCamRunning, photo, setPhoto,
      selectedIntern, setSelectedIntern, 
      attendanceStatus, internStats, handleInternSelect, timeIn, timeOut
    }}>
      {children}
    </AttendanceContext.Provider>
  )
}

export default AttendanceProvider
