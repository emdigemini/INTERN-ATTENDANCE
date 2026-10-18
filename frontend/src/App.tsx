import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./pages/MainLayout";
import InternAttendance from "./pages/attendance/InternAttendance";
import Admin from "./pages/admin/Admin";
import AdminProvider from "./context/AdminProvider";
import InternProvider from "./context/InternProvider";
import AttendanceProvider from "./context/AttendanceProvider";

const App = () => {
  return (
    <AdminProvider>
      <AttendanceProvider>
        <InternProvider>
          <Router>
            <Routes>
              <Route element={ <MainLayout /> }>
                <Route path="/" element={<InternAttendance />} />
                <Route path="/admin" element={<Admin />} />
              </Route>
            </Routes>
          </Router>
        </InternProvider>
      </AttendanceProvider>
    </AdminProvider>
  )
}

export default App
