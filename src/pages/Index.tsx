import React from 'react';
import LoginForm from '@/components/LoginForm';
import { toast } from 'sonner';

interface LoginData {
  email: string;
  username: string;
  password: string;
}

const Index: React.FC = () => {
  const handleLogin = async (data: LoginData) => {
    // Simulate API call
    console.log('Login attempt:', { ...data, password: '[REDACTED]' });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate different outcomes based on username
    if (data.username.toLowerCase() === 'admin') {
      throw new Error('Invalid credentials');
    }
    
    // Success case
    toast.success('Login successful!', {
      description: `Welcome back, ${data.username}! You have been logged in successfully.`,
      duration: 4000,
    });
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center text-[13px] text-black font-medium px-5 py-[100px] md:px-[61px] md:py-[236px]">
      <main role="main" className="w-full max-w-[420px]">
        <LoginForm onSubmit={handleLogin} />
      </main>
    </div>
  );
};

export default Index;
