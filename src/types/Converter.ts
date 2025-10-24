import type { DecodedConversionFile } from './conversionFiles.ts';

export interface FileConverter {
  convert(file: DecodedConversionFile): DecodedConversionFile;
}
