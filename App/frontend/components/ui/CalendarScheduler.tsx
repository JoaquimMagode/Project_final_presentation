import * as React from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, Clock } from 'lucide-react';

/**
 * CalendarScheduler
 * -----------------
 * A self-contained month calendar + time-slot picker built to match this
 * project's stack (CDN Tailwind + emerald design tokens, no shadcn / Radix).
 *
 * It is a controlled component:
 *   - `date`  : selected day as an ISO string `YYYY-MM-DD` (or '')
 *   - `time`  : selected time as `HH:mm` (24h, or '')
 *   - `onDateChange` / `onTimeChange` : setters
 *
 * `timeSlots` are provided as 24h `HH:mm` values and rendered in local
 * 12h format so the underlying form value stays consistent with the API.
 */

export interface CalendarSchedulerProps {
  date?: string;                    // 'YYYY-MM-DD'
  time?: string;                    // 'HH:mm'
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  timeSlots?: string[];             // 24h 'HH:mm'
  /** Disable days before today. Defaults to true. */
  disablePast?: boolean;
  className?: string;
}

const DEFAULT_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
];

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Local YYYY-MM-DD (avoids UTC off-by-one from toISOString). */
function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseISODate(s?: string): Date | undefined {
  if (!s) return undefined;
  const [y, m, d] = s.split('-').map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

function to12h(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(hour12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
}

function sameDay(a?: Date, b?: Date): boolean {
  return !!a && !!b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

export function CalendarScheduler({
  date,
  time,
  onDateChange,
  onTimeChange,
  timeSlots = DEFAULT_SLOTS,
  disablePast = true,
  className = '',
}: CalendarSchedulerProps) {
  const selected = parseISODate(date);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Which month the calendar is currently showing.
  const [view, setView] = React.useState<Date>(() => {
    const base = selected ?? new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const year = view.getFullYear();
  const month = view.getMonth();

  const firstWeekday = new Date(year, month, 1).getDay();      // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const goPrev = () => setView(new Date(year, month - 1, 1));
  const goNext = () => setView(new Date(year, month + 1, 1));

  const isDisabled = (d: Date) => disablePast && d < today;

  return (
    <div className={`flex flex-col md:flex-row gap-4 ${className}`}>
      {/* ── Calendar ── */}
      <div className="flex-1 border border-gray-200 rounded-xl p-3 bg-white">
        {/* Month header */}
        <div className="flex items-center justify-between px-1 pb-2">
          <button
            type="button"
            onClick={goPrev}
            className="h-7 w-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold text-gray-900">
            {MONTHS[month]} {year}
          </span>
          <button
            type="button"
            onClick={goNext}
            className="h-7 w-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Weekday row */}
        <div className="grid grid-cols-7 mb-1">
          {WEEKDAYS.map(w => (
            <div key={w} className="h-8 flex items-center justify-center text-[0.7rem] font-medium text-gray-400">
              {w}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((d, i) => {
            if (!d) return <div key={`e-${i}`} className="h-9" />;
            const disabled = isDisabled(d);
            const isSelected = sameDay(d, selected);
            const isToday = sameDay(d, today);
            return (
              <div key={toISODate(d)} className="h-9 flex items-center justify-center">
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onDateChange(toISODate(d))}
                  className={[
                    'h-9 w-9 rounded-full text-sm font-normal transition-colors',
                    disabled
                      ? 'text-gray-300 cursor-not-allowed'
                      : isSelected
                        ? 'bg-emerald-600 text-white hover:bg-emerald-600'
                        : isToday
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'text-gray-700 hover:bg-gray-100',
                  ].join(' ')}
                >
                  {d.getDate()}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Time slots ── */}
      <div className="flex-1 border border-gray-200 rounded-xl p-3 bg-white overflow-y-auto max-h-[320px]">
        <p className="mb-2 text-sm font-medium text-gray-500 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-emerald-600" /> Pick a time
        </p>
        {!date && (
          <p className="text-xs text-gray-400 mb-2 flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5" /> Select a date first
          </p>
        )}
        <div className="grid grid-cols-2 gap-2">
          {timeSlots.map(slot => {
            const isActive = time === slot;
            return (
              <button
                key={slot}
                type="button"
                disabled={!date}
                onClick={() => onTimeChange(slot)}
                className={[
                  'w-full h-9 rounded-md text-sm font-medium border transition-colors disabled:opacity-40 disabled:cursor-not-allowed',
                  isActive
                    ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-500 ring-offset-1'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-emerald-300',
                ].join(' ')}
              >
                {to12h(slot)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CalendarScheduler;
