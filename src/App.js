import { Routes, Route } from "react-router-dom";
import "./App.css";
import Missing from "./Components/Layout/Missing";
import Unauthorized from "./Components/Layout/Unauthorized";
import Layout from "./Components/Layout/Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Authentication from "./Components/Authentication/Authentication";
import RequireAuth from "./Components/Layout/RequireAuth";
import UserDashboard from "./Components/Dashboard/UserDashboard";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import Sell from "./Components/Sell/Sell";
import ManageSell from "./Components/Sell/ManageSell";
import SellEdit from "./Components/Sell/SellEdit";
import Rent from "./Components/Rent/Rent";
import ManageRent from "./Components/Rent/ManageRent";
import RentEdit from "./Components/Rent/RentEdit";
import AdminLogin from "./Components/Admin/adminLogin";
import SellPanel from "./Components/Admin/SellPage";
import RentPanel from "./Components/Admin/RentPage";
import Conversation from "./Components/utils/conversation";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route path="/" element={<Authentication />} />
          {/* Protected Admin Routes */}
          <Route path="AdminLogin" element={<AdminLogin />} />
          <Route path="AdminDashboard" element={<AdminDashboard />} />
          <Route path="/admin/sell" element={<SellPanel />} />
          <Route path="/admin/rent" element={<RentPanel />} />
          <Route path="/user/conversation" element={<Conversation />} />

          {/* Protected User Routes */}
          <Route element={<RequireAuth allowedRoles={"user"} />}>
            <Route path="UserDashboard" element={<UserDashboard />} />
            <Route path="Sell" element={<Sell />} />
            <Route path="Rent" element={<Rent />} />
            <Route path="ManageSell" element={<ManageSell />} />
            <Route path="ManageRent" element={<ManageRent />} />
            <Route path="SellEdit" element={<SellEdit />} />
            <Route path="RentEdit" element={<RentEdit />} />
          </Route>
          <Route path="*" element={<Missing />} />
          <Route path="Unauthorized" element={<Unauthorized />} />
        </Route>
      </Routes>

      <ToastContainer
        style={{ zIndex: "1000000000000000000000" }}
        autoClose={2000}
      />
    </>
  );
}

export default App;
