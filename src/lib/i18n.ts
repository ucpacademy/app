import { getDictionary, type Lang, type Dictionary } from '@/utils/dictionary';

const languages = ['en', 'fr', 'ar'] as const;

export type { Lang, Dictionary };
export { getDictionary, languages };

// Compatibility shim for existing imports of '@/lib/i18n'
