import type { FileConverter } from '../../types/Converter.ts';
import type { DecodedConversionFile } from '../../types/conversionFiles.ts';

const timezone = `BEGIN:VTIMEZONE
TZID:Europe/Berlin
LAST-MODIFIED:20250410T142247Z
TZURL:https://www.tzurl.org/zoneinfo-outlook/Europe/Berlin
X-LIC-LOCATION:Europe/Berlin
BEGIN:DAYLIGHT
TZNAME:CEST
TZOFFSETFROM:+0100
TZOFFSETTO:+0200
DTSTART:19700329T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU
END:DAYLIGHT
BEGIN:STANDARD
TZNAME:CET
TZOFFSETFROM:+0200
TZOFFSETTO:+0100
DTSTART:19701025T030000
RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU
END:STANDARD
END:VTIMEZONE`;

export class FixUhhTimeZoneConverter implements FileConverter {
  convert(file: DecodedConversionFile): DecodedConversionFile {
    const newContent = file.content
      .replace(/BEGIN:VTIMEZONE.*END:VTIMEZONE/gs, timezone)
      .replace(/(?<=DT(END|START));TZID=CampusNetZeit/g, '');
    return { ...file, content: newContent };
  }
}
