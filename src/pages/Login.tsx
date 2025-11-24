import { useEffect, useState } from "react";
import { changePage, login } from "../features/authSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {

  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.auth.users);
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  useEffect(() => {
    if (currentUser && rememberMe) {
      setEmail(currentUser.email || '');
      setPassword(currentUser.password || '');
    }
  }, [currentUser, rememberMe])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate inputs
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const loginDetailsExists = users.some((u) => u.email === email && u.password === password);
    if (!loginDetailsExists) {
      setError('Invalid Email or Password');
      return;
    }

    dispatch(login({ email, password }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
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

          <div className="mb-3 flex items-center gap-2">
            <input className="cursor-pointer" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} type="checkbox" />
            <span>Remember Me</span>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-blue-500 cursor-pointer text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>

        {/* Link to registration page */}
        <p className="mt-4 text-center text-gray-600 text-sm">
          Don't have an account?{' '}
          <button
            onClick={() => dispatch(changePage('register'))}
            className="text-blue-500 cursor-pointer hover:text-blue-700 font-semibold"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}
