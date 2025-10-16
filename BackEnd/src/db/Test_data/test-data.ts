export const users = [
  {
    user_id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    password: "hashed_pw1",
    role: "member",
    created_at: new Date("2025-10-01T10:00:00Z"),
  },
  {
    user_id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    password: "hashed_pw2",
    role: "staff",
    created_at: new Date("2025-10-01T11:00:00Z"),
  },
  {
    user_id: 3,
    name: "Charlie Brown",
    email: "charlie@example.com",
    password: "hashed_pw3",
    role: "member",
    created_at: new Date("2025-10-01T12:00:00Z"),
  },
];

export const events = [
  {
    event_id: 1,
    title: "Music Festival",
    description: "Annual outdoor music festival.",
    start_date: new Date("2025-12-01T18:00:00Z"),
    end_date: new Date("2025-12-01T18:00:00Z"),
    location: "Central Park",
    type: "paid",
    price: 50,
    creator_id: 2,
    created_at: new Date("2025-10-01T12:00:00Z"),
  },
  {
    event_id: 2,
    title: "Charity Marathon",
    description: "Run for a cause.",
    start_date: new Date("2025-11-15T07:00:00Z"),
    end_date: new Date("2025-11-15T07:00:00Z"),
    location: "City Stadium",
    type: "free",
    price: 0,
    creator_id: 2,
    created_at: new Date("2025-10-02T09:00:00Z"),
  },
];

export const payments = [
  {
    payment_id: 1,
    user_id: 1,
    event_id: 1,
    amount: 50,
    status: "success",
    created_at: new Date("2025-10-01T12:30:00Z"),
  },
  {
    payment_id: 2,
    user_id: 3,
    event_id: 1,
    amount: 50,
    status: "pending",
    created_at: new Date("2025-10-01T13:00:00Z"),
  },
];

export const event_members = [
  {
    event_member_id: 1,
    event_id: 1,
    user_id: 1,
    payment_id: 1,
    joined_at: new Date("2025-10-01T12:45:00Z"),
  },
  {
    event_member_id: 2,
    event_id: 1,
    user_id: 3,
    payment_id: 2,
    joined_at: new Date("2025-10-01T13:05:00Z"),
  },
  {
    event_member_id: 3,
    event_id: 2,
    user_id: 2,
    payment_id: null,
    joined_at: new Date("2025-10-01T14:00:00Z"),
  },
];

export const emails_log = [
  {
    email_id: 1,
    user_id: 1,
    event_id: 1,
    status: "sent",
    sent_at: new Date("2025-10-01T13:00:00Z"),
  },
  {
    email_id: 2,
    user_id: 3,
    event_id: 1,
    status: "failed",
    sent_at: new Date("2025-10-01T13:15:00Z"),
  },
  {
    email_id: 3,
    user_id: 2,
    event_id: 2,
    status: "sent",
    sent_at: new Date("2025-10-01T14:30:00Z"),
  },
];
