-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails_log ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can access their own data" ON users
  FOR ALL
  USING (email = current_setting('request.jwt.claims.email', true));

CREATE POLICY "Staff can access all users data" ON users
  FOR ALL
  TO public
  USING (current_setting('request.jwt.claims.role', true) = 'staff');

-- Events table policies
CREATE POLICY "Public can select events" ON events
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Creator can modify their events" ON events
  FOR ALL
  USING (creator_id = (SELECT user_id FROM users WHERE email = current_setting('request.jwt.claims.email', true)));

CREATE POLICY "Staff can access all events" ON events
  FOR ALL
  TO public
  USING (current_setting('request.jwt.claims.role', true) = 'staff');

-- Payments table policies
CREATE POLICY "Users can access their own payments" ON payments
  FOR ALL
  USING (user_id = (SELECT user_id FROM users WHERE email = current_setting('request.jwt.claims.email', true)));

CREATE POLICY "Staff can access all payments" ON payments
  FOR ALL
  TO public
  USING (current_setting('request.jwt.claims.role', true) = 'staff');

-- Event_members table policies
CREATE POLICY "Users can access their own memberships" ON event_members
  FOR ALL
  USING (user_id = (SELECT user_id FROM users WHERE email = current_setting('request.jwt.claims.email', true)));

CREATE POLICY "Staff can access all memberships" ON event_members
  FOR ALL
  TO public
  USING (current_setting('request.jwt.claims.role', true) = 'staff');

-- Emails_log table policies
CREATE POLICY "Users can access their own email logs" ON emails_log
  FOR ALL
  USING (user_id = (SELECT user_id FROM users WHERE email = current_setting('request.jwt.claims.email', true)));

CREATE POLICY "Staff can access all email logs" ON emails_log
  FOR ALL
  TO public
  USING (current_setting('request.jwt.claims.role', true) = 'staff');
