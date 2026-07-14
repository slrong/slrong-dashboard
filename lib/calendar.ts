import ICAL from "ical.js";

export interface CalendarEvent {
  key: string;
  title: string;
  start: Date;
  end: Date;
  location: string;
}

const LOOKAHEAD_DAYS = 30;
const MAX_RECURRENCE_INSTANCES = 50;

export async function getUpcomingEvents(
  limit = 10
): Promise<CalendarEvent[]> {
  const icsUrl = process.env.GOOGLE_CALENDAR_ICS_URL;
  if (!icsUrl) return [];

  const res = await fetch(icsUrl, { next: { revalidate: 300 } });
  if (!res.ok) return [];

  const icsText = await res.text();
  const jcalData = ICAL.parse(icsText);
  const comp = new ICAL.Component(jcalData);
  const vevents = comp.getAllSubcomponents("vevent");

  const now = new Date();
  const rangeEnd = new Date(now.getTime() + LOOKAHEAD_DAYS * 24 * 60 * 60 * 1000);
  const events: CalendarEvent[] = [];

  for (const vevent of vevents) {
    const event = new ICAL.Event(vevent);

    if (event.isRecurring()) {
      const iterator = event.iterator();
      let next: ICAL.Time | null;
      let count = 0;
      while (
        count < MAX_RECURRENCE_INSTANCES &&
        (next = iterator.next())
      ) {
        count++;
        const occurrence = event.getOccurrenceDetails(next);
        const start = occurrence.startDate.toJSDate();
        const end = occurrence.endDate.toJSDate();
        if (start > rangeEnd) break;
        if (end >= now) {
          events.push({
            key: `${event.uid}-${start.toISOString()}`,
            title: event.summary || "(제목 없음)",
            start,
            end,
            location: event.location || "",
          });
        }
      }
    } else {
      const start = event.startDate.toJSDate();
      const end = event.endDate ? event.endDate.toJSDate() : start;
      if (end >= now && start <= rangeEnd) {
        events.push({
          key: event.uid,
          title: event.summary || "(제목 없음)",
          start,
          end,
          location: event.location || "",
        });
      }
    }
  }

  events.sort((a, b) => a.start.getTime() - b.start.getTime());
  return events.slice(0, limit);
}
