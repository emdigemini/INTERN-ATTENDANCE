import { useEffect, useState } from "react";
import { AdminContext } from "./AdminContext";
import type { Props, AdminType, LoginType, NewInternFormType } from "..";
import { based_url } from "../axios";
import toast from "react-hot-toast";

const AdminProvider = ({ children }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState<AdminType | null>(null)

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [schoolName, setSchoolName] = useState<string>('');
  const [requiredHours, setRequiredHours] = useState<number>(180);
  const [companySite, setCompanySite] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");

  // const [updateFirstName, setUpdateFirstName] = useState<string>('');
  // const [updateLastName, setUpdateLastName] = useState<string>('');
  // const [updateSchoolName, setUpdateSchoolName] = useState<string>('');
  // const [updateRequiredHours, setUpdateRequiredHours] = useState<number>(0);
  // const [updateStartedAt, setUpdateStartedAt] = useState<string>('');

  const [adminConfirmation, setAdminConfirmation] = useState(false);

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

    if (!passwordConfirmation) {
      toast.error('Enter admin password to continue.');
    }
    setIsLoading(true);
    try {
      const res = await based_url.post('/admin_cnx/new-intern', {
        firstName, lastName, schoolName, requiredHours, companySite, passwordConfirmation
      });
      toast.success(res.data.message);
    } catch (err: unknown) {
      console.log(err);
    } finally {
      setIsLoading(false);
      setFirstName("");
      setLastName("");
      setSchoolName("");
      setRequiredHours(180);
      setCompanySite("");
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
      loginAdmin, logoutAdmin, addNewIntern,
      firstName, setFirstName, lastName, setLastName,
      schoolName, setSchoolName, requiredHours, setRequiredHours,
      companySite, setCompanySite, adminConfirmation, setAdminConfirmation,
      passwordConfirmation, setPasswordConfirmation
    }}>
      { children }
    </AdminContext.Provider>
  )
}

export default AdminProvider
