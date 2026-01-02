import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAppDispatch} from "../hooks";
import { adminLogin, changePage } from "../features/authSlice";

export default function AdminLogin() {

    const dispatch = useAppDispatch();

    const [error, setError] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setError('');

        if(!email || !password){
            setError('Please fill all the fields');
        }

        if(email !== 'prakash@gmail.com' && password !== 'prakash123#$'){
            setError('Invalid Email or Password');
        }

        dispatch(adminLogin({email, password}));
    }

    const handleUserLogin = () => {
        dispatch(changePage('login'));
        
    }

    return (
        <div className="flex relative items-center justify-center min-h-screen">
            <div className="absolute right-3 top-5 font-bold bg-white py-2 px-3 rounded-2xl cursor-pointer hover:bg-[#0f010148]">
                <button onClick={handleUserLogin} className="cursor-pointer">User Login</button>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Email input */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Password input */}
                    <div className="mb-2 relative">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="w-fit h-fit text-xl cursor-pointer absolute bottom-2.5 right-3">{showPassword ? <FaEye /> : <FaEyeSlash />}
                        </span>
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 cursor-pointer text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 mt-5"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}
