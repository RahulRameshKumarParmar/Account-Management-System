import React, { useState } from 'react';

// TypeScript interfaces for type safety
interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  register: (userData: Omit<User, 'id'>) => boolean;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

// Main App component
export default function App() {
  // State to track current page/route
  const [currentPage, setCurrentPage] = useState<'login' | 'register' | 'account'>('login');
  
  // State to store registered users (in-memory storage)
  const [users, setUsers] = useState<User[]>([]);
  
  // State to track currently logged-in user
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Login function - checks credentials against stored users
  const login = (email: string, password: string): boolean => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      setCurrentPage('account');
      return true;
    }
    return false;
  };

  // Registration function - creates new user account
  const register = (userData: Omit<User, 'id'>): boolean => {
    // Check if email already exists
    if (users.some(u => u.email === userData.email)) {
      return false;
    }
    
    // Create new user with unique ID
    const newUser: User = {
      ...userData,
      id: Date.now().toString()
    };
    
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setCurrentPage('account');
    return true;
  };

  // Logout function - clears current user and returns to login
  const logout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
  };

  // Update user function - modifies current user's information
  const updateUser = (userData: Partial<User>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      setCurrentUser(updatedUser);
      
      // Update in users array
      setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    }
  };

  // Auth context to pass down to child components
  const authContext: AuthContextType = {
    currentUser,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Render appropriate page based on currentPage state */}
      {currentPage === 'login' && (
        <LoginPage 
          auth={authContext} 
          onNavigateToRegister={() => setCurrentPage('register')} 
        />
      )}
      {currentPage === 'register' && (
        <RegisterPage 
          auth={authContext} 
          onNavigateToLogin={() => setCurrentPage('login')} 
        />
      )}
      {currentPage === 'account' && (
        <AccountPage auth={authContext} />
      )}
    </div>
  );
}

// Login Page Component
function LoginPage({ auth, onNavigateToRegister }: { 
  auth: AuthContextType; 
  onNavigateToRegister: () => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate inputs
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    // Attempt login
    const success = auth.login(email, password);
    if (!success) {
      setError('Invalid email or password');
    }
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
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          
          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>
        
        {/* Link to registration page */}
        <p className="mt-4 text-center text-gray-600 text-sm">
          Don't have an account?{' '}
          <button
            onClick={onNavigateToRegister}
            className="text-blue-500 hover:text-blue-700 font-semibold"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}

// Registration Page Component
function RegisterPage({ auth, onNavigateToLogin }: { 
  auth: AuthContextType; 
  onNavigateToLogin: () => void;
}) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [error, setError] = useState('');

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate all fields are filled
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    // Attempt registration
    const success = auth.register({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone
    });
    
    if (!success) {
      setError('Email already exists');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* First Name input */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your first name"
            />
          </div>
          
          {/* Last Name input */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your last name"
            />
          </div>
          
          {/* Email input */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          
          {/* Phone input */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your phone number"
            />
          </div>
          
          {/* Password input */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          
          {/* Confirm Password input */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Confirm Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your password"
            />
          </div>
          
          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Register
          </button>
        </form>
        
        {/* Link to login page */}
        <p className="mt-4 text-center text-gray-600 text-sm">
          Already have an account?{' '}
          <button
            onClick={onNavigateToLogin}
            className="text-blue-500 hover:text-blue-700 font-semibold"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}

// Account Management Page Component
function AccountPage({ auth }: { auth: AuthContextType }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: auth.currentUser?.firstName || '',
    lastName: auth.currentUser?.lastName || '',
    email: auth.currentUser?.email || '',
    phone: auth.currentUser?.phone || ''
  });
  const [success, setSuccess] = useState('');

  // Handle input changes in edit mode
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Save updated user information
  const handleSave = () => {
    auth.updateUser(formData);
    setIsEditing(false);
    setSuccess('Account information updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  // Cancel editing and reset form
  const handleCancel = () => {
    setFormData({
      firstName: auth.currentUser?.firstName || '',
      lastName: auth.currentUser?.lastName || '',
      email: auth.currentUser?.email || '',
      phone: auth.currentUser?.phone || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Header with logout button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">My Account</h2>
            <button
              onClick={auth.logout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
            >
              Logout
            </button>
          </div>
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}
          
          {/* Account information display/edit form */}
          <div className="space-y-4">
            {/* First Name field */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                First Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800 py-2">{auth.currentUser?.firstName}</p>
              )}
            </div>
            
            {/* Last Name field */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Last Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800 py-2">{auth.currentUser?.lastName}</p>
              )}
            </div>
            
            {/* Email field */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800 py-2">{auth.currentUser?.email}</p>
              )}
            </div>
            
            {/* Phone field */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Phone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800 py-2">{auth.currentUser?.phone || 'Not provided'}</p>
              )}
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="mt-6 flex gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-200"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
              >
                Edit Account
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}