import {
  type ConversionFileType,
  DecodedConversionFile,
} from '../types/conversionFiles.ts';
import { allEncodings } from './allEncodings.ts';
import type { Encoding } from '../types/encoding.ts';

export async function decodeICS(
  file: ConversionFileType,
): Promise<DecodedConversionFile> {
  let encoding: Encoding = 'unknown';
  let content = '';
  for (let i = 0; i < allEncodings.length; i++) {
    encoding = allEncodings[i]!;
    const decoder = new TextDecoder(encoding);
    content = decoder.decode(await file.originalFile.arrayBuffer());
    if (content.includes('VCALENDAR')) break;
  }
  return new DecodedConversionFile({
    ...file,
    detectedEncoding: encoding,
    content,
  });
}
