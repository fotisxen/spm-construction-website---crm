// Hand-written to match supabase/migrations/0001_init.sql.
// Once a real Supabase project exists, prefer regenerating with:
//   npx supabase gen types typescript --project-id <id> > src/lib/types/database.ts

export type AcquisitionType = "flip" | "client_owned";
export type ProjectStatus = "planning" | "in_progress" | "completed";
export type ScopeSize = "full" | "partial";
export type ContactCategory =
  | "υδραυλικός"
  | "ηλεκτρολόγος"
  | "γκρεμίσματα"
  | "κουφώματα"
  | "πλακάκια"
  | "προμηθευτής"
  | "είδη_υγιεινής"
  | "γυψοσανίδας"
  | "μπετατζής"
  | "κουζίνα"
  | "βαψίματα"
  | "καθαρισμός"
  | "μεσίτης"
  | "λογιστής"
  | "άλλο";
export type PaymentType = "lump_sum" | "installments";
export type PaymentStatus = "pending" | "partial" | "paid";
export type InstallmentStatus = "pending" | "paid";
export type ExpenseCategory =
  | "ενοίκιο_γραφείου"
  | "ασφάλεια"
  | "λογιστής"
  | "μεσιτικά"
  | "υλικά"
  | "άλλο";
export type IncomeCategory =
  | "πώληση_ακινήτου"
  | "έκδοση_σύνδεση_λογαριασμών"
  | "ενοίκιο"
  | "άλλο";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: "admin";
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      properties: {
        Row: {
          id: string;
          name: string;
          address: string;
          power_supply_number: string | null;
          water_supply_number: string | null;
          sqm: number | null;
          map_url: string | null;
          acquisition_type: AcquisitionType;
          notes: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["properties"]["Row"]> & {
          name: string;
          address: string;
        };
        Update: Partial<Database["public"]["Tables"]["properties"]["Row"]>;
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          property_id: string;
          title: string;
          scope_description: string | null;
          project_type: AcquisitionType;
          scope_size: ScopeSize;
          budget: number;
          start_date: string | null;
          end_date_planned: string | null;
          end_date_actual: string | null;
          status: ProjectStatus;
          show_on_website: boolean;
          public_summary: string | null;
          cover_image_url: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["projects"]["Row"]> & {
          property_id: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Row"]>;
        Relationships: [];
      };
      project_phases: {
        Row: {
          id: string;
          project_id: string;
          phase_number: 1 | 2 | 3;
          name: string;
          planned_start: string | null;
          planned_end: string | null;
          actual_start: string | null;
          actual_end: string | null;
          notes: string | null;
        };
        Insert: Partial<
          Database["public"]["Tables"]["project_phases"]["Row"]
        > & {
          project_id: string;
          phase_number: 1 | 2 | 3;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["project_phases"]["Row"]>;
        Relationships: [];
      };
      contacts: {
        Row: {
          id: string;
          name: string;
          category: ContactCategory;
          phone: string | null;
          email: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["contacts"]["Row"]> & {
          name: string;
          category: ContactCategory;
        };
        Update: Partial<Database["public"]["Tables"]["contacts"]["Row"]>;
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          project_id: string;
          contact_id: string | null;
          category: string;
          total_amount: number;
          payment_type: PaymentType;
          date_agreed: string | null;
          status: PaymentStatus;
          notes: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["payments"]["Row"]> & {
          project_id: string;
          category: string;
        };
        Update: Partial<Database["public"]["Tables"]["payments"]["Row"]>;
        Relationships: [];
      };
      payment_installments: {
        Row: {
          id: string;
          payment_id: string;
          installment_number: number;
          amount: number;
          due_date: string | null;
          paid_date: string | null;
          status: InstallmentStatus;
        };
        Insert: Partial<
          Database["public"]["Tables"]["payment_installments"]["Row"]
        > & {
          payment_id: string;
          installment_number: number;
          amount: number;
        };
        Update: Partial<
          Database["public"]["Tables"]["payment_installments"]["Row"]
        >;
        Relationships: [];
      };
      expenses: {
        Row: {
          id: string;
          project_id: string | null;
          category: ExpenseCategory;
          amount: number;
          date: string;
          notes: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["expenses"]["Row"]> & {
          category: ExpenseCategory;
          amount: number;
        };
        Update: Partial<Database["public"]["Tables"]["expenses"]["Row"]>;
        Relationships: [];
      };
      income: {
        Row: {
          id: string;
          project_id: string | null;
          category: IncomeCategory;
          amount: number;
          date: string;
          notes: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["income"]["Row"]> & {
          category: IncomeCategory;
          amount: number;
        };
        Update: Partial<Database["public"]["Tables"]["income"]["Row"]>;
        Relationships: [];
      };
      supply_quantities: {
        Row: {
          id: string;
          project_id: string;
          contact_id: string | null;
          item_name: string;
          quantity: number;
          unit: string;
          unit_cost: number | null;
          total_cost: number | null;
          date: string;
          created_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["supply_quantities"]["Row"]
        > & {
          project_id: string;
          item_name: string;
          quantity: number;
        };
        Update: Partial<
          Database["public"]["Tables"]["supply_quantities"]["Row"]
        >;
        Relationships: [];
      };
      contact_leads: {
        Row: {
          id: string;
          name: string;
          phone: string | null;
          email: string | null;
          message: string | null;
          created_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["contact_leads"]["Row"]
        > & {
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["contact_leads"]["Row"]>;
        Relationships: [];
      };
    };
    Views: {
      public_projects: {
        Row: {
          id: string;
          title: string;
          public_summary: string | null;
          scope_size: ScopeSize;
          project_type: AcquisitionType;
          status: ProjectStatus;
          cover_image_url: string | null;
          start_date: string | null;
          end_date_actual: string | null;
          property_name: string;
          property_address: string;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
