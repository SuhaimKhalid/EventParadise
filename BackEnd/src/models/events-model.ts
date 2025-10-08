import db from "../db/connection";
import { Event } from "../db/tableTypes";

export const selectAllEvents = async (): Promise<Event[]> => {
  const result =
    await db.query<Event>(`SELECT event_id, title, description, date, location, type,
            price::INT AS price, creator_id, image_url, created_at
     FROM events`);
  return result.rows;
};

export const selectSingleEvent = async (event_id: Number): Promise<Event> => {
  const result = await db.query<Event>(
    `SELECT event_id, title, description, date, location, type,
            price::INT AS price, creator_id, image_url, created_at
     FROM events WHERE event_id=$1`,
    [event_id]
  );
  return result.rows[0];
};

export const updateEvent = async (
  event_id: Number,
  updateEvent: Partial<Event>
): Promise<Event> => {
  const field = Object.keys(updateEvent);
  const values = Object.values(updateEvent);
  const setClause = field
    .map((field, index) => `${field}=$${index + 1}`)
    .join(", ");

  const result = await db.query<Event>(
    `UPDATE events SET ${setClause} WHERE event_id=$${
      field.length + 1
    } RETURNING *;`,
    [...values, event_id]
  );

  // Convert numeric strings to numbers
  const event = result.rows[0];
  if (event && typeof event.price === "string") {
    (event as any).price = Number(event.price);
  }
  return event;
};

export const insertEvent = async (
  eventData: Partial<Event>
): Promise<Event> => {
  const {
    title,
    description,
    date,
    location,
    type,
    price,
    creator_id,
    image_url,
  } = eventData;

  const result = await db.query<Event>(
    `INSERT INTO events (title,description,date,location,type,price,creator_id,image_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [title, description, date, location, type, price, creator_id, image_url]
  );
  // Convert numeric strings to numbers
  const event = result.rows[0];
  if (event && typeof event.price === "string") {
    (event as any).price = Number(event.price);
  }
  return event;
};

export const deleteEvent = async (event_id: number) => {
  // Delete dependent records first to avoid foreign key constraints
  await db.query(`DELETE FROM emails_log WHERE event_id = $1;`, [event_id]);
  await db.query(`DELETE FROM event_members WHERE event_id = $1;`, [event_id]);
  await db.query(`DELETE FROM payments WHERE event_id = $1;`, [event_id]);

  const result = await db.query(
    `DELETE FROM events WHERE event_id = $1 RETURNING *;`,
    [event_id]
  );

  return result.rows[0] || null;
};

export const joinEvent = async (event_id: number, user_id: number) => {
  // Check if event exists
  const eventResult = await db.query(
    `SELECT * FROM events WHERE event_id = $1;`,
    [event_id]
  );
  const event = eventResult.rows[0];
  if (!event) {
    throw { status: 404, msg: "Event not found" };
  }

  // Check if already joined
  const memberResult = await db.query(
    `SELECT * FROM event_members WHERE event_id = $1 AND user_id = $2;`,
    [event_id, user_id]
  );
  if (memberResult.rows.length > 0) {
    throw { status: 400, msg: "Already joined this event" };
  }

  // Insert into event_members
  const memberInsert = await db.query(
    `INSERT INTO event_members (event_id, user_id) VALUES ($1, $2) RETURNING *;`,
    [event_id, user_id]
  );

  // If paid event, create payment
  if (event.type === "paid") {
    await db.query(
      `INSERT INTO payments (user_id, event_id, amount, status) VALUES ($1, $2, $3, 'pending');`,
      [user_id, event_id, event.price]
    );
  }

  return memberInsert.rows[0];
};

export const selectEventAttendees = async (event_id: number) => {
  const result = await db.query(
    `SELECT u.user_id, u.name, u.email, u.role, em.joined_at
     FROM event_members em
     JOIN users u ON em.user_id = u.user_id
     WHERE em.event_id = $1`,
    [event_id]
  );
  return result.rows;
};

export const selectUserEvents = async (user_id: number) => {
  const result = await db.query(
    `SELECT e.event_id, e.title, e.description, e.date, e.location, e.type, e.price::INT AS price, e.image_url, e.created_at, em.joined_at
     FROM event_members em
     JOIN events e ON em.event_id = e.event_id
     WHERE em.user_id = $1`,
    [user_id]
  );
  return result.rows;
};
