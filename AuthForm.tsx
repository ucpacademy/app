'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { usePathname } from 'next/navigation';
import type { Dictionary } from '@/utils/dictionary';

export function AuthForm({
  dictionary,
}: {
  dictionary: Dictionary['auth_form'];
}) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const supabase = createClient();
  const pathname = usePathname();
  const lang = pathname.split('/')[1];

  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(dictionary.sending);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        // Redirect the user to the student dashboard after they click the link
        emailRedirectTo: `${window.location.origin}/${lang}/student`,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setSubmitted(true);
      setMessage(dictionary.link_sent);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '300px',
      }}
    >
      <p>{message}</p>
      {!submitted && (
        <form
          onSubmit={handleMagicLinkSignIn}
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <input
            type="email"
            placeholder={dictionary.email_placeholder}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitted}
          />
          <button type="submit" disabled={submitted}>
            {dictionary.send_link_button}
          </button>
        </form>
      )}
    </div>
  );
}
