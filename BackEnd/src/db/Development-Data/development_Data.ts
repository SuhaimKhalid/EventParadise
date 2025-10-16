const users_Data = [
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    password: "hashed_pw1",
    role: "member" as const,
    created_at: new Date("2025-10-01T10:00:00Z"),
  },
  {
    name: "Bob Smith",
    email: "bob@example.com",
    password: "hashed_pw2",
    role: "staff" as const,
    created_at: new Date("2025-10-01T11:00:00Z"),
  },
  {
    name: "Charlie Brown",
    email: "charlie@example.com",
    password: "hashed_pw3",
    role: "member" as const,
    created_at: new Date("2025-10-01T12:00:00Z"),
  },
];

const events_Data = [
  {
    title: "Music Festival",
    description: "Annual outdoor music festival.",
    start_date: new Date("2025-12-01T18:00:00Z"),
    end_date: new Date("2025-12-01T18:00:00Z"),
    location: "Central Park",
    type: "paid" as const,
    price: 50,
    creator_email: "bob@example.com", // changed from creator_id to creator_email
    image_url: "https://example.com/images/music-festival.jpg",
    created_at: new Date("2025-10-01T12:00:00Z"),
  },
  {
    title: "Charity Marathon",
    description: "Run for a cause.",
    start_date: new Date("2025-11-15T07:00:00Z"),
    end_date: new Date("2025-11-15T07:00:00Z"),
    location: "City Stadium",
    type: "free" as const,
    price: 0,
    creator_email: "bob@example.com", // changed from creator_id to creator_email
    image_url: "https://example.com/images/charity-marathon.jpg",
    created_at: new Date("2025-10-02T09:00:00Z"),
  },
];

const payments_Data = [
  {
    user_email: "alice@example.com", // changed from user_id
    event_title: "Music Festival", // changed from event_id
    amount: 50,
    status: "success",
    created_at: new Date("2025-10-01T12:30:00Z"),
  },
  {
    user_email: "charlie@example.com", // changed from user_id
    event_title: "Music Festival", // changed from event_id
    amount: 50,
    status: "pending",
    created_at: new Date("2025-10-01T13:00:00Z"),
  },
];

const event_members_Data = [
  {
    event_title: "Music Festival", // changed from event_id
    user_email: "alice@example.com", // changed from user_id
    payment_index: 0, // index of payment in payments_Data (to resolve dynamically)
    joined_at: new Date("2025-10-01T12:45:00Z"),
  },
  {
    event_title: "Music Festival",
    user_email: "charlie@example.com",
    payment_index: 1,
    joined_at: new Date("2025-10-01T13:05:00Z"),
  },
  {
    event_title: "Charity Marathon",
    user_email: "bob@example.com",
    payment_index: 0, // will resolve dynamically
    joined_at: new Date("2025-10-01T14:00:00Z"),
  },
];

const emails_log_Data = [
  {
    user_email: "alice@example.com",
    event_title: "Music Festival",
    status: "sent",
    sent_at: new Date("2025-10-01T13:00:00Z"),
  },
  {
    user_email: "charlie@example.com",
    event_title: "Music Festival",
    status: "failed",
    sent_at: new Date("2025-10-01T13:15:00Z"),
  },
  {
    user_email: "bob@example.com",
    event_title: "Charity Marathon",
    status: "sent",
    sent_at: new Date("2025-10-01T14:30:00Z"),
  },
];

const index = {
  users: users_Data,
  events: events_Data,
  payments: payments_Data,
  event_members: event_members_Data,
  emails_log: emails_log_Data,
};

export default index;
