import type { FileConverter } from '../../types/Converter.ts';
import type { DecodedConversionFile } from '../../types/conversionFiles.ts';

export class RemoveGlobalTimezoneConverter implements FileConverter {
  convert(file: DecodedConversionFile): DecodedConversionFile {
    return file;
  }
}
