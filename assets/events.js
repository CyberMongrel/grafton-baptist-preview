export function sydneyDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Sydney', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(now);
  const value = type => parts.find(part => part.type === type).value;
  return `${value('year')}-${value('month')}-${value('day')}`;
}

export function partitionEvents(events, date) {
  return {
    upcoming: events.filter(event => event.date >= date),
    past: events.filter(event => event.date < date)
  };
}

export function displayDate(date) {
  return new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Sydney', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  }).format(new Date(`${date}T12:00:00+11:00`));
}

export function displayTime(time) {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new Error('Event time must use HH:MM.');
  const [hour, minute] = time.split(':').map(Number);
  return `${hour % 12 || 12}:${String(minute).padStart(2, '0')}${hour < 12 ? 'am' : 'pm'}`;
}
