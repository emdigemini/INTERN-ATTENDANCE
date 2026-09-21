import NavBar from "../components/NavBar"
import { Outlet } from "react-router-dom"
import { useAdminContext } from "../context/AdminContext"
import LoginAdmin from "./LoginAdmin"

const MainLayout = () => {
  const { isAuthenticated } = useAdminContext();

  return (
    <>
      {!isAuthenticated && <LoginAdmin />}
      <div className="flex h-screen flex-col overflow-hidden">
        <NavBar />

        <main className="flex min-h-0 flex-1 flex-col">
          <Outlet />
        </main>
      </div>
    </>
  )
}

export default MainLayout
