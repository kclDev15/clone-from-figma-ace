import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { InputField } from '@/components/ui/input-field';
import { LoginButton } from '@/components/ui/login-button';
import { toast } from 'sonner';

const registerSchema = z.object({
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
  confirmPassword: z
    .string()
    .min(6, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSubmit?: (data: Omit<RegisterFormData, 'confirmPassword'>) => void | Promise<void>;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });

  const handleFormSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      if (onSubmit) {
        const { confirmPassword, ...submitData } = data;
        await onSubmit(submitData);
      } else {
        // Default behavior - simulate registration
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success('Registration successful!', {
          description: `Welcome, ${data.username}! Please proceed to login.`,
        });
        reset();
      }
    } catch (error) {
      toast.error('Registration failed', {
        description: 'Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-white border border-black border-solid w-full max-w-[420px] min-h-[500px] relative">
      <header className="text-center pt-[57px] pb-6">
        <h1 className="text-2xl font-medium text-black mb-4">
          ¡Register!
        </h1>
        <p className="text-[13px] font-medium text-black px-8">
          Create your account to get started
        </p>
      </header>

      <main className="px-[40px] pb-[40px]">
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-6"
          noValidate
          aria-label="Registration form"
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
            autoComplete="new-password"
            {...register('password')}
            error={errors.password?.message}
          />

          <InputField
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            autoComplete="new-password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          <div className="flex justify-center pt-4">
            <LoginButton isLoading={isLoading}>
              REGISTER
            </LoginButton>
          </div>
        </form>
      </main>
    </section>
  );
};

export default RegisterForm;