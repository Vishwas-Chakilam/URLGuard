import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, continueAsGuest } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const success = await login(data.email, data.password);
    if (success) {
      navigate('/analyze');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 p-8 bg-white/80 dark:bg-slate-900/60 backdrop-blur"
    >
      <p className="uppercase text-xs tracking-[0.4em] text-slate-500 text-center mb-2">URL Guard</p>
      <h1 className="text-3xl font-semibold text-center mb-6">Welcome back</h1>
      <p className="text-center text-sm text-slate-500 mb-8">
        Supabase auth keeps your profile, history, reports, and quiz progress in sync.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-600 dark:text-slate-200">Email</label>
          <input
            type="email"
            {...register('email')}
            className="mt-1 w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600 dark:text-slate-200">Password</label>
          <input
            type="password"
            {...register('password')}
            className="mt-1 w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="••••••••"
          />
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          <div className="mt-2 text-right">
            <Link to="/forgot-password" className="text-xs text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-medium disabled:opacity-60"
        >
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <div className="mt-6 flex flex-col gap-3">
        <button
          type="button"
          className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 text-sm"
          onClick={() => {
            continueAsGuest();
            navigate('/analyze');
          }}
        >
          Continue as guest
        </button>
        <p className="text-sm text-center text-slate-500">
          Need an account?{' '}
          <Link to="/signup" className="text-blue-600">
            Create one
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
