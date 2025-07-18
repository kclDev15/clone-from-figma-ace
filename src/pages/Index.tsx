import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

interface LoginData {
  email: string;
  username: string;
  password: string;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
}

const Index: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const [isRegistered, setIsRegistered] = useState(false);

  // Redirect to home if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  const handleRegister = async (data: RegisterData) => {
    // Simulate API call
    console.log('Registration attempt:', { ...data, password: '[REDACTED]' });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Success case
    toast.success('Registration successful!', {
      description: `Welcome, ${data.username}! Please proceed to login.`,
      duration: 4000,
    });
    
    setIsRegistered(true);
  };

  const handleLogin = async (data: LoginData) => {
    // Simulate API call
    console.log('Login attempt:', { ...data, password: '[REDACTED]' });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate different outcomes based on username
    if (data.username.toLowerCase() === 'admin') {
      throw new Error('Invalid credentials');
    }
    
    // Success case - create user object and log them in
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      email: data.email,
      username: data.username,
    };
    
    login(user);
    
    toast.success('Login successful!', {
      description: `Welcome back, ${data.username}! You have been logged in successfully.`,
      duration: 4000,
    });
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center text-[13px] text-black font-medium px-4 py-8 sm:px-5 sm:py-[100px] md:px-[61px] md:py-[150px]">
      <main role="main" className="w-full max-w-[420px]">
        {!isRegistered ? (
          <div className="space-y-6">
            <RegisterForm onSubmit={handleRegister} />
            <div className="text-center">
              <p className="text-[13px] text-black mb-2">Already have an account?</p>
              <button
                onClick={() => setIsRegistered(true)}
                className="text-[13px] text-purple-600 underline hover:text-purple-700"
              >
                Click here to login
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <LoginForm onSubmit={handleLogin} />
            <div className="text-center">
              <p className="text-[13px] text-black mb-2">Don't have an account?</p>
              <button
                onClick={() => setIsRegistered(false)}
                className="text-[13px] text-purple-600 underline hover:text-purple-700"
              >
                Click here to register
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
