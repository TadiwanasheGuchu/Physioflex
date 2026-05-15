export type UserRole = "patient" | "therapist" | "admin";
export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled" | "no_show";
export type InvoiceStatus = "unpaid" | "paid" | "partially_paid" | "void";
export type ReviewStatus = "pending" | "approved" | "rejected";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      patients: {
        Row: {
          id: string;
          user_id: string;
          first_name: string;
          last_name: string;
          phone: string | null;
          whatsapp: string | null;
          date_of_birth: string | null;
          gender: string | null;
          address: string | null;
          suburb: string | null;
          emergency_name: string | null;
          emergency_phone: string | null;
          medical_aid_name: string | null;
          medical_aid_number: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["patients"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["patients"]["Insert"]>;
      };
      therapists: {
        Row: {
          id: string;
          user_id: string;
          first_name: string;
          last_name: string;
          title: string;
          hpcna_number: string;
          bio: string | null;
          photo: string | null;
          specialisations: string[];
          languages: string[];
          years_experience: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["therapists"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["therapists"]["Insert"]>;
      };
      services: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          duration_min: number;
          price_nad: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["services"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["services"]["Insert"]>;
      };
      appointments: {
        Row: {
          id: string;
          patient_id: string;
          therapist_id: string;
          service_id: string;
          starts_at: string;
          ends_at: string;
          status: AppointmentStatus;
          notes: string | null;
          reference: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["appointments"]["Row"], "id" | "reference" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["appointments"]["Insert"]>;
      };
      invoices: {
        Row: {
          id: string;
          patient_id: string;
          appointment_id: string | null;
          number: string;
          amount_nad: number;
          status: InvoiceStatus;
          paid_at: string | null;
          pdf_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["invoices"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["invoices"]["Insert"]>;
      };
      reviews: {
        Row: {
          id: string;
          patient_id: string | null;
          appointment_id: string | null;
          display_name: string;
          suburb: string | null;
          service_id: string | null;
          rating: number;
          body: string;
          status: ReviewStatus;
          helpful_count: number;
          admin_reply: string | null;
          admin_replied_at: string | null;
          verified_patient: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["reviews"]["Row"], "id" | "helpful_count" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          recipient_id: string;
          appointment_id: string | null;
          subject: string | null;
          body: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["messages"]["Row"], "id" | "is_read" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
      };
      progress_logs: {
        Row: {
          id: string;
          patient_id: string;
          date: string;
          pain_score: number;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["progress_logs"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["progress_logs"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      appointment_status: AppointmentStatus;
      invoice_status: InvoiceStatus;
      review_status: ReviewStatus;
    };
  };
}
