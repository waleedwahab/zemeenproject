import React, { useEffect, useState } from 'react'
import './Authentication.css'
import { auth } from '../../Auth/firebase';
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import ResetPassword from './ResetPassword';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { db } from '../../Auth/firebase';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { collection, getDocs, addDoc, query, where, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { useDispatch } from "react-redux";
import { userActions } from "../Redux/user-slice"
import Typed from "react-typed";


function Authentication() {
    const [activeclassName, setActiveclassName] = useState(true);
    const [loginPassword, setLoginPassword] = useState("");
    const [loginEmail, setLoginEmail] = useState("");
    const [modal, setModal] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const ColorButton = styled(LoadingButton)(({ theme }) => ({
        color: theme.palette.getContrastText('#ff4b2b'),
        backgroundColor: '#ff4b2b',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#ffffff',
        cursor: "pointer",
        padding: "8px 45px",
        letterSpacing: "1px",
        marginTop: '8px',
        textTransform: "uppercase",
        transition: "transform 80ms ease-in",
        '&:hover': {
            backgroundColor: '#ff4b2b',
        },
    }));

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmpassword: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Required'),
            email: Yup.string()
                .required('Valid email required')
                .email('Valid email required'),
            password: Yup.string().required('Please Enter your password').matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/,
                "Must Contain 6 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
            ),
            confirmpassword: Yup.string().required('Confirm Password is required').oneOf(
                [Yup.ref('password'), null],
                'Passwords must match'
            ),
        }),
        onSubmit: (values, { resetForm }) => {
            console.log("values", values)
            setLoading(true);

            createUserWithEmailAndPassword(auth, values.email, values.password)
            .then(res => 
                {
                const user = res.user
                console.log(user)
                updateProfile(user, {
                    displayName: values.username
                })
                console.log(res);
                sendEmailVerification(user)
                    .then((ress) => {
                        setLoading(false);
                        console.log(ress);
                        toast.success('Check your Email to verify', {
                            position: toast.POSITION.TOP_RIGHT,
                        });
                        setActiveclassName(true)
                        resetForm();
                        
                        addDoc(collection(db, "users"), { id: res.user.uid, name: values.username, email: values.email, imgURL: "", role: 'user', phoneNo: "" })
                        // Email verification sent!
                    });
            }).catch(err => {
                if (err.code === 'auth/email-already-in-use') {
                    setLoading(false);
                    toast.error('Account with this email already exists', {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
                else { console.log(err); }
            })
        },
    });

    const getUser = async (id) => {
        const q = query(collection(db, "users"), where("id", "==", id));
        const querySnapshot = await getDocs(q);
        let data = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        setLoading(false);
        dispatch(userActions.userInfo(data[0]));
        if (data[0].role === 'admin') {
            navigate('/AdminDashboard')
        }
        if (data[0].role === 'user') {
            navigate('/UserDashboard')
        }
    }

    const login = (e) => {
        e.preventDefault()
        setLoading(true);
        signInWithEmailAndPassword(auth, loginEmail, loginPassword)
            .then((userCredential) => {
                // Signed in 
                if (userCredential.user.emailVerified === false) {
                    setLoading(false);
                    toast.error('Please verify your email', {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
                if (!userCredential.user.emailVerified === false) {
                    const user = userCredential.user;
                    getUser(user.uid)
                }
                // ...
            })
            .catch((error) => {
                console.log(error)
                setLoading(false);
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode)
                if (errorCode === 'auth/too-many-requests') {
                    toast.error('Too many attempts with wrong password', {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
                if (errorCode === 'auth/wrong-password') {
                    toast.error('Wrong Password', {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
                if (errorCode === "auth/user-not-found") {
                    toast.error('Please Create Account First', {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
            });
    }

    return (
        <>

            <div className="body">
                <div
                    className={
                        activeclassName ? "container" : "container right-panel-active"
                    }
                    id="container"
                >
                    <div className="form-container sign-up-container">
                        <form className="form" onSubmit={(e) => { e.preventDefault(); formik.handleSubmit() }}>
                            <h1 className="h1">Create Account</h1>
                            <div className="social-container"></div>
                            <input className="input" id="username"
                                type="text"
                                placeholder="Full Name"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.username} />
                            {formik.touched.username && formik.errors.username ? (
                                <p className="error" >{formik.errors.username}</p>
                            ) : null}

                            <input className="input" id="email"
                                type="text"
                                placeholder="Email"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email} />
                            {formik.touched.email && formik.errors.email ? (
                                <p className="error" >{formik.errors.email}</p>
                            ) : null}
                            <input className="input" id="password"
                                type="password"
                                placeholder="Password"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password} />
                            {formik.touched.password && formik.errors.password ? (
                                <p className="error" >{formik.errors.password}</p>
                            ) : null}
                            <input className="input" id="confirmpassword"
                                type="password"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.confirmpassword}
                                placeholder="Confirm password" />
                            {formik.touched.confirmpassword && formik.errors.confirmpassword ? (
                                <p className="error" >{formik.errors.confirmpassword}</p>
                            ) : null}
                            <Box sx={{ '& > button': { m: 1 } }}>
                                <ColorButton
                                    type='submit'
                                    // endIcon={<SendIcon />}
                                    loading={loading}
                                    loadingPosition="center"
                                    variant="contained"
                                >
                                    CREATE ACCOUNT
                                </ColorButton>
                            </Box>
                        </form>
                    </div>
                    <div className="form-container sign-in-container">
                        <form className="form" onSubmit={login}>
                            <h1 className="h1">Sign in</h1>
                            <div className="social-container"></div>
                            <input className="input" required type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                            <input className="input" id='' required type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                            <p className='reset' onClick={() => setModal(true)}>Reset Password</p>
                            <Box sx={{ '& > button': { m: 1 } }}>
                                <ColorButton
                                    type='submit'
                                    loading={loading}
                                    loadingPosition="center"
                                    variant="contained"
                                >
                                    SIGN IN
                                </ColorButton>
                            </Box>
                        </form>
                    </div>
                    <div className="overlay-container">
                        <div className="overlay">
                            <div className="overlay-panel overlay-left">
                                <Typed
                                    className="typed"
                                    strings={["Property Recommender"]}
                                    typeSpeed={120}
                                    backSpeed={140}
                                    loop
                                />
                                <p className='p'>
                                    Enter your details and start discovering with us

                                </p>
                                <button
                                    className="ghost"
                                    id="signIn"
                                    onClick={() => setActiveclassName(true)}
                                >
                                    Sign In
                                </button>
                            </div>
                            <div className="overlay-panel overlay-right">
                                {/* <h1 className="h1">Discover Property</h1> */}
                                <Typed
                                    className="typed"
                                    strings={["Property Recommender"]}
                                    typeSpeed={120}
                                    backSpeed={140}
                                    loop
                                />
                                <p className='p'>

                                    Enter your details and start discovering with us</p>
                                <button
                                    className="ghost"
                                    id="signUp"
                                    onClick={() => setActiveclassName(false)}
                                >
                                    Sign Up
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {modal && <ResetPassword closeModal={setModal} />}
            </div>
        </>
    )
}

export default Authentication