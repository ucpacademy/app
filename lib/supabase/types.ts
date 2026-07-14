/* eslint-disable @typescript-eslint/no-empty-object-type */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.5';
  };
  public: {
    Tables: {
      branch_translations: {
        Row: {
          benefits: string | null;
          faqs: Json | null;
          branch_id: string | null;
          id: string;
          lang: string;
          title: string;
        };
        Insert: {
          benefits?: string | null;
          faqs?: Json | null;
          branch_id?: string | null;
          id?: string;
          lang: string;
          title: string;
        };
        Update: {
          benefits?: string | null;
          faqs?: Json | null;
          branch_id?: string | null;
          id?: string;
          lang?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'branch_translations_branch_id_fkey';
            columns: ['branch_id'];
            isOneToOne: false;
            referencedRelation: 'branches';
            referencedColumns: ['id'];
          },
        ];
      };
      branches: {
        Row: {
          created_at: string | null;
          id: string;
          featured_image: string | null;
          gallery: string[] | null;
          major_id: string | null;
          slug: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          featured_image?: string | null;
          gallery?: string[] | null;
          major_id?: string | null;
          slug: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          featured_image?: string | null;
          gallery?: string[] | null;
          major_id?: string | null;
          slug?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'branches_major_id_fkey';
            columns: ['major_id'];
            isOneToOne: false;
            referencedRelation: 'majors';
            referencedColumns: ['id'];
          },
        ];
      };
      courses: {
        Row: {
          id: string;
          program_id: string;
          title_fr: string;
          title_ar: string;
          description_fr: string | null;
          description_ar: string | null;
          instructor_id: string | null;
          credits: number | null;
          hours: number | null;
          order_index: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          program_id: string;
          title_fr: string;
          title_ar: string;
          description_fr?: string | null;
          description_ar?: string | null;
          instructor_id?: string | null;
          credits?: number | null;
          hours?: number | null;
          order_index?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          program_id?: string;
          title_fr?: string;
          title_ar?: string;
          description_fr?: string | null;
          description_ar?: string | null;
          instructor_id?: string | null;
          credits?: number | null;
          hours?: number | null;
          order_index?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'courses_instructor_id_fkey';
            columns: ['instructor_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'courses_program_id_fkey';
            columns: ['program_id'];
            isOneToOne: false;
            referencedRelation: 'programs';
            referencedColumns: ['id'];
          },
        ];
      };
      course_modules: {
        Row: {
          id: string;
          course_id: string;
          title_fr: string;
          title_ar: string;
          description_fr: string | null;
          description_ar: string | null;
          order_index: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          course_id: string;
          title_fr: string;
          title_ar: string;
          description_fr?: string | null;
          description_ar?: string | null;
          order_index?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          course_id?: string;
          title_fr?: string;
          title_ar?: string;
          description_fr?: string | null;
          description_ar?: string | null;
          order_index?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'course_modules_course_id_fkey';
            columns: ['course_id'];
            isOneToOne: false;
            referencedRelation: 'courses';
            referencedColumns: ['id'];
          },
        ];
      };
      enrollments: {
        Row: {
          id: string;
          user_id: string;
          program_id: string;
          enrollment_date: string | null;
          status: string | null;
          progress_percent: number | null;
          certificate_url: string | null;
          completion_date: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          program_id: string;
          enrollment_date?: string | null;
          status?: string | null;
          progress_percent?: number | null;
          certificate_url?: string | null;
          completion_date?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          program_id?: string;
          enrollment_date?: string | null;
          status?: string | null;
          progress_percent?: number | null;
          certificate_url?: string | null;
          completion_date?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'enrollments_program_id_fkey';
            columns: ['program_id'];
            isOneToOne: false;
            referencedRelation: 'programs';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'enrollments_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      institution_memberships: {
        Row: {
          id: string;
          institution_id: string;
          user_id: string;
          role: string | null;
          joined_at: string | null;
        };
        Insert: {
          id?: string;
          institution_id: string;
          user_id: string;
          role?: string | null;
          joined_at?: string | null;
        };
        Update: {
          id?: string;
          institution_id?: string;
          user_id?: string;
          role?: string | null;
          joined_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'institution_memberships_institution_id_fkey';
            columns: ['institution_id'];
            isOneToOne: false;
            referencedRelation: 'institutions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'institution_memberships_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      institutions: {
        Row: {
          id: string;
          slug: string;
          name_fr: string;
          name_ar: string;
          description_fr: string | null;
          description_ar: string | null;
          website: string | null;
          logo_url: string | null;
          location_fr: string | null;
          location_ar: string | null;
          contact_email: string | null;
          featured: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          name_fr: string;
          name_ar: string;
          description_fr?: string | null;
          description_ar?: string | null;
          website?: string | null;
          logo_url?: string | null;
          location_fr?: string | null;
          location_ar?: string | null;
          contact_email?: string | null;
          featured?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          name_fr?: string;
          name_ar?: string;
          description_fr?: string | null;
          description_ar?: string | null;
          website?: string | null;
          logo_url?: string | null;
          location_fr?: string | null;
          location_ar?: string | null;
          contact_email?: string | null;
          featured?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      lessons: {
        Row: {
          id: string;
          created_at: string;
          course_id: string;
          module_id: string | null;
          title: string;
          content: string | null;
          video_url: string | null;
          order: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          course_id: string;
          module_id?: string | null;
          title: string;
          content?: string | null;
          video_url?: string | null;
          order?: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          course_id?: string;
          module_id?: string | null;
          title?: string;
          content?: string | null;
          video_url?: string | null;
          order?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'lessons_course_id_fkey';
            columns: ['course_id'];
            isOneToOne: false;
            referencedRelation: 'courses';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'lessons_module_id_fkey';
            columns: ['module_id'];
            isOneToOne: false;
            referencedRelation: 'course_modules';
            referencedColumns: ['id'];
          },
        ];
      };
      lesson_progress: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          lesson_id: string;
          completed: boolean;
          updated_at: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          lesson_id: string;
          completed?: boolean;
          updated_at?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          lesson_id?: string;
          completed?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'lesson_progress_lesson_id_fkey';
            columns: ['lesson_id'];
            isOneToOne: false;
            referencedRelation: 'lessons';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'lesson_progress_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      major_translations: {
        Row: {
          id: string;
          lang: string;
          major_id: string | null;
          name: string;
        };
        Insert: {
          id?: string;
          lang: string;
          major_id?: string | null;
          name: string;
        };
        Update: {
          id?: string;
          lang?: string;
          major_id?: string | null;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'major_translations_major_id_fkey';
            columns: ['major_id'];
            isOneToOne: false;
            referencedRelation: 'majors';
            referencedColumns: ['id'];
          },
        ];
      };
      majors: {
        Row: {
          created_at: string | null;
          id: string;
          slug: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          slug: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          slug?: string;
        };
        Relationships: [];
      };
      inquiries: {
        Row: {
          id: string;
          branch_id: string | null;
          user_id: string | null;
          name: string;
          email: string;
          phone: string | null;
          message: string;
          status: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          branch_id?: string | null;
          user_id?: string | null;
          name: string;
          email: string;
          phone?: string | null;
          message: string;
          status?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          branch_id?: string | null;
          user_id?: string | null;
          name?: string;
          email?: string;
          phone?: string | null;
          message?: string;
          status?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'inquiries_branch_id_fkey';
            columns: ['branch_id'];
            isOneToOne: false;
            referencedRelation: 'branches';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'inquiries_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          id: string;
          roles: string[] | null;
          full_name: string | null;
          email: string | null;
          avatar_url: string | null;
          bio: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          roles?: string[] | null;
          full_name?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          roles?: string[] | null;
          full_name?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      program_announcements: {
        Row: {
          id: string;
          created_at: string;
          program_id: string;
          author_id: string;
          title: string;
          content: string;
          edited_at: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          program_id: string;
          author_id: string;
          title: string;
          content: string;
          edited_at?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          program_id?: string;
          author_id?: string;
          title?: string;
          content?: string;
          edited_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'program_announcements_author_id_fkey';
            columns: ['author_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'program_announcements_program_id_fkey';
            columns: ['program_id'];
            isOneToOne: false;
            referencedRelation: 'programs';
            referencedColumns: ['id'];
          },
        ];
      };
      program_posts: {
        Row: {
          id: string;
          created_at: string;
          program_id: string;
          author_id: string;
          parent_post_id: string | null;
          content: string;
          edited_at: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          program_id: string;
          author_id: string;
          parent_post_id?: string | null;
          content: string;
          edited_at?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          program_id?: string;
          author_id?: string;
          parent_post_id?: string | null;
          content?: string;
          edited_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'program_posts_author_id_fkey';
            columns: ['author_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'program_posts_parent_post_id_fkey';
            columns: ['parent_post_id'];
            isOneToOne: false;
            referencedRelation: 'program_posts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'program_posts_program_id_fkey';
            columns: ['program_id'];
            isOneToOne: false;
            referencedRelation: 'programs';
            referencedColumns: ['id'];
          },
        ];
      };
      programs: {
        Row: {
          id: string;
          branch_id: string;
          institution_id: string | null;
          instructor_id: string | null;
          title_fr: string;
          title_ar: string;
          description_fr: string | null;
          description_ar: string | null;
          duration_months: number | null;
          capacity: number | null;
          price_usd: number | null;
          price_mad: number | null;
          start_date: string | null;
          end_date: string | null;
          status: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          branch_id: string;
          institution_id?: string | null;
          instructor_id?: string | null;
          title_fr: string;
          title_ar: string;
          description_fr?: string | null;
          description_ar?: string | null;
          duration_months?: number | null;
          capacity?: number | null;
          price_usd?: number | null;
          price_mad?: number | null;
          start_date?: string | null;
          end_date?: string | null;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          branch_id?: string;
          institution_id?: string | null;
          instructor_id?: string | null;
          title_fr?: string;
          title_ar?: string;
          description_fr?: string | null;
          description_ar?: string | null;
          duration_months?: number | null;
          capacity?: number | null;
          price_usd?: number | null;
          price_mad?: number | null;
          start_date?: string | null;
          end_date?: string | null;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'programs_branch_id_fkey';
            columns: ['branch_id'];
            isOneToOne: false;
            referencedRelation: 'branches';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'programs_institution_id_fkey';
            columns: ['institution_id'];
            isOneToOne: false;
            referencedRelation: 'institutions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'programs_instructor_id_fkey';
            columns: ['instructor_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      role_requests: {
        Row: {
          id: string;
          user_id: string;
          requested_role: string;
          status: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          requested_role: string;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          requested_role?: string;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'role_requests_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      add_branch: {
        Args: {
          p_major_id: string;
          p_slug: string;
          p_title_ar: string;
          p_title_fr: string;
        };
        Returns: string;
      };
      add_major: {
        Args: { p_name_ar: string; p_name_fr: string; p_slug: string };
        Returns: string;
      };
      is_enrolled: {
        Args: {
          program_id_to_check: string;
        };
        Returns: boolean;
      };
      is_program_owner: {
        Args: { program_id_to_check: string };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
