import { defineStore } from 'pinia';
import type { FileConverter } from '../types/Converter.ts';

export const useConverterStore = defineStore('converter', {
  state: () => ({
    fileConverterMap: new Map<string, FileConverter>(),
  }),
  getters: {
    fileConverter(state): FileConverter[] {
      return Array.from(state.fileConverterMap.values());
    },
  },
  actions: {
    addFileConverter(key: string, converter: FileConverter) {
      this.fileConverterMap.set(key, converter);
    },
    removeFileConverter(key: string) {
      this.fileConverterMap.delete(key);
    },
  },
});
