import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { InputField } from '@/components/ui/input-field';
import { LoginButton } from '@/components/ui/login-button';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password must be less than 50 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => void | Promise<void>;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const handleFormSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        // Default behavior - simulate login
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success('Login successful!', {
          description: `Welcome back, ${data.username}!`,
        });
        reset();
      }
    } catch (error) {
      toast.error('Login failed', {
        description: 'Please check your credentials and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-white border border-black border-solid w-[420px] h-[428px] relative">
      <header className="text-center pt-[57px] pb-6">
        <h1 className="text-2xl font-medium text-black mb-4">
          ¡Welcome!
        </h1>
        <p className="text-[13px] font-medium text-black px-8">
          Log in with your username and password
        </p>
      </header>

      <main className="px-[40px]">
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-6"
          noValidate
          aria-label="Login form"
        >
          <InputField
            label="Email"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            {...register('email')}
            error={errors.email?.message}
          />

          <InputField
            label="Username"
            type="text"
            placeholder="Enter your username"
            autoComplete="username"
            {...register('username')}
            error={errors.username?.message}
          />

          <InputField
            label="Password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            {...register('password')}
            error={errors.password?.message}
          />

          <div className="flex justify-center pt-4">
            <LoginButton isLoading={isLoading}>
              LOGIN
            </LoginButton>
          </div>
        </form>
      </main>
    </section>
  );
};

export default LoginForm;
