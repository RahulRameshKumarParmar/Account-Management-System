import React, { useEffect, useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAppDispatch } from "../hooks";
import { updateNewPassword } from "../features/authSlice";

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState<
        "Weak" | "Medium" | "Strong" | ""
    >("");
    const dispatch = useAppDispatch();

    useEffect(() => {
        const lowerCaseLetters = [
            "a",
            "b",
            "c",
            "d",
            "e",
            "f",
            "g",
            "h",
            "i",
            "j",
            "l",
            "m",
            "n",
            "o",
            "p",
            "q",
            "r",
            "s",
            "t",
            "u",
            "v",
            "w",
            "x",
            "y",
            "z",
        ];

        const upperCaseLetters = [
            "A",
            "B",
            "C",
            "D",
            "E",
            "F",
            "G",
            "H",
            "I",
            "J",
            "K",
            "L",
            "M",
            "N",
            "O",
            "P",
            "Q",
            "R",
            "S",
            "T",
            "U",
            "V",
            "W",
            "X",
            "Y",
            "Z",
        ];

        const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

        const symbols = [
            "~",
            "`",
            "!",
            "@",
            "#",
            "$",
            "%",
            "^",
            "&",
            "*",
            "(",
            ")",
            "-",
            "_",
            "+",
            "=",
            ":",
            ";",
            "?",
            "/",
            ">",
            ".",
            "<",
        ];

        let hasUpperCase = false;
        let hasLowerCase = false;
        let hasNumebers = false;
        let hasSymbols = false;

        for (const char of password) {
            if (lowerCaseLetters.includes(char)) hasLowerCase = true;
            if (upperCaseLetters.includes(char)) hasUpperCase = true;
            if (numbers.includes(char)) hasNumebers = true;
            if (symbols.includes(char)) hasSymbols = true;
        }

        if (password.length < 8) {
            setPasswordStrength("Weak");
        }

        if (
            (password.length >= 8 || password.length <= 12) &&
            hasLowerCase &&
            hasUpperCase &&
            hasNumebers
        ) {
            setPasswordStrength("Medium");
        }

        if (
            password.length >= 14 &&
            hasLowerCase &&
            hasUpperCase &&
            hasNumebers &&
            hasSymbols
        ) {
            setPasswordStrength("Strong");
        }
    }, [password]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        dispatch(updateNewPassword(password));
    }

    return (
        <div>
            <div className="relative bg-[whitesmoke] min-h-screen">
                <div className="bg-[#2222b9] w-screen h-[27vh] z-0"></div>
                <div className="absolute left-[35%] top-[12%] bg-white p-8 rounded-lg shadow-md w-full max-w-md z-10">

                    <div className="flex justify-center mb-3">
                        <img className="w-12" src="energy-logo.png" alt="UI Layout ICON" />
                    </div>

                    <h2 className="text-2xl font-bold mb-5 text-center text-gray-800">Change your Password</h2>
                    <p className="text-center text-sm text-gray-500 mb-6">Enter a new password below to change your password</p>

                    <form onSubmit={handleSubmit}>

                        {/* Password input */}
                        <div className="mb-2 relative">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                New Password *
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your password"
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="w-fit h-fit text-xl cursor-pointer absolute bottom-2.5 right-3"
                            >
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </span>
                        </div>

                        <div className={`${password === "" ? 'hidden' : 'block'} border-4 rounded-lg ps-3 py-1.5 mb-2 ${passwordStrength === 'Weak' ? 'border-gray-300' : passwordStrength === 'Medium' ? 'border-yellow-200' : 'border-green-200'}`}>{passwordStrength}</div>

                        {/* Confirm Password input */}
                        <div className="mb-6 relative">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Confirm New Password *
                            </label>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Confirm your password"
                            />
                            <span
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="w-fit h-fit text-xl cursor-pointer absolute bottom-2.5 right-3"
                            >
                                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                            </span>
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 cursor-pointer"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}