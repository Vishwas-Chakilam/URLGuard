import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const schema = z
  .object({
    displayName: z.string().min(2, 'Add your name'),
    username: z.string().min(3, 'Min 3 characters').optional(),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val, 'You must accept the terms'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

export default function SignupForm() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { acceptTerms: true },
  });

  const onSubmit = async (data: FormValues) => {
    const success = await signup({
      email: data.email,
      password: data.password,
      username: data.username,
      displayName: data.displayName,
      acceptTerms: data.acceptTerms,
    });
    if (success) {
      navigate('/login');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 p-8 bg-white/80 dark:bg-slate-900/60 backdrop-blur"
    >
      <p className="uppercase text-xs tracking-[0.4em] text-slate-500 text-center mb-2">URL Guard</p>
      <h1 className="text-3xl font-semibold text-center mb-6">Create an account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-600 dark:text-slate-200">Display name</label>
          <input
            type="text"
            {...register('displayName')}
            className="mt-1 w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Vishwas"
          />
          {errors.displayName && <p className="text-xs text-red-500 mt-1">{errors.displayName.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600 dark:text-slate-200">Username (optional)</label>
          <input
            type="text"
            {...register('username')}
            className="mt-1 w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="urlguard_pro"
          />
          {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>}
        </div>
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
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600 dark:text-slate-200">Confirm password</label>
          <input
            type="password"
            {...register('confirmPassword')}
            className="mt-1 w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="••••••••"
          />
          {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-500">
          <input type="checkbox" {...register('acceptTerms')} className="rounded border-slate-300" />
          I agree to the{' '}
          <Link to="/terms" className="text-blue-600">
            terms
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-blue-600">
            privacy notice
          </Link>
        </label>
        {errors.acceptTerms && <p className="text-xs text-red-500">{errors.acceptTerms.message}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-medium disabled:opacity-60"
        >
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p className="text-sm text-center text-slate-500 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
