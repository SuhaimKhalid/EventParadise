import axios from "axios";

const api = axios.create({
  baseURL: "https://eventparadise.onrender.com/api/",
});

// =======================
// 🌐 EVENTS API
// =======================
export interface Event {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  type: "free" | "paid";
  price: number;
  creator_id: number;
  image_url?: string;
  created_at?: string;
  event_id?: number;
}
export const fetchAllEvents = async () => {
  const { data } = await api.get("events");
  return data;
};
export const fetchSingleEvent = async (event_id: number) => {
  const { data } = await api.get(`events/${event_id}`);
  return data;
};

export const addEvent = async (
  eventData: Event,
  token: string
): Promise<Event> => {
  const res = await api.post("events", eventData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.event as Event;
};

export const FetchEventsByStaffUser = async (
  user_id: number,
  token: string
) => {
  const { data } = await api.get(`users/${user_id}/created-events`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// Join Event

// =======================
// 👤 USER TYPES
// =======================
export interface RegisterUser {
  name: string;
  email: string;
  password: string;
  role: "staff" | "member";
  created_at: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

// =======================
// 🔐 AUTH ENDPOINTS
// =======================
export const postUserAsStaff = async (user: RegisterUser) => {
  const { data } = await api.post("auth/register", user);
  return data;
};

export const loginPostUser = async (user: LoginUser) => {
  const response = await api.post("auth/login", user);
  return response.data;
};

// Return all Events Joined BY Member
export const getJoinedEventsByMember = async (user_id: number) => {
  const { data } = await api.get(`users/${user_id}/events`);
  return data;
};

export default api;
