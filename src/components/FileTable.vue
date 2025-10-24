<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { ConversionFileType } from '../types/conversionFiles.ts';
import type { ConversionState } from '../types/conversionState.ts';

export default defineComponent({
  name: 'FileTable',
  props: {
    conversionFiles: {
      type: Array as PropType<ConversionFileType[]>,
      required: true,
    },
  },
  emits: {
    removeFile: (() => true) as (index: number) => void,
  },
  methods: {
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
  <DataTable v-if="conversionFiles.length > 0" :value="conversionFiles">
    <Column field="name" :header="$t('table.header.file')">
      <template #body="{ data }: { data: ConversionFileType }">
        <div class="flex flex-row gap-1">
          <i class="pi pi-file text-2xl" />
          <span> {{ data.originalFile.name }} </span>
        </div>
      </template>
    </Column>
    <Column :header="$t('table.header.encoding')">
      <template #body="{ data }: { data: ConversionFileType }">
        <Tag v-if="data.detectedEncoding" :value="data.detectedEncoding" />
      </template>
    </Column>
    <Column :header="$t('table.header.state')">
      <template #body="{ data }: { data: ConversionFileType }">
        <Tag
          :value="$t(`conversionState.${data.conversionState}`)"
          :severity="getStateSeverity(data.conversionState)"
        />
      </template>
    </Column>
    <Column :header="$t('table.header.actions')" class="w-1">
      <template
        #body="{ data, index }: { data: ConversionFileType; index: number }"
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
            @click="$emit('removeFile', index)"
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<style scoped></style>
