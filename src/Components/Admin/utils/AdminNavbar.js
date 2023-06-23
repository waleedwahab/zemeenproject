import React from "react";
import { Link } from "react-router-dom";
import styles from "./AdminNavbar.module.css";

function AdminNavbar() {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navbarNav}>
        <h5>Property Recommendar</h5>
        <li className={styles.navItem}>
          <br />
          <Link to="/adminDashboard" className={styles.navLink}>
            Dashboard
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/admin/rent" className={styles.navLink}>
            Rent
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/admin/sell" className={styles.navLink}>
            Sell
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default AdminNavbar;
