import db from "../connection";
import format from "pg-format";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

interface user {
  name: string;
  email: string;
  password: string;
  role: "staff" | "member";
  created_at: Date;
}
interface event {
  title: string;
  description: string;
  date: Date;
  location: string;
  type: "free" | "paid";
  price: number;
  creator_email: string;
  image_url?: string;
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

interface DataBase {
  users: user[];
  events: event[];
  payments: payment[];
  event_members: event_member[];
  emails_log: email_log[];
}

type mixType = string | number | Date | null;
const seed = async (dataBase: DataBase): Promise<void> => {
  try {
    // Droping Tables in reverse dependency order (CASCADE will drop sequences)
    await db.query(`DROP TABLE IF EXISTS emails_log CASCADE`);
    await db.query(`DROP TABLE IF EXISTS event_members CASCADE`);
    await db.query(`DROP TABLE IF EXISTS payments CASCADE`);
    await db.query(`DROP TABLE IF EXISTS events CASCADE`);
    await db.query(`DROP TABLE IF EXISTS users CASCADE`);
    // Creating Users Tables
    await db.query(`
        CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT CHECK (role in ('staff','member')) DEFAULT 'member' ,
        created_at TIMESTAMP DEFAULT NOW());
        `);
    // Creating Events Tables
    await db.query(`
        CREATE TABLE events (
        event_id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        date TIMESTAMP NOT NULL,
        location TEXT NOT NULL,
        type TEXT CHECK (type in ('free','paid')),
        price NUMERIC DEFAULT 0,
        creator_id INT REFERENCES users(user_id),
        image_url TEXT,
        created_at TIMESTAMP DEFAULT NOW()
        );`);
    // Creating Payments Tables
    await db.query(`
        CREATE TABLE payments (
        payment_id SERIAL PRIMARY KEY,
        user_id  INT REFERENCES users(user_id),
        event_id INT REFERENCES events(event_id),
        amount NUMERIC NOT NULL,
        status TEXT CHECK (status in ('pending','success', 'failed')),
        created_at TIMESTAMP DEFAULT NOW()
        );`);
    // Creating Event_Members Tables
    await db.query(`
        CREATE TABLE event_members (
        event_member_id SERIAL PRIMARY KEY,
        event_id INT REFERENCES events(event_id),
        user_id INT REFERENCES users(user_id),
        payment_id INT REFERENCES payments(payment_id),
        joined_at TIMESTAMP DEFAULT NOW()
        );`);
    // Creating Emails_log Tables
    await db.query(`         
        CREATE TABLE emails_log (
        email_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(user_id),
        event_id INT REFERENCES events(event_id),
        status TEXT,
        sent_at TIMESTAMP DEFAULT NOW());
        `);
    // Reset sequences
    await db.query(`ALTER SEQUENCE users_user_id_seq RESTART WITH 1`);
    await db.query(`ALTER SEQUENCE events_event_id_seq RESTART WITH 1`);
    await db.query(`ALTER SEQUENCE payments_payment_id_seq RESTART WITH 1`);
    await db.query(
      `ALTER SEQUENCE event_members_event_member_id_seq RESTART WITH 1`
    );
    await db.query(`ALTER SEQUENCE emails_log_email_id_seq RESTART WITH 1`);

    // Enable RLS and policies
    const rlsPath = path.join(__dirname, "../rls-policies.sql");
    const rlsSQL = fs.readFileSync(rlsPath, "utf8");
    await db.query(rlsSQL);

    // Insert Data in Tables

    //User Table
    const hashedUsers = await Promise.all(
      dataBase.users.map(async (data) => ({
        ...data,
        password: await bcrypt.hash(data.password, 10),
      }))
    );
    const usersValues = hashedUsers.map((data) => [
      data.name,
      data.email,
      data.password,
      data.role,
      data.created_at,
    ]);
    const UserInsertQuery = format(
      `
            INSERT INTO users (name,email,password,role,created_at) VALUES %L RETURNING *;`,
      usersValues
    );
    const { rows: insertedUsers } = await db.query(UserInsertQuery);

    // Insert Event Table
    // Create a mapping of email → user_id
    const userIdMap: Record<string, number> = {};
    insertedUsers.forEach((u) => {
      userIdMap[u.email] = u.user_id;
    });

    // Insert Event Table
    const eventValues: mixType[][] = dataBase.events.map((data) => {
      const creatorId = userIdMap[data.creator_email] ?? null;

      return [
        data.title,
        data.description,
        data.date,
        data.location,
        data.type,
        data.price,
        creatorId,
        data.image_url ?? null,
        data.created_at,
      ];
    });

    const eventInsertQuery = format(
      `
            INSERT INTO events (title,description,date,location,type,price,creator_id,image_url,created_at) VALUES %L RETURNING *;`,
      eventValues
    );
    const { rows: InsertedEvents } = await db.query(eventInsertQuery);

    // Insert Payment Table
    const eventIdMap: Record<string, number> = {};
    InsertedEvents.forEach((e) => {
      eventIdMap[e.title] = e.event_id;
    });

    const paymentValues: mixType[][] = dataBase.payments.map((data) => {
      const event_id = eventIdMap[data.event_title] ?? null;
      const user_id = userIdMap[data.user_email] ?? null;
      return [user_id, event_id, data.amount, data.status, data.created_at];
    });
    const paymentInsertQuery = format(
      `
            INSERT INTO payments (user_id,event_id,amount,status,created_at) VALUES %L RETURNING *;`,
      paymentValues
    );
    const { rows: insertedPayments } = await db.query(paymentInsertQuery);

    //Insert Event_members Table
    const paymentIdMap: Record<string, number> = {};
    insertedPayments.forEach((pay) => {
      const key = `${pay.user_id}_${pay.event_id}`;
      paymentIdMap[key] = pay.payment_id;
    });

    const eventMembersValues: mixType[][] = dataBase.event_members.map(
      (data) => {
        const event_id = eventIdMap[data.event_title] ?? null;
        const user_id = userIdMap[data.user_email] ?? null;
        const paymentKey = `${user_id}_${event_id}`;
        const paymentId = paymentIdMap[paymentKey] ?? null;
        return [event_id, user_id, paymentId, data.joined_at];
      }
    );
    const event_members_InsertQuery = format(
      `
            INSERT INTO event_members (event_id,
            user_id,payment_id,joined_at) VALUES %L RETURNING *;`,
      eventMembersValues
    );
    const { rows: inserted_event_members } = await db.query(
      event_members_InsertQuery
    );

    //Insert Email_log Table
    const emails_log_Values = dataBase.emails_log.map((data) => {
      const event_id = eventIdMap[data.event_title] ?? null;
      const user_id = userIdMap[data.user_email] ?? null;
      return [user_id, event_id, data.status, data.sent_at];
    });
    const emails_log_InsertQuery = format(
      `
            INSERT INTO emails_log (
            user_id, event_id,status,sent_at) VALUES %L RETURNING *;`,
      emails_log_Values
    );
    const { rows: Inserted_emails_log } = await db.query(
      emails_log_InsertQuery
    );
    console.log("Seed data inserted successfully!");
  } catch (err) {
    console.error("Error seeding data:", err);
  }
};

export default seed;
