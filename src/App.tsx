import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import AccountPage from './pages/Account';
import { useAppDispatch, useAppSelector } from './hooks';
import { useEffect } from 'react';
import { initializeAuth } from './features/authSlice';
import AdminLogin from './pages/AdminLogin';

// Main App Component

export default function App() {

  const dispatch = useAppDispatch();
  const currentPage = useAppSelector((state) => state.auth.currentPage);
  const isIntialized = useAppSelector((state) => state.auth.isInitialized);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch])

  if(!isIntialized){
    return(
      <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
        <div className='text-gray-600'>Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Render appropriate page based on currentPage state */}
      {currentPage === 'login' && (
        <LoginPage />
      )}
      {currentPage === 'register' && (
        <RegisterPage />
      )}
      {currentPage === 'account' && (
        <AccountPage />
      )}
      {currentPage === 'adminLogin' && (
        <AdminLogin />
      )}
    </div>
  );
}