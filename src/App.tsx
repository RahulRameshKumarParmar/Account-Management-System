import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import AccountPage from './pages/Account';
import { useAppDispatch, useAppSelector } from './hooks';
import { useEffect } from 'react';
import { changePage } from './features/authSlice';

export default function App() {

  const dispatch = useAppDispatch();
  const currentPage = useAppSelector((state) => state.auth.currentPage);

  useEffect(() => {
    const getPage = localStorage.getItem('page');
    if (getPage === 'login' || getPage === 'register' || getPage === 'account') {
      dispatch(changePage(getPage));
    }
  }, [])

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
    </div>
  );
}