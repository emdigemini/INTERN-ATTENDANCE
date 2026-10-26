import { useCallback, useEffect, useState } from "react";
import { InternContext } from "./InternContext";
import type { Props, EditInternType, InternType, SiteListType, InternWithPagination, SeniorType } from "..";
import { based_url } from '../axios.ts';
import { useAdminContext } from "./AdminContext.tsx";

const InternProvider = ({ children }: Props) => {
  const { isAuthenticated, admin } = useAdminContext();
  const [isLoading, setIsLoading] = useState(false);
  const [interns, setInterns] = useState<InternType[] | []>([]);
  const [seniors, setSeniors] = useState<SeniorType[] | []>([]);
  const [allInterns, setAllInterns] = useState<InternWithPagination | null>(null);
  const [selectedSite, setSelectedSite] = useState<SiteListType>(admin?.company_site as SiteListType);
  
  const [editIntern, setEditIntern] = useState<EditInternType | null>(null);

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

  const fetchSeniors = async () => {
    setIsLoading(true);
    try {
      const res = await based_url.get('/admin_cnx/senior-list');
      setSeniors(res.data.seniors);
    } catch (err: unknown) {
      console.log(err);
      setSeniors([]);
    } finally {
      setIsLoading(false);
    }
  }

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
    async function runFetching() {
      await fetchAllInterns();
      await fetchUnfinishedInterns();
      await fetchSeniors();
    }
    if (isAuthenticated && admin) {
      runFetching();
    }
  }, [isAuthenticated, admin, fetchAllInterns, fetchUnfinishedInterns]);

  return (
    <InternContext.Provider value={{ 
      isLoading, interns, allInterns,
      setIsLoading, fetchAllInterns, 
      selectSite, fetchUnfinishedInterns,
      editIntern, setEditIntern, seniors
    }}>
      { children }
    </InternContext.Provider>
  )
}

export default InternProvider
