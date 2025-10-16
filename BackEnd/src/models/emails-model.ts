import db from "../db/connection";
import { EmailLog } from "../db/tableTypes";

export const selectEmailById = async (email_id: number): Promise<EmailLog> => {
  const result = await db.query<EmailLog>(
    `SELECT email_id, user_id, event_id, status, sent_at FROM emails_log WHERE email_id = $1`,
    [email_id]
  );
  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Email log not found" });
  }
  return result.rows[0];
};

export const insertEmailLog = async (
  emailData: Partial<EmailLog>
): Promise<EmailLog> => {
  const { user_id, event_id, status } = emailData;

  if (!user_id || !event_id) {
    throw { status: 400, msg: "user_id and event_id are required" };
  }

  const result = await db.query<EmailLog>(
    `INSERT INTO emails_log (user_id, event_id, status) VALUES ($1, $2, $3) RETURNING email_id, user_id, event_id, status, sent_at`,
    [user_id, event_id, status || "sent"]
  );
  return result.rows[0];
};
