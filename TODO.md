# TODO: Fix Add to Calendar Functionality

- [x] Update imports in Member_Account_Page.tsx: Remove useGoogleCalendar and CalendarEvent from GoogleCalender.tsx, add addToCalendar from AddToCalender.tsx
- [x] Remove useGoogleCalendar hook usage from Member_Account_Page.tsx
- [x] Fix calendarEvent object by removing creator_id (not needed for .ics)
- [x] Update button onClick to use addToCalendar function
- [x] Remove disabled prop from button since .ics download doesn't require API readiness
