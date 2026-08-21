export type StoryStage = {
  eyebrow: string;
  title: string;
  body: string;
};

// Stage copy shown as the scroll position moves through the 3D scene.
// Deliberately mirrors the CRM's real 3-phase structure (προκαταβολή →
// δάπεδα/παραγγελίες → κουφώματα/εξοφλήσεις) without naming it directly.
export const STORY_STAGES: StoryStage[] = [
  {
    eyebrow: "Πριν",
    title: "Κάθε ανακαίνιση ξεκινά με ένα ξεκάθαρο σχέδιο.",
    body: "Καταγράφουμε την υπάρχουσα κατάσταση, ορίζουμε έκταση εργασιών και θέτουμε ρεαλιστικό χρονοδιάγραμμα — πριν σηκωθεί ούτε ένα σφυρί.",
  },
  {
    eyebrow: "Στην πορεία",
    title: "Ξέρεις πάντα σε ποια φάση βρίσκεται το έργο σου.",
    body: "Γκρεμίσματα, υδραυλικά, ηλεκτρολογικά, δάπεδα, κουφώματα — κάθε φάση έχει δικό της χρονοδιάγραμμα και προϋπολογισμό, χωρίς εκπλήξεις στην πορεία.",
  },
  {
    eyebrow: "Μετά",
    title: "Το αποτέλεσμα μιλάει από μόνο του.",
    body: "Παράδοση στην ώρα της, μέσα στον προϋπολογισμό που συμφωνήσαμε — έτσι θέλουμε να μας θυμάσαι.",
  },
];
