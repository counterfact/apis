export type RecurrencePeriod = 1 | 2 | 3 | 4;

const parseDate = (date: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) throw new Error(`Invalid date: ${date}`);
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
};

const formatDate = (date: Date) => date.toISOString().slice(0, 10);

const daysInMonth = (year: number, month: number) =>
  new Date(Date.UTC(year, month, 0)).getUTCDate();

const addMonths = (date: string, months: number) => {
  const parsed = parseDate(date);
  const monthIndex = parsed.month - 1 + months;
  const year = parsed.year + Math.floor(monthIndex / 12);
  const month = ((monthIndex % 12) + 12) % 12;
  const day = Math.min(parsed.day, daysInMonth(year, month + 1));
  return formatDate(new Date(Date.UTC(year, month, day)));
};

const addYears = (date: string, years: number) => {
  const parsed = parseDate(date);
  const year = parsed.year + years;
  const day = Math.min(parsed.day, daysInMonth(year, parsed.month));
  return formatDate(new Date(Date.UTC(year, parsed.month - 1, day)));
};

/**
 * Source: https://developer.ordergroove.com/docs/data-model-at-a-glance
 * The period mapping is documented. UTC arithmetic and month-end clamping are
 * simulator-only conventions because overflow and timezone behavior are unknown.
 */
export const addRecurrence = (
  date: string,
  every: number,
  period: RecurrencePeriod,
) => {
  if (!Number.isInteger(every) || every < 1) {
    throw new Error("Recurrence interval must be a positive integer");
  }
  if (period === 3) return addMonths(date, every);
  if (period === 4) return addYears(date, every);

  const parsed = parseDate(date);
  const days = period === 2 ? every * 7 : every;
  return formatDate(
    new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day + days)),
  );
};
