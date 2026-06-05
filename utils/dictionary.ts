export type Lang = 'fr' | 'ar';

export type Dictionary = {
  welcome: string;
  learn_more: string;
  sign_up: string;
  auth_form: {
    sending: string;
    link_sent: string;
    verifying: string;
    login_success: string;
    email_placeholder: string;
    send_link_button: string;
  };
  admin_forms: {
    major_added: string;
    branch_added: string;
    add_major_title: string;
    major_slug: string;
    major_name_fr: string;
    major_name_ar: string;
    save_major: string;
    add_branch_title: string;
    branch_major_id: string;
    branch_slug: string;
    branch_title_fr: string;
    branch_title_ar: string;
    save_branch: string;
  };
  navbar: {
    home: string;
    dashboard: string;
    logout: string;
    explore_majors: string;
    login: string;
    signup: string;
  };
};

const dictionaries: Record<Lang, Dictionary> = {
  fr: {
    welcome: 'Bienvenue sur My Majors App',
    learn_more: 'En savoir plus',
    sign_up: "S'inscrire",
    auth_form: {
      sending: 'Envoi en cours...',
      link_sent: 'Vérifiez votre e-mail pour le lien de connexion !',
      verifying: 'Vérification...',
      login_success: 'Connexion réussie !',
      email_placeholder: 'Email',
      send_link_button: 'Envoyer le lien de connexion',
    },
    admin_forms: {
      major_added: 'Filière ajoutée !',
      branch_added: 'Branche ajoutée !',
      add_major_title: '1. Ajouter une Filière (Major)',
      major_slug: 'Slug (ex: sante-ts)',
      major_name_fr: 'Nom (Français)',
      major_name_ar: 'Nom (Arabe)',
      save_major: 'Sauvegarder la filière',
      add_branch_title: '2. Ajouter une Branche',
      branch_major_id: 'ID de la Filière (Major UUID)',
      branch_slug: 'Slug (ex: sage-femme-ts)',
      branch_title_fr: 'Titre (Français)',
      branch_title_ar: 'Titre (Arabe)',
      save_branch: 'Sauvegarder la branche',
    },
    navbar: {
      home: 'Accueil',
      dashboard: 'Tableau de bord',
      logout: 'Se déconnecter',
      explore_majors: 'Explorer les filières',
      login: 'Se connecter',
      signup: "S'inscrire",
    },
  },
  ar: {
    welcome: 'مرحبًا بك في My Majors App',
    learn_more: 'تعرف على المزيد',
    sign_up: 'سجل الآن',
    auth_form: {
      sending: 'جاري الإرسال...',
      link_sent: 'تحقق من بريدك الإلكتروني للحصول على رابط تسجيل الدخول!',
      verifying: 'جاري التحقق...',
      login_success: 'تم تسجيل الدخول بنجاح!',
      email_placeholder: 'البريد الإلكتروني',
      send_link_button: 'إرسال رابط تسجيل الدخول',
    },
    admin_forms: {
      major_added: 'تمت إضافة التخصص!',
      branch_added: 'تمت إضافة الفرع!',
      add_major_title: '1. إضافة تخصص',
      major_slug: 'Slug (ex: sante-ts)',
      major_name_fr: 'Nom (Français)',
      major_name_ar: 'Nom (Arabe)',
      save_major: 'حفظ التخصص',
      add_branch_title: '2. إضافة فرع',
      branch_major_id: 'ID de la Filière (Major UUID)',
      branch_slug: 'Slug (ex: sage-femme-ts)',
      branch_title_fr: 'Titre (Français)',
      branch_title_ar: 'Titre (Arabe)',
      save_branch: 'حفظ الفرع',
    },
    navbar: {
      home: 'الرئيسية',
      dashboard: 'لوحة القيادة',
      logout: 'تسجيل الخروج',
      explore_majors: 'استكشاف التخصصات',
      login: 'تسجيل الدخول',
      signup: 'سجل الآن',
    },
  },
};

export async function getDictionary(lang: Lang): Promise<Dictionary> {
  return dictionaries[lang] ?? dictionaries.fr;
}
