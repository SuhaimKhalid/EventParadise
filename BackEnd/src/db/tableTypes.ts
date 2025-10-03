export interface User {
  user_id: number;
  name: string;
  email: string;
  password: string;
  role: "staff" | "member";
  created_at: string;
}
