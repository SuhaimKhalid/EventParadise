export interface User {
  user_id: number;
  name: string;
  email: string;
  password: string;
  role: "staff" | "member";
  created_at: string;
}

export interface Event {
  event_id: number;
  title: string;
  description: string;
  date: Date;
  location: string;
  type: "free" | "paid";
  price: number;
  creator_id: number;
  created_at: Date;
}
interface payment {
  user_email: string;
  event_title: string;
  amount: number;
  status: string;
  created_at: Date;
}
interface event_member {
  event_title: string;
  user_email: string;
  payment_id?: number;
  joined_at: Date;
}
interface email_log {
  user_email: string;
  event_title: string;
  status?: string;
  sent_at: Date;
}
