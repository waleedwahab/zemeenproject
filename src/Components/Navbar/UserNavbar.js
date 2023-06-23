import React from 'react'
import styles from './UserNavbar.module.css'
import LogoutIcon from '@mui/icons-material/Logout';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userActions } from './../Redux/user-slice'



function UserNavbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(userActions.userInfo({}));
        navigate("/");
    };


    return (
        <>
            <div className={styles.Main}>
                <h3>Property Recommender</h3>
                <div className={styles.icons}>
                    <PermIdentityIcon />
                    <LogoutIcon className={styles.logout} onClick={handleLogout} />
                </div>
            </div>
            <div className={styles.subNavbar}>
                <NavLink
                    style={{ textDecoration: 'none' }}
                    to="/UserDashboard"
                    className={({ isActive }) => (isActive ? styles.active : styles.inactive)}
                >
                    Buy
                </NavLink>
                <NavLink
                    style={{ textDecoration: 'none' }}
                    to={"/Sell"}
                    className={({ isActive }) => (isActive ? styles.active : styles.inactive)}
                >
                    Sell
                </NavLink>
                <NavLink
                    style={{ textDecoration: 'none' }}
                    to="/Rent"
                    className={({ isActive }) => (isActive ? styles.active : styles.inactive)}
                >
                    Rent
                </NavLink>
            </div>
        </>
    )
}

export default UserNavbar