import { useEffect, useState } from "react";
import { AdminContext } from "./AdminContext";
import type { Props, AdminType, LoginType, NewInternFormType } from "..";
import { based_url } from "../axios";
import toast from "react-hot-toast";

const AdminProvider = ({ children }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState<AdminType | null>(null)

  const loginAdmin = async ({ username, password }: LoginType) => {
    if (!username || !password) {
      toast.error('All fields are required.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await based_url.post('/admin_cnx/login-cnx', { username, password });
      setAdmin(res.data.admin);
      setIsAuthenticated(true);
    } catch (err: unknown) {
      console.log(err);
      setAdmin(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }

  const logoutAdmin = async () => {
    if (!isAuthenticated || !admin) return;
    try {
      const res = await based_url.post('/admin_cnx/logout-cnx');
      setAdmin(null);
      setIsAuthenticated(false);
      toast.success(res.data.message);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  const addNewIntern = async ({
     firstName, lastName, schoolName, requiredHours, companySite 
    }: NewInternFormType) => {
    if (
      !firstName || !lastName || !schoolName
      || !requiredHours || !companySite
    ) {
      toast.error('All fields are required.')
    }
    setIsLoading(true);
    try {
      const res = await based_url.post('/admin_cnx/new-intern', {
        firstName, lastName, schoolName, requiredHours, companySite
      });
      toast.success(res.data.message);
    } catch (err: unknown) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);

      try {
        const res = await based_url.get("/auth/verifying");
        if (!res.data) {
          setAdmin(null);
          setIsAuthenticated(false);
        }
        setAdmin(res.data.admin);
        setIsAuthenticated(true);
      } catch (err: unknown) {
        console.log(err);
        setAdmin(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }

      checkAuth();
  }, []);

  return (
    <AdminContext.Provider value={{
      isLoading, isAuthenticated, admin,
      loginAdmin, logoutAdmin, addNewIntern
    }}>
      { children }
    </AdminContext.Provider>
  )
}

export default AdminProvider
