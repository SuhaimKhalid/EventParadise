// Utilities/GoogleCalendar.ts
export interface CalendarEvent {
  title: string;
  description: string;
  start_date: string; // ISO string
  end_date: string; // ISO string
  location: string;
  type: "free" | "paid";
  price?: number;
  image_url?: string;
}

export const getGoogleCalendarLink = (event: CalendarEvent) => {
  const formatDate = (date: string) => date.replace(/-|:|\.\d+/g, "");

  const start = formatDate(event.start_date);
  const end = formatDate(event.end_date);

  // Build description including price and image if present
  let details = event.description;
  if (event.price) details += `\n💷 Price: £${event.price}`;
  if (event.image_url) details += `\n🖼️ Image: ${event.image_url}`;

  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    event.title
  )}&dates=${start}/${end}&details=${encodeURIComponent(
    details
  )}&location=${encodeURIComponent(event.location)}&sf=true&output=xml`;

  return url;
};
