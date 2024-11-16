import type { DayOff } from "./dayoffs.schema";

export function formatDayOff(dayOff: DayOff) {
  const { id, date, status } = dayOff;
  return { id, date, status };
}
