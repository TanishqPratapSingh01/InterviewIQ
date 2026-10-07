import React from 'react'
import { BsRobot } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
import { motion } from "motion/react"
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';
import axios from 'axios';
import { ServerUrl } from '../App';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUserData } from '../redux/userSlice';

function Auth({ isModal = false, isModel = false, onClose }) {
    const isInsideModal = isModal || isModel;
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { userData } = useSelector((state) => state.user)
    const [authLoading, setAuthLoading] = useState(false)
    const [authError, setAuthError] = useState("")

    useEffect(() => {
        if (!isInsideModal && userData) {
            navigate("/")
        }
    }, [userData, isInsideModal, navigate])

    const handleGoogleAuth = async () => {
        setAuthLoading(true);
        setAuthError("");
        try {
            const response = await signInWithPopup(auth, provider);
            const user = response.user;
            const name = user.displayName || user.email?.split("@")[0] || "User";
            const email = user.email;
            const result = await axios.post(ServerUrl + "/api/auth/google", { name, email }, { withCredentials: true });
            dispatch(setUserData(result.data));
            if (onClose) onClose();
            if (!isInsideModal) {
                navigate("/");
            }
        } catch (error) {
            console.error("Google Auth error:", error);
            let msg = error.response?.data?.message || error.message || "Failed to sign in";
            if (error.code === "auth/configuration-not-found") {
                msg = "Firebase Authentication is not activated in project 'interviewiq-a71b8' yet. Open Firebase Console > Build > Authentication, click 'Get started', and enable Google provider under 'Sign-in method'. In the meantime, click 'Quick Demo Sign-In' below to test immediately!";
            } else if (error.code === "auth/operation-not-allowed") {
                msg = "Google Sign-In is not enabled in Firebase. Please enable 'Google' under Firebase Console > Authentication > Sign-in method.";
            } else if (error.code === "auth/unauthorized-domain") {
                msg = "Domain not authorized. Please add 'localhost' in Firebase Console > Authentication > Settings > Authorized domains.";
            } else if (error.code === "auth/popup-closed-by-user") {
                msg = "Sign-in popup was closed before completion.";
            } else if (error.code === "auth/popup-blocked") {
                msg = "Browser blocked the popup window. Please allow popups for localhost.";
            }
            setAuthError(msg);
        } finally {
            setAuthLoading(false);
        }
    };

    const handleDemoLogin = async () => {
        setAuthLoading(true);
        setAuthError("");
        try {
            const result = await axios.post(ServerUrl + "/api/auth/google", {
                name: "Demo Candidate",
                email: "demo@interviewiq.ai"
            }, { withCredentials: true });
            dispatch(setUserData(result.data));
            if (onClose) onClose();
            if (!isInsideModal) {
                navigate("/");
            }
        } catch (error) {
            console.error("Demo login error:", error);
            setAuthError(error.response?.data?.message || "Failed to connect to backend server.");
        } finally {
            setAuthLoading(false);
        }
    };
  return (
    <div className={`
      w-full 
      ${isInsideModal ? "py-4" : "min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6 py-20"}
    `}>
        <motion.div 
        initial={{opacity:0 , y:-40}} 
        animate={{opacity:1 , y:0}} 
        transition={{duration:0.6}}
        className={`
        w-full 
        ${isInsideModal ? "max-w-md p-8 rounded-3xl" : "max-w-lg p-12 rounded-[32px]"}
        bg-white shadow-2xl border border-gray-200
      `}>
            <div className='flex items-center justify-center gap-3 mb-6'>
                <div className='bg-black text-white p-2 rounded-lg'>
                    <BsRobot size={18}/>

                </div>
                <h2 className='font-semibold text-lg'>InterviewIQ.AI</h2>
            </div>

            <h1 className='text-2xl md:text-3xl font-semibold text-center leading-snug mb-4'>
                Continue with
                <span className='bg-green-100 text-green-600 px-3 py-1 rounded-full inline-flex items-center gap-2 ml-2'>
                    <IoSparkles size={16}/>
                    AI Smart Interview
                </span>
            </h1>

            <p className='text-gray-500 text-center text-sm md:text-base leading-relaxed mb-6'>
                Sign in to start AI-powered mock interviews, track your progress, and unlock detailed performance insights.
            </p>

            {authError && (
                <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs sm:text-sm leading-relaxed'>
                    <span className='font-semibold'>Sign-in Note: </span>
                    {authError}
                </div>
            )}

            <div className='space-y-3'>
                <motion.button 
                onClick={handleGoogleAuth}
                disabled={authLoading}
                whileHover={{opacity:0.9 , scale:1.02}}
                whileTap={{opacity:1 , scale:0.98}}
                className='w-full flex items-center justify-center gap-3 py-3.5 bg-black text-white rounded-full shadow-md font-medium disabled:opacity-50 transition cursor-pointer'>
                    <FcGoogle size={20}/>
                    {authLoading ? "Connecting..." : "Continue with Google"}
                </motion.button>

                <motion.button 
                onClick={handleDemoLogin}
                disabled={authLoading}
                whileHover={{opacity:0.9 , scale:1.02}}
                whileTap={{opacity:1 , scale:0.98}}
                className='w-full flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full font-medium text-sm disabled:opacity-50 transition cursor-pointer'>
                    Quick Demo Sign-In (Instant Access)
                </motion.button>
            </div>
        </motion.div>
      
    </div>
  )
}

export default Auth
