'use client';

import { motion } from 'framer-motion';

function getPasswordStrength(password) {
  let score = 0;
  if (!password) return { score: 0, label: '', color: '' };

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500', textColor: 'text-red-500' };
  if (score <= 2) return { score: 2, label: 'Fair', color: 'bg-orange-400', textColor: 'text-orange-500' };
  if (score <= 3) return { score: 3, label: 'Good', color: 'bg-yellow-400', textColor: 'text-yellow-600' };
  if (score <= 4) return { score: 4, label: 'Strong', color: 'bg-green-500', textColor: 'text-green-600' };
  return { score: 5, label: 'Very Strong', color: 'bg-emerald-600', textColor: 'text-emerald-600' };
}

export default function PasswordStrength({ password }) {
  const strength = getPasswordStrength(password);
  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div key={level} className="h-1 flex-1 bg-zinc-100 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: strength.score >= level ? '100%' : '0%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`h-full ${strength.score >= level ? strength.color : ''}`}
            />
          </div>
        ))}
      </div>
      <p className={`ty-micro font-medium ${strength.textColor}`}>
        {strength.label}
      </p>
    </div>
  );
}

export function PasswordRequirements({ password }) {
  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(password) },
    { label: 'Contains a number', met: /\d/.test(password) },
    { label: 'Contains a special character', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
  ];

  if (!password) return null;

  return (
    <ul className="mt-2 space-y-1">
      {requirements.map((req) => (
        <li key={req.label} className={`ty-micro flex items-center gap-1.5 transition-colors ${req.met ? 'text-green-600' : 'text-zinc-400'}`}>
          <span className={`w-1 h-1 rounded-full ${req.met ? 'bg-green-600' : 'bg-zinc-300'}`} />
          {req.label}
        </li>
      ))}
    </ul>
  );
}
