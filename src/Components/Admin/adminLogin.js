import React, { useState } from "react";
import styles from "./AdminLogin.module.css";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../../Auth/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../Auth/firebase";
import { useDispatch } from "react-redux";
import { userActions } from "../Redux/user-slice";
import LoadingButton from "@mui/lab/LoadingButton";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

function AdminLogin() {
  const [loginPassword, setLoginPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const ColorButton = styled(LoadingButton)(({ theme }) => ({
    color: theme.palette.getContrastText("#ff4b2b"),
    backgroundColor: "#ff4b2b",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
    color: "#ffffff",
    cursor: "pointer",
    padding: "8px 45px",
    letterSpacing: "1px",
    marginTop: "8px",
    textTransform: "uppercase",
    transition: "transform 80ms ease-in",
    "&:hover": {
      backgroundColor: "#ff4b2b",
    },
  }));

  const getUser = async (id) => {
    const q = query(collection(db, "users"), where("id", "==", id));
    const querySnapshot = await getDocs(q);
    let data = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setLoading(false);
    dispatch(userActions.userInfo(data[0]));
    if (data[0].role === "admin") {
      navigate("/adminLogin");
    }
    if (data[0].role === "user") {
      navigate("/AdminDashboard");
    }
  };

  const login = (e) => {
    e.preventDefault();
    setLoading(true);
    signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      .then((userCredential) => {
        // Signed in
        if (userCredential.user.emailVerified === false) {
          setLoading(false);
          toast.error("Please verify your email", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
        if (!userCredential.user.emailVerified === false) {
          const user = userCredential.user;
          getUser(user.uid);
        }
        // ...
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        if (errorCode === "auth/too-many-requests") {
          toast.error("Too many attempts with wrong password", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
        if (errorCode === "auth/wrong-password") {
          toast.error("Wrong Password", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
        if (errorCode === "auth/user-not-found") {
          toast.error("Please Create Account First", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      });
  };
  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={login}>
        <h1>Admin Login</h1>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            className="input"
            required
            type="email"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password:</label>
          <input
            className="input"
            id=""
            required
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
        </div>
        <Box sx={{ "& > button": { m: 1 } }}>
          <ColorButton
            type="submit"
            loading={loading}
            loadingPosition="center"
            variant="contained"
          >
            Log IN
          </ColorButton>
        </Box>
      </form>
    </div>
  );
}

export default AdminLogin;
