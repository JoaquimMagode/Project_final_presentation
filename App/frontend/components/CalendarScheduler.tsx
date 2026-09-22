import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

export interface CalendarSchedulerProps {
  /** Time slots to show in the grid (display labels). */
  timeSlots?: string[];
  /** Controlled selected date. */
  date?: Date;
  /** Controlled selected time (must match a value in timeSlots). */
  time?: string;
  /** Disable dates before today. Defaults to true. */
  disablePast?: boolean;
  onChange?: (value: { date?: Date; time?: string }) => void;
}

const DEFAULT_SLOTS = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
];

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const sameDay = (a?: Date, b?: Date) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const CalendarScheduler: React.FC<CalendarSchedulerProps> = ({
  timeSlots = DEFAULT_SLOTS,
  date,
  time,
  disablePast = true,
  onChange,
}) => {
  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);
  const [viewMonth, setViewMonth] = useState(() => (date ?? new Date()));

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();

  // Build the calendar grid (leading blanks + days of month)
  const cells = useMemo(() => {
    const firstDow = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const arr: (Date | null)[] = [];
    for (let i = 0; i < firstDow; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(new Date(year, month, d));
    return arr;
  }, [year, month]);

  const goMonth = (delta: number) => setViewMonth(new Date(year, month + delta, 1));

  const pickDate = (d: Date) => onChange?.({ date: d, time });
  const pickTime = (t: string) => onChange?.({ date, time: t });

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* ── Calendar ── */}
      <div className="flex-1 border border-gray-200 rounded-xl p-3">
        {/* Month header */}
        <div className="flex items-center justify-between mb-2">
          <button type="button" onClick={() => goMonth(-1)}
            className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold text-gray-900">{MONTHS[month]} {year}</span>
          <button type="button" onClick={() => goMonth(1)}
            className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Weekday row */}
        <div className="grid grid-cols-7 mb-1">
          {WEEKDAYS.map(w => (
            <div key={w} className="h-8 flex items-center justify-center text-[11px] font-medium text-gray-400">{w}</div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-0.5">
          {cells.map((d, i) => {
            if (!d) return <div key={`b-${i}`} className="h-9" />;
            const isSelected = sameDay(d, date);
            const isToday = sameDay(d, today);
            const disabled = disablePast && d < today;
            return (
              <button
                key={d.toISOString()}
                type="button"
                disabled={disabled}
                onClick={() => pickDate(d)}
                className={`h-9 w-full rounded-lg text-sm font-medium transition-colors
                  ${isSelected
                    ? 'bg-emerald-600 text-white'
                    : disabled
                    ? 'text-gray-300 cursor-not-allowed'
                    : isToday
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    : 'text-gray-700 hover:bg-gray-100'}`}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Time slots ── */}
      <div className="flex-1 border border-gray-200 rounded-xl p-3 overflow-y-auto max-h-[320px]">
        <p className="mb-2 text-sm font-medium text-gray-500 flex items-center gap-1.5">
          <Clock className="w-4 h-4" /> Pick a time
        </p>
        <div className="grid grid-cols-2 gap-2">
          {timeSlots.map(slot => {
            const active = time === slot;
            return (
              <button
                key={slot}
                type="button"
                onClick={() => pickTime(slot)}
                className={`w-full py-2 rounded-lg text-sm font-semibold border transition-colors
                  ${active
                    ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-500/40'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'}`}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { CalendarScheduler };
export default CalendarScheduler;
