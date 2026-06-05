export type Lang = 'fr' | 'ar';

export type Dictionary = {
  title: string;
  description: string;
  welcome: string;
  learn_more: string;
  sign_up: string;
  home_cta: string;
  admin_title: string;
  student_title: string;
  majors_title: string;
};

export const languages: Lang[] = ['fr', 'ar'];

const dictionaries: Record<Lang, Dictionary> = {
  fr: {
    title: 'Portail My Majors',
    description:
      'Explorez des majeures et des branches en français et en arabe',
    welcome: 'Bienvenue sur My Majors App',
    learn_more: 'En savoir plus',
    sign_up: "S'inscrire",
    home_cta:
      'Parcourez nos spécialisations ou connectez-vous pour accéder au tableau de bord.',
    admin_title: 'Tableau de bord Administrateur',
    student_title: 'Espace Étudiant',
    majors_title: 'Nos Filières',
  },
  ar: {
    title: 'بوابة My Majors',
    description: 'استكشف التخصصات والفروع بالفرنسية والعربية',
    welcome: 'مرحبًا بك في My Majors App',
    learn_more: 'تعرف على المزيد',
    sign_up: 'سجل الآن',
    home_cta: 'استعرض تخصصاتنا أو سجّل الدخول للوصول إلى لوحة التحكم.',
    admin_title: 'لوحة تحكم المسؤول',
    student_title: 'مساحة الطالب',
    majors_title: 'تخصصاتنا',
  },
};

export async function getDictionary(lang: Lang): Promise<Dictionary> {
  return dictionaries[lang] ?? dictionaries.fr;
}
