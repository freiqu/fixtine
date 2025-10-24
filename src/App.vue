<script lang="ts">
import { defineComponent } from 'vue';
import type { FileUploadRemoveEvent, FileUploadSelectEvent } from 'primevue';
import type { ConversionState } from './types/conversionState.ts';
import { type ConversionFileType } from './types/conversionFiles.ts';
import { completeConversion } from './lib/completeConversion.ts';
import { decodeICS } from './lib/decodeICS.ts';
import FileTable from './components/FileTable.vue';
import ConverterSelector from './components/ConverterSelector.vue';
import { useConverterStore } from './stores/useConverterStore.ts';

export default defineComponent({
  name: 'App',
  components: { ConverterSelector, FileTable },
  data: () => ({
    files: [] as ConversionFileType[],
    converterStore: useConverterStore(),
  }),
  computed: {
    showDownloadAll() {
      return (
        this.files.length > 0 &&
        this.files.every((value) => value.conversionState === 'done')
      );
    },
  },
  methods: {
    onConvert() {
      this.files.forEach(async (curFile, index) => {
        curFile.conversionState = 'converting';
        let decodedFile = await decodeICS(curFile);
        this.files[index] = decodedFile;
        for (
          let i = this.converterStore.fileConverter.length - 1;
          i >= 0;
          i--
        ) {
          const converter = this.converterStore.fileConverter[i]!;
          decodedFile = converter.convert(decodedFile);
          this.files[index] = decodedFile;
        }
        this.files[index] = completeConversion(decodedFile);
      });
    },
    updateCount({ files }: FileUploadRemoveEvent | FileUploadSelectEvent) {
      const fileArr = files as File[];
      this.files.push(
        ...fileArr
          .filter((file) => !this.files.some((f) => f.originalFile === file))
          .map(
            (file): ConversionFileType => ({
              originalFile: file,
              conversionState: 'open',
            }),
          ),
      );
      this.files = this.files.filter((file) =>
        fileArr.includes(file.originalFile),
      );
    },
    onClear() {
      this.files = [];
    },
    downloadAll() {
      this.files.forEach(({ url, newFile, conversionState }) => {
        if (conversionState !== 'done') return;
        const downloadLink = document.createElement('a');
        downloadLink.href = url!;
        downloadLink.download = newFile!.name;
        document.body.appendChild(downloadLink);
        downloadLink.click();
      });
    },
    getStateSeverity(state: ConversionState) {
      switch (state) {
        case 'converting':
          return 'warning';
        case 'done':
          return 'success';
        case 'error':
          return 'danger';
        case 'open':
          return 'info';
      }
    },
  },
});
</script>

<template>
  <main>
    <FileUpload
      :upload-label="$t('convert')"
      accept="text/calendar"
      multiple
      @select="updateCount"
      @remove="updateCount"
      @clear="onClear"
    >
      <template #header="{ chooseCallback, clearCallback }">
        <div class="flex flex-row justify-between w-full">
          <div class="flex gap-2">
            <Button
              :label="$t('coose')"
              icon="pi pi-plus"
              @click="chooseCallback()"
            />
            <Button
              :label="$t('convert')"
              icon="pi pi-wrench"
              severity="secondary"
              :disabled="files.length === 0"
              @click="onConvert()"
            />
            <Button
              :label="$t('cancel')"
              icon="pi pi-times"
              severity="secondary"
              :disabled="files.length === 0"
              @click="clearCallback()"
            />
          </div>
          <div class="flex gap-2">
            <Button
              v-if="showDownloadAll"
              icon="pi pi-download"
              :label="$t('downloadAll')"
              @click="downloadAll()"
            />
          </div>
        </div>
      </template>

      <template #empty>
        <div class="flex items-center justify-center flex-col">
          <i
            class="pi pi-cloud-upload !border-2 !rounded-full !p-8 !text-4xl !text-muted-color"
          />
          <p class="mt-6 mb-0">Drag and drop files to here to upload.</p>
        </div>
      </template>
      <template #content="{ removeFileCallback }">
        <FileTable :conversionFiles="files" @removeFile="removeFileCallback" />
      </template>
    </FileUpload>
    <ConverterSelector></ConverterSelector>
  </main>
</template>

<style></style>
