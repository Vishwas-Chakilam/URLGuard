import { useState } from 'react';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';

const env = import.meta.env as Record<string, string | undefined>;
const emailConfig = {
  service: env.VITE_EMAILJS_SERVICE_ID ?? env.EMAILJS_SERVICEID,
  template: env.VITE_EMAILJS_TEMPLATE_ID ?? env.EMAILJS_TEMPLATEID,
  publicKey: env.VITE_EMAILJS_PUBLIC_KEY ?? env.EMAILJS_USERID,
};

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSending(true);
    if (emailConfig.service && emailConfig.template && emailConfig.publicKey) {
      try {
        await emailjs.send(
          emailConfig.service,
          emailConfig.template,
          { ...form },
          { publicKey: emailConfig.publicKey }
        );
        toast.success('Message sent — we will reply via email.');
      } catch {
        toast.error('Email service failed. Double-check EmailJS keys.');
      }
    } else {
      toast('EmailJS keys missing — message logged locally.');
    }

    if (supabase) {
      await supabase.from('contacts').insert(form);
    }
    setForm({ name: '', email: '', subject: '', message: '' });
    setSending(false);
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <section className="space-y-4">
        <p className="uppercase text-xs tracking-[0.4em] text-slate-500">Contact</p>
        <h1 className="text-4xl font-semibold">Let's talk about URL Guard</h1>
        <p className="text-slate-500">
          Need to review the project, request enhancements, or plug in your real ML model? Drop a note and I’ll respond
          within 24 hours.
        </p>
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 p-6 bg-white/80 dark:bg-slate-900/50 shadow-sm hover:shadow-xl transition-all duration-300">
          {/* Background gradient accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/30 to-purple-500/30 blur-3xl opacity-40 pointer-events-none"></div>

          {/* Optional avatar */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
              V
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">Developer</p>
              <p className="text-xl font-semibold text-slate-900 dark:text-white">
                Vishwas — Full Stack Developer
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-4 h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700"></div>

          {/* Social Links */}
          <div className="mt-4 space-y-2 text-sm">
            <a
              href="https://www.linkedin.com/in/vishwas-chakilam"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" 
                fill="currentColor" 
                viewBox="0 0 16 16" 
                className="w-4 h-4">
                <path d="M1.146 1.146C1.538.754 2.07.5 2.732.5c.66 0 1.192.254 1.584.646C4.708 1.538 4.962 2.07 4.962 2.732c0 .66-.254 1.192-.646 1.584-.392.392-.923.646-1.584.646-.66 0-1.192-.254-1.584-.646C.754 3.924.5 3.392.5 2.732c0-.66.254-1.192.646-1.584zM.84 5.84H4.62V15.5H.84V5.84zm7.32 0h3.48v1.32h.05c.48-.9 1.66-1.86 3.42-1.86 3.66 0 4.34 2.41 4.34 5.55v6.65h-3.78v-5.9c0-1.41-.03-3.22-1.96-3.22-1.96 0-2.26 1.53-2.26 3.11v6.01H8.16V5.84z"/>
              </svg>
              LinkedIn
            </a>

            <a
              href="https://github.com/vishwas-chakilam"
              className="flex items-center gap-2 text-slate-900 dark:text-slate-200  hover:text-slate-700 dark:hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" 
                fill="currentColor" 
                viewBox="0 0 16 16" 
                className="w-4 h-4">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 
                0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 
                1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 
                0-.87.31-1.59.82-2.15-.08-.2-.36-1.01.08-2.11 0 0 .67-.21 2.2.82.64-.18 
                1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 
                2.2-.82.44 1.1.16 1.91.08 2.11.51.56.82 1.27.82 
                2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 
                1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 
                8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>

      </section>

      <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 dark:border-slate-800 p-6 bg-white/90 dark:bg-slate-900/40 space-y-4">
        <label className="text-sm">
          Name
          <input
            className="mt-1 w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </label>
        <label className="text-sm">
          Email
          <input
            type="email"
            className="mt-1 w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
        </label>
        <label className="text-sm">
          Subject
          <input
            className="mt-1 w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70"
            value={form.subject}
            onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
          />
        </label>
        <label className="text-sm">
          Message
          <textarea
            className="mt-1 w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70"
            rows={5}
            value={form.message}
            onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
            required
          />
        </label>
        <button
          type="submit"
          disabled={sending}
          className="w-full px-4 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 disabled:opacity-60"
        >
          {sending ? 'Sending…' : 'Send message'}
        </button>
      </form>
    </div>
  );
}

