import React, { useState } from "react"
import EmailValidation from "../components/EmailValidation";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { changePage } from "../features/authSlice";
import { useAppDispatch, useAppSelector } from "../hooks";

export default function ForgetPage() {
    const dispatch = useAppDispatch();
    const users = useAppSelector((state) => state.auth.users);

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(email === ''){
            setError('Please enter your email first');
            return;
        }

        const findUser = users.some((user) => user.email === email);
        
        if(findUser === false){
            setError("Email id doesn't exist");
            return;
        }
        else{
            setError('');
        }

    }

    const handleBackToLogin = () => {
        dispatch(changePage('login'))
    }
    return (
        <div className="relative bg-[whitesmoke] min-h-screen">
            <div className="bg-[#2222b9] w-screen h-[27vh] z-0"></div>
            <div className="absolute left-[35%] top-[12%] bg-white p-8 rounded-lg shadow-md w-full max-w-md z-10">

                <div className="flex justify-center">
                    <img className="w-50" src="Forget-Password-Icon.png" alt="UI Layout ICON" />
                </div>

                <h2 className="text-2xl font-bold mb-5 text-center text-gray-800">Forget Password</h2>
                <p className="text-center text-sm text-gray-500 mb-6">Enter your email and we'll send you a link to reset password</p>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    {/* Email input */}
                    <div className="mb-4 relative">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Emails
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                        />

                        <EmailValidation email={email} />

                        <button
                            className="mt-6 w-full text-white bg-[#2222b9] py-2 rounded-lg font-bold cursor-pointer hover:bg-[#2222b9c7]">
                            Submit
                        </button>

                        <button
                            onClick={handleBackToLogin}
                            className="text-gray-500 w-full flex items-center justify-center cursor-pointer mt-6 hover:text-[#2222b9]">
                            <MdKeyboardArrowLeft size={25} />
                            Back to Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}