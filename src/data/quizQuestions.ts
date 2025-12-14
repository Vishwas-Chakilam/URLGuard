export type QuizQuestion = {
  id: string;
  question: string;
  choices: [string, string, string, string];
  correctIndex: number;
  explanation: string;
};

/**
 * Seed quiz questions. Expand to 30-40 entries for full production usage.
 */
export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Which protocol is generally safer for sensitive data transmission?',
    choices: ['HTTP', 'FTP', 'HTTPS', 'SMTP'],
    correctIndex: 2,
    explanation: 'HTTPS encrypts traffic end-to-end, preventing eavesdropping.',
  },
  {
    id: 'q2',
    question: 'A phishing site often tries to:',
    choices: [
      'Improve your browser performance',
      'Steal personal information',
      'Provide free antivirus software',
      'Benchmark your internet speed',
    ],
    correctIndex: 1,
    explanation: 'Phishing aims to trick users into sharing credentials or data.',
  },
  {
    id: 'q3',
    question: 'What is the safest action when an email urges urgent password reset?',
    choices: [
      'Click the link immediately',
      'Ignore, without checking anything',
      'Visit the official site manually',
      'Reply requesting clarification',
    ],
    correctIndex: 2,
    explanation: 'Always navigate directly to the known site to confirm the request.',
  },
  {
    id: 'q4',
    question: 'A long, random-looking URL path can indicate:',
    choices: [
      'A well-optimized SEO page',
      'A potential obfuscation attempt',
      'A CDN cache miss',
      'A paid advertising link',
    ],
    correctIndex: 1,
    explanation: 'Attackers often obfuscate malicious parameters using long strings.',
  },
  {
    id: 'q5',
    question: 'Which sign suggests a fake login page?',
    choices: [
      'Perfect spelling and grammar',
      'URL with company name plus random numbers',
      'Use of HTTPS certificate',
      'Presence of a favicon',
    ],
    correctIndex: 1,
    explanation: 'Attackers spoof domains by appending numbers or unusual TLDs.',
  },
  {
    id: 'q6',
    question: 'Why is reporting malicious URLs valuable?',
    choices: [
      'It speeds up your browser',
      'It awards system admin badges',
      'It helps defenders protect others',
      'It blocks ads on websites',
    ],
    correctIndex: 2,
    explanation: 'Reports feed threat intel pipelines that protect the community.',
  },
  {
    id: 'q7',
    question: 'Browser padlock icon indicates:',
    choices: [
      'Site is verified as safe',
      'Connection is encrypted',
      'No malware present',
      'Site is government owned',
    ],
    correctIndex: 1,
    explanation: 'Padlock only confirms encryption, not overall trustworthiness.',
  },
  {
    id: 'q8',
    question: 'What is “defacement” attack?',
    choices: [
      'Injecting ransomware into backups',
      'Replacing website visuals/content',
      'Phishing for banking details',
      'Silently mining cryptocurrency',
    ],
    correctIndex: 1,
    explanation: 'Defacement alters visible content to spread propaganda or warnings.',
  },
  {
    id: 'q9',
    question: 'Strong passwords should contain:',
    choices: [
      'Only lowercase letters',
      'Personal data like birthdays',
      'Mix of cases, numbers, symbols',
      'Dictionary words only',
    ],
    correctIndex: 2,
    explanation: 'Complexity thwarts brute-force and credential stuffing attacks.',
  },
  {
    id: 'q10',
    question: 'What should you verify before entering credentials?',
    choices: [
      'Website font selection',
      'Presence of video background',
      'URL/domain accuracy',
      'Amount of site traffic',
    ],
    correctIndex: 2,
    explanation: 'Always double-check the domain to avoid credential theft.',
  },
  {
    id: 'q11',
    question: '"Too good to be true" offers often signal:',
    choices: [
      'Government subsidy programs',
      'Security patches',
      'Social engineering attempts',
      'Free SSL certificates',
    ],
    correctIndex: 2,
    explanation: 'Attackers lure victims with unrealistic offers requiring quick action.',
  },
  {
    id: 'q12',
    question: 'URL shorteners can be abused because they:',
    choices: [
      'Break encryption',
      'Hide the true destination',
      'Disable firewalls',
      'Bypass user authentication',
    ],
    correctIndex: 1,
    explanation: 'Short URLs mask the final domain, making vetting harder.',
  },
];

