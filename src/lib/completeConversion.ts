import {
  type DecodedConversionFile,
  DoneConversionFile,
} from '../types/conversionFiles.ts';

const encoder = new TextEncoder();

export function completeConversion(
  file: DecodedConversionFile,
): DoneConversionFile {
  const newFileName = `new-${file.originalFile.name}`;
  const newFile = new File([encoder.encode(file.content)], newFileName);
  const url = URL.createObjectURL(newFile);
  return new DoneConversionFile({
    ...file,
    conversionState: 'done',
    newFile,
    url,
  });
}
