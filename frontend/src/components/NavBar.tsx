import { Link, useLocation } from "react-router-dom"
import { useAdminContext } from "../context/AdminContext";

const NavBar = () => {
  const pathname = useLocation().pathname;
  const { admin, logoutAdmin } = useAdminContext();

  return (
    <header className="flex items-center bg-[#003B70] px-4 py-3 shadow-md">
      <Link to={pathname === '/' ? '/admin' : '/'}
        className="rounded-md bg-[#0072CE] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#005EA8] cursor-pointer"
      >
        {pathname === '/' ? 'Admin' : 'Attendance'}
      </Link>

      <h1 className="flex-1 text-center text-xl font-bold tracking-wide text-white">
        {admin && admin.company_site?.toUpperCase()} INTERN IN AND OUT
      </h1>

      <button
        className="
          cursor-pointer
          rounded-md
          bg-white
          px-4 py-2
          text-sm font-medium
          text-[#004A80]
          transition
          hover:bg-gray-100
        "
        onClick={() => {
          logoutAdmin();
        }}
      >
        Logout <span className="underline"> {admin && admin.name.toUpperCase()}</span>
      </button>

      <div className="w-17.5" />
    </header>
  )
}

export default NavBar
