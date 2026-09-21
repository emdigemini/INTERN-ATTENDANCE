import { isAxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { InternContext } from "./InternContext";
import type { Props, EditInternType, InternType, SiteListType, InternWithPagination, DropdownListType, InternStatsType, PhotoDataType, AttendanceStatusType } from "..";
import { based_url } from '../axios.ts';
import { useAdminContext } from "./AdminContext.tsx";
import toast from "react-hot-toast";

const InternProvider = ({ children }: Props) => {
  const { isAuthenticated, admin } = useAdminContext();
  const [isLoading, setIsLoading] = useState(false);
  const [interns, setInterns] = useState<InternType[] | []>([]);
  const [internStats, setInternStats] = useState<InternStatsType | null>(null);
  const [allInterns, setAllInterns] = useState<InternWithPagination | null>(null);
  const [selectedSite, setSelectedSite] = useState<SiteListType>(admin?.company_site as SiteListType);
  const [selectedIntern, setSelectedIntern] = useState<DropdownListType | null>(null);
  
  const [photo, setPhoto] = useState<PhotoDataType | null>(null);
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatusType | 'time_in'>('time_in');
  const [editIntern, setEditIntern] = useState<EditInternType | null>(null);
  
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

  const fetchAllInterns = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await based_url.get('/admin_cnx/interns-list', {
        params: {
          page: 1,
          site: selectedSite
        }
      });

      setAllInterns(res.data.res);
    } catch (err: unknown) {
      console.log(err);
      setAllInterns(null);
    } finally {
      setIsLoading(false);
    }
  }, [selectedSite]);


  const fetchUnfinishedInterns = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await based_url.get('/admin_cnx/unfinished-interns');
      setInterns(res.data.interns);
    } catch (err: unknown) {
      console.log(err);
      setInterns([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectSite = (site: SiteListType) => {
    setSelectedSite(site);
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
        console.log(res.data.status)
      } catch (err: unknown) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchInternStats();
    checkAttendanceStatus();
  }, [selectedIntern]);

  useEffect(() => {
    async function runFetching() {
      await fetchAllInterns();
      await fetchUnfinishedInterns();
    }
    if (isAuthenticated && admin) {
      runFetching();
    }
  }, [isAuthenticated, admin, fetchAllInterns, fetchUnfinishedInterns]);

  return (
    <InternContext.Provider value={{ 
      isLoading, interns, allInterns, selectedIntern,
      internStats, photo, setIsLoading, fetchAllInterns, 
      selectSite, fetchUnfinishedInterns, timeIn, timeOut,
      handleInternSelect, setPhoto, attendanceStatus,
      editIntern, setEditIntern,
    }}>
      { children }
    </InternContext.Provider>
  )
}

export default InternProvider
