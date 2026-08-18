import type { Database } from "@/lib/types/database";

export type PublicProject = Database["public"]["Views"]["public_projects"]["Row"];

// Shown only until the Supabase project is connected and real case studies
// exist. Every field here is fictional and clearly marked as such in the UI.
export const PLACEHOLDER_PORTFOLIO: PublicProject[] = [
  {
    id: "placeholder-1",
    title: "[PLACEHOLDER] Πλήρης ανακαίνιση διαμερίσματος 85τμ",
    public_summary:
      "[PLACEHOLDER] Ενδεικτικό παράδειγμα ολοκληρωμένου project — θα αντικατασταθεί με πραγματικό case study.",
    scope_size: "full",
    project_type: "flip",
    status: "completed",
    cover_image_url: null,
    start_date: "2025-02-01",
    end_date_actual: "2025-05-15",
    property_name: "[PLACEHOLDER] Διαμέρισμα Κυψέλη",
    property_address: "[PLACEHOLDER διεύθυνση]",
  },
  {
    id: "placeholder-2",
    title: "[PLACEHOLDER] Ανακαίνιση μπάνιου",
    public_summary:
      "[PLACEHOLDER] Παράδειγμα μερικής ανακαίνισης — θα αντικατασταθεί με πραγματικό case study.",
    scope_size: "partial",
    project_type: "client_owned",
    status: "completed",
    cover_image_url: null,
    start_date: "2025-06-01",
    end_date_actual: "2025-06-20",
    property_name: "[PLACEHOLDER] Διαμέρισμα Παγκράτι",
    property_address: "[PLACEHOLDER διεύθυνση]",
  },
  {
    id: "placeholder-3",
    title: "[PLACEHOLDER] Flip: αγορά, ανακαίνιση, πώληση",
    public_summary:
      "[PLACEHOLDER] Παράδειγμα flip project — θα αντικατασταθεί με πραγματικό case study.",
    scope_size: "full",
    project_type: "flip",
    status: "completed",
    cover_image_url: null,
    start_date: "2024-11-01",
    end_date_actual: "2025-03-01",
    property_name: "[PLACEHOLDER] Διαμέρισμα Νέος Κόσμος",
    property_address: "[PLACEHOLDER διεύθυνση]",
  },
];
