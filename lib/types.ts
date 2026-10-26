export type RegistrationMethod = 'website' | 'google_form';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded';
export type ParticipationStatus =
  | 'registered'
  | 'enrolled'
  | 'completed'
  | 'dropped'
  | 'waitlisted';
export type PaymentRecordStatus = 'created' | 'attempted' | 'paid' | 'failed' | 'cancelled';
export type RefundStatus = 'pending' | 'processed' | 'failed' | 'cancelled';
export type AdminRole = 'super_admin' | 'workshop_manager' | 'finance_manager' | 'read_only';
export type ContactStatus = 'new' | 'read' | 'replied' | 'archived';

export interface Workshop {
  id: string;
  name: string;
  description: string | null;
  fee_paise: number;
  currency: string;
  duration_days: number;
  format: string | null;
  objectives: string | null;
  topics: string | null;
  activities: string | null;
  audience: string | null;
  delivery_info: string | null;
  registration_open: boolean;
  whatsapp_link: string | null;
  google_form_link: string | null;
  contact_email: string | null;
  contact_phone_1: string | null;
  contact_phone_2: string | null;
  is_active: boolean;
}

export interface Batch {
  id: string;
  workshop_id: string;
  name: string;
  start_date: string;
  end_date: string;
  format: string | null;
  capacity: number;
  registration_open: boolean;
  is_published: boolean;
}

export interface Registration {
  id: string;
  reference: string;
  full_name: string;
  email: string;
  phone: string;
  category: string | null;
  batch_id: string | null;
  registration_method: RegistrationMethod;
  payment_status: PaymentStatus;
  participation_status: ParticipationStatus;
  consent_accepted: boolean;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  registration_id: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  amount_paise: number;
  currency: string;
  status: PaymentRecordStatus;
  method: string | null;
  created_at: string;
  paid_at: string | null;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: ContactStatus;
  created_at: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  published: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  sort_order: number;
  published: boolean;
}

export interface CurriculumStage {
  id: string;
  stage_number: number;
  title: string;
  description: string | null;
  published: boolean;
}

export interface CurriculumTopic {
  id: string;
  stage_id: string;
  title: string;
  description: string | null;
  sort_order: number;
  published: boolean;
}

export interface AdminUser {
  id: string;
  auth_user_id: string;
  name: string;
  email: string;
  role_id: number;
  role_name?: AdminRole;
  active: boolean;
}

export interface AuditLog {
  id: string;
  admin_id: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

export interface SiteSetting {
  key: string;
  value: string;
  description: string | null;
}
