import { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import AuthPage from '@/pages/AuthPage';
import MainPage from '@/pages/MainPage';

export interface UserData {
  id: number;
  phone: string;
  firstName: string;
  lastName: string;
  cardNumber: string;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleAuth = (data: UserData) => {
    setUserData(data);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserData(null);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {!isAuthenticated ? (
          <AuthPage onAuth={handleAuth} />
        ) : (
          <MainPage userData={userData!} onLogout={handleLogout} />
        )}
      </div>
      <Toaster />
    </>
  );
}

export default App;