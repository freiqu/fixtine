import type { ConversionState } from './conversionState.ts';

export type ConversionFileType = {
  originalFile: File;
  conversionState: ConversionState;
  url?: string;
  newFile?: File;
  detectedEncoding?: string;
  content?: string;
};

export class ConversionFile implements ConversionFileType {
  conversionState: ConversionState;
  originalFile: File;
  url?: string;
  newFile?: File;
  detectedEncoding?: string;
  content?: string;

  constructor({
    conversionState,
    originalFile,
    url,
    newFile,
    detectedEncoding,
    content,
  }: ConversionFileType) {
    this.conversionState = conversionState;
    this.originalFile = originalFile;
    this.url = url;
    this.newFile = newFile;
    this.detectedEncoding = detectedEncoding;
    this.content = content;
  }
}

export class DecodedConversionFile extends ConversionFile {
  detectedEncoding: string;
  content: string;

  constructor({
    detectedEncoding,
    content,
    ...rest
  }: Omit<ConversionFileType, 'content' | 'detectedEncoding'> & {
    detectedEncoding: string;
    content: string;
  }) {
    super(rest);
    this.detectedEncoding = detectedEncoding;
    this.content = content;
  }
}

export class DoneConversionFile extends DecodedConversionFile {
  newFile: File;
  url: string;

  constructor({
    newFile,
    url,
    ...rest
  }: Omit<
    ConversionFileType,
    'content' | 'detectedEncoding' | 'url' | 'newFile'
  > & {
    detectedEncoding: string;
    content: string;
    newFile: File;
    url: string;
  }) {
    super(rest);
    this.newFile = newFile;
    this.url = url;
  }
}
