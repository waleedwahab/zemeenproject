import React, { useState } from 'react'
import styles from './ResetPassword.module.css'
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, _auth } from '../../Auth/firebase';
import { getAuth } from "firebase/auth";
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';


function ResetPassword({ closeModal }) {
    const [email, setEmail] = useState("");

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

    const resetPassword = (e) => {
        e.preventDefault()
        setLoading(true);
        console.log(email)
        sendPasswordResetEmail(auth, email)
            .then((res) => {
                setLoading(false);
                toast.success('Check your email to change password', {
                    position: toast.POSITION.TOP_RIGHT,
                });
                closeModal(false)
            })
            .catch((error) => {
                setLoading(false);
                const errorCode = error.code;
                if (errorCode === 'auth/user-not-found') {
                    toast.error('Please create account first', {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
            });

    }

    return (
        <>
            <div className={styles.modalBackground} onClick={() => closeModal(false)}></div>
            <form className={styles.modalContainer} onSubmit={resetPassword}>
                <h1 className={styles.h1}>Password Reset</h1>
                <input required placeholder='Enter Your Email' type='text' className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} />

                <div className={styles.buttonDiv}>
                    {/* <button className={styles.button1} type='submit'>Reset</button> */}
                    <ColorButton
                        type='submit'
                        // endIcon={<SendIcon />}
                        loading={loading}
                        loadingPosition="center"
                        variant="contained"
                    >
                        Reset
                    </ColorButton>

                </div>
            </form>
        </>
    )
}

export default ResetPassword