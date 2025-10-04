import db from "../db/connection";
import { Event } from "../db/tableTypes";

export const selectAllEvents = async (): Promise<Event[]> => {
  const result =
    await db.query<Event>(`SELECT event_id, title, description, date, location, type,
            price::INT AS price, creator_id, created_at
     FROM events`);
  return result.rows;
};

export const selectSingleEvent = async (event_id: Number): Promise<Event> => {
  const result = await db.query<Event>(
    `SELECT event_id, title, description, date, location, type,
            price::INT AS price, creator_id, created_at
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
