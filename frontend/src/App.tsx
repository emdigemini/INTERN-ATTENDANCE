import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./pages/MainLayout";
import InternAttendance from "./pages/attendance/InternAttendance";
import AddIntern from "./pages/admin/AddIntern";
import AdminProvider from "./context/AdminProvider";
import InternProvider from "./context/InternProvider";

const App = () => {
  return (
    <AdminProvider>
      <InternProvider>
        <Router>
          <Routes>
            <Route element={ <MainLayout /> }>
              <Route path="/" element={<InternAttendance />} />
              <Route path="/admin" element={<AddIntern />} />
            </Route>
          </Routes>
        </Router>
      </InternProvider>
    </AdminProvider>
  )
}

export default App
