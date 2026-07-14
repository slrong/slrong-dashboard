import { getUpcomingEvents } from "@/lib/calendar";

export const dynamic = "force-dynamic";

function formatRange(start: Date, end: Date) {
  const dateFmt = new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });
  const timeFmt = new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${dateFmt.format(start)} ${timeFmt.format(start)} - ${timeFmt.format(end)}`;
}

export default async function CalendarPage() {
  const configured = !!process.env.GOOGLE_CALENDAR_ICS_URL;
  const events = configured ? await getUpcomingEvents(30) : [];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">일정</h1>

      {!configured && (
        <p className="rounded-lg border border-neutral-200 bg-white p-4 text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">
          아직 구글 캘린더가 연동되지 않았습니다. 환경변수{" "}
          <code>GOOGLE_CALENDAR_ICS_URL</code>을 설정해주세요.
        </p>
      )}

      <ul className="space-y-2">
        {events.map((event) => (
          <li
            key={event.key}
            className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <p className="font-medium">{event.title}</p>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {formatRange(event.start, event.end)}
            </p>
            {event.location && (
              <p className="mt-1 text-xs text-neutral-400">{event.location}</p>
            )}
          </li>
        ))}
        {configured && events.length === 0 && (
          <p className="py-8 text-center text-sm text-neutral-400">
            앞으로 30일 이내 예정된 일정이 없습니다.
          </p>
        )}
      </ul>
    </div>
  );
}
