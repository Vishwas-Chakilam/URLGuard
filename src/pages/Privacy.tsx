export default function Privacy() {
  const sections = [
    {
      title: 'Data we store',
      items: [
        'Supabase auth user id, email, and optional profile metadata (username, avatar).',
        'Analysis metadata: url, domain, predicted label, metrics, timestamps.',
        'Reports and quiz results when you choose to save them.',
      ],
    },
    {
      title: 'Data we do not store',
      items: [
        'Passwords — handled entirely by Supabase Auth.',
        'Model inputs for longer than required to persist results.',
        'Any payment or sensitive personal data.',
      ],
    },
    {
      title: 'Your controls',
      items: [
        'Delete individual history entries (deducts the awarded points).',
        'Request complete account deletion via the Profile privacy controls.',
        'Export data straight from Supabase using SQL queries provided in the README.',
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="uppercase text-xs tracking-[0.4em] text-slate-500">Privacy</p>
        <h1 className="text-3xl font-semibold">Privacy Notice</h1>
        <p className="text-slate-500">
          URL Guard is an academic project. All persistence flows through Supabase, so you can audit and delete data at
          any time.
        </p>
      </div>
      {sections.map((section) => (
        <div key={section.title} className="rounded-3xl border border-slate-200 dark:border-slate-800 p-6 bg-white/80 dark:bg-slate-900/40">
          <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {section.items.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      ))}
      <p className="text-sm text-slate-500">
        Questions? Contact the developer via the Contact page or email once EmailJS keys are configured.
      </p>
    </div>
  );
}

