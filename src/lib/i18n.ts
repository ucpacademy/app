import {
  getDictionary,
  type Lang,
  type Dictionary,
  languages,
} from '@/utils/dictionary';

export type { Lang, Dictionary };
export { getDictionary, languages };

// Compatibility shim for existing imports of '@/lib/i18n'
