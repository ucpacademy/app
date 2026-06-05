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
      user_roles: {
        Row: {
          role: string | null;
          user_id: string;
        };
        Insert: {
          role?: string | null;
          user_id: string;
        };
        Update: {
          role?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          created_at: string;
          full_name: string | null;
          id: string;
          role: string;
        };
        Insert: {
          created_at?: string;
          full_name?: string | null;
          id: string;
          role?: string;
        };
        Update: {
          created_at?: string;
          full_name?: string | null;
          id?: string;
          role?: string;
        };
        Relationships: [];
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
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
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
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
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
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
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
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
