export const generateICS = (title: string, dateStr: string, timeStr: string, description: string, location: string) => {
    // Parse Date (YYYY-MM-DD)
    const [year, month, day] = dateStr.split('-').map(Number);

    // Parse Time from string like "巳时 (09:00-11:00)"
    // Regex to extract HH:MM part
    const timeMatch = timeStr.match(/(\d{2}:\d{2})-(\d{2}:\d{2})/);
    let startHour = 9, startMin = 0;
    let endHour = 11, endMin = 0;

    if (timeMatch) {
        const [_, start, end] = timeMatch;
        [startHour, startMin] = start.split(':').map(Number);
        [endHour, endMin] = end.split(':').map(Number);
    }

    // Create Date objects (Local time)
    // Note: ICS usually expects UTC or defined timezones. 
    // To simplify for this web app running in user's browser, strict UTC is safest if we assume user is in their timezone, 
    // BUT converting local browser time to UTC string for ICS is specific.
    // Let's manually format to YYYYMMDDTHHMMSS format string.

    // Formatting helper
    const formatICSDate = (y: number, m: number, d: number, h: number, min: number) => {
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${y}${pad(m)}${pad(d)}T${pad(h)}${pad(min)}00`;
    };

    const dtStart = formatICSDate(year, month, day, startHour, startMin);
    const dtEnd = formatICSDate(year, month, day, endHour, endMin);

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//TaoistFortuneCalculator//CN',
        'BEGIN:VEVENT',
        `DTSTART;TZID=Asia/Shanghai:${dtStart}`,
        `DTEND;TZID=Asia/Shanghai:${dtEnd}`,
        // Note: TZID is tricky without VTIMEZONE definition. 
        // Using "floating time" (no Z, no TZID) is risky as it depends on client calendar setting.
        // Let's try floating time for simplicity? No, that can be confusing.
        // Or assume user input is local. 
        // Safer: DTSTART:${dtStart} (floating) -> interpreted as local time of the device opening it.
        // Given this is a local tool, floating time is likely what the user expects (9am their time).
        // Let's remove TZID for floating time.
        `SUMMARY:${title}`,
        `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
        `LOCATION:${location}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n').replace(/DTSTART;TZID=Asia\/Shanghai:/g, 'DTSTART:').replace(/DTEND;TZID=Asia\/Shanghai:/g, 'DTEND:');
    // Applying floating time correction directly

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${title}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
