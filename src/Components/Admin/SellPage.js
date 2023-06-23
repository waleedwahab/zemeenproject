import React from "react";
import AdminNavbar from "./utils/AdminNavbar";
import styles from "./AdminPanel.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userActions } from "../Redux/user-slice";
import LogoutIcon from "@mui/icons-material/Logout";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import SellTable from "./utils/SellTable";
function SellPanel() {
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
        <h2>Sell</h2>
        <SellTable />
      </div>
    </div>
  );
}

export default SellPanel;
