<script lang="ts">
import { defineComponent } from 'vue';
import type { FileUploadRemoveEvent, FileUploadSelectEvent } from 'primevue';

type ConversionState = 'open' | 'converting' | 'done' | 'error';
type ConvertFile = {
  originalFile: File;
  conversionState: ConversionState;
  name: string;
  url?: string;
  newFile?: File;
};

export default defineComponent({
  name: 'App',
  data: () => ({
    files: [] as ConvertFile[],
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
      const decoder = new TextDecoder('utf-16le');
      const encoder = new TextEncoder();
      this.files.forEach(async (curFile) => {
        if (curFile.conversionState !== 'open') return;
        curFile.conversionState = 'converting';
        const originalFile = curFile.originalFile;
        const text = decoder.decode(await originalFile.arrayBuffer());
        const newFileName = `new-${originalFile.name}`;
        const newFile = new File([encoder.encode(text)], newFileName);
        curFile.url = URL.createObjectURL(newFile);
        curFile.conversionState = 'done';
        curFile.newFile = newFile;
      });
    },
    updateCount({ files }: FileUploadRemoveEvent | FileUploadSelectEvent) {
      const fileArr = files as File[];
      this.files.push(
        ...fileArr
          .filter((file) => !this.files.some((f) => f.originalFile === file))
          .map(
            (file): ConvertFile => ({
              originalFile: file,
              conversionState: 'open',
              name: file.name.replace('.ics', ''),
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
              :label="$t('download_all')"
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
        <DataTable v-if="files.length > 0" :value="files">
          <Column field="name" :header="$t('table.header.file')">
            <template #body="{ data }: { data: ConvertFile }">
              <div class="flex flex-row gap-1">
                <i class="pi pi-file text-2xl" />
                <span> {{ data.originalFile.name }} </span>
              </div>
            </template>
          </Column>
          <Column :header="$t('table.header.state')">
            <template #body="{ data }: { data: ConvertFile }">
              <Tag
                :value="$t(`conversion_state.${data.conversionState}`)"
                :severity="getStateSeverity(data.conversionState)"
              />
            </template>
          </Column>
          <Column :header="$t('table.header.actions')" class="w-1">
            <template
              #body="{ data, index }: { data: ConvertFile; index: number }"
            >
              <div class="flex flex-row gap-2 justify-content-end">
                <Button
                  v-if="data.conversionState !== 'done'"
                  :icon="
                    data.conversionState === 'converting'
                      ? 'pi pi-spin pi-spinner'
                      : 'pi pi-download'
                  "
                  rounded
                  disabled
                />
                <Button
                  v-else
                  as="a"
                  icon="pi pi-download"
                  :href="data.url"
                  :download="data.newFile?.name"
                  rounded
                >
                </Button>
                <Button
                  icon="pi pi-times"
                  rounded
                  severity="danger"
                  @click="removeFileCallback(index)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </FileUpload>
  </main>
</template>

<style></style>
