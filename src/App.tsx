import { useState } from 'react';
import AuthPage from '@/pages/AuthPage';
import MainPage from '@/pages/MainPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<{
    phone: string;
    firstName: string;
    lastName: string;
  } | null>(null);

  const handleAuth = (data: { phone: string; firstName: string; lastName: string }) => {
    setUserData(data);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {!isAuthenticated ? (
        <AuthPage onAuth={handleAuth} />
      ) : (
        <MainPage userData={userData!} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;