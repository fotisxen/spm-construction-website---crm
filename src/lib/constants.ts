export const CONTACT_CATEGORIES = [
  "υδραυλικός", "ηλεκτρολόγος", "γκρεμίσματα", "κουφώματα", "πλακάκια",
  "προμηθευτής", "είδη_υγιεινής", "γυψοσανίδας", "μπετατζής", "κουζίνα",
  "βαψίματα", "καθαρισμός", "μεσίτης", "λογιστής", "άλλο",
] as const;

export const EXPENSE_CATEGORIES = [
  "ενοίκιο_γραφείου", "ασφάλεια", "λογιστής", "μεσιτικά", "υλικά", "άλλο",
] as const;

export const INCOME_CATEGORIES = [
  "πώληση_ακινήτου", "ανακαίνιση", "έκδοση_σύνδεση_λογαριασμών", "ενοίκιο", "άλλο",
] as const;

export const MODULES = [
  "properties", "projects", "contacts", "payments",
  "expenses", "income", "supplies", "reports",
] as const;

export const MODULE_LABELS: Record<(typeof MODULES)[number], string> = {
  properties: "Ακίνητα",
  projects: "Projects",
  contacts: "Συνεργάτες",
  payments: "Πληρωμές",
  expenses: "Έξοδα",
  income: "Έσοδα",
  supplies: "Προμήθειες",
  reports: "Αναφορές",
};

export const ACCESS_LEVELS = ["none", "view", "manage"] as const;

export const ACCESS_LEVEL_LABELS: Record<(typeof ACCESS_LEVELS)[number], string> = {
  none: "Καμία πρόσβαση",
  view: "Μόνο προβολή",
  manage: "Πλήρης πρόσβαση",
};

export const DEFAULT_PHASES = [
  {
    phase_number: 1 as const,
    name: "Προκαταβολή 30% (γκρεμίσματα, κουφώματα, υδραυλικός, ηλεκτρολόγος)",
  },
  {
    phase_number: 2 as const,
    name: "Δάπεδα & παραγγελίες προμηθευτών (30%)",
  },
  {
    phase_number: 3 as const,
    name: "Κουφώματα, εξοφλήσεις, βαψίματα (40%)",
  },
];
