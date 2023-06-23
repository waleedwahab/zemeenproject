import React, { useState } from "react";
import AdminNavbar from "./utils/AdminNavbar";
import UserTable from "./utils/tableData";
import styles from "./AdminPanel.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userActions } from "./../Redux/user-slice";
import LogoutIcon from "@mui/icons-material/Logout";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import RentTable from "./utils/RentTable";
import SellTable from "./utils/SellTable";
function AdminPanel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(userActions.userInfo({}));
    navigate("/adminLogin");
  };
  return (
    <div className={styles.Main}>
      <AdminNavbar />
      <div className={styles.container}>
        <h1>Admin Panel</h1>
        <div className={styles.icons}>
          <PermIdentityIcon />
          <LogoutIcon className={styles.logout} onClick={handleLogout} />
        </div>
        <h2>Users</h2>
        <UserTable />
        <h2>Rent</h2>
        <RentTable />
        <h2>Sell</h2>
        <SellTable />
      </div>
    </div>
  );
}

export default AdminPanel;
