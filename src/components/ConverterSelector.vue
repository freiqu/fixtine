<script lang="ts">
import { defineComponent } from 'vue';
import { FixUhhTimeZoneConverter } from '../lib/converter/fixUhhTimeZoneConverter.ts';
import { useConverterStore } from '../stores/useConverterStore.ts';

export default defineComponent({
  name: 'ConverterSelector',
  data: () => ({
    converterStore: useConverterStore(),
    converter: [
      {
        key: 'removeGlobalTimezoneConfig',
        converter: new FixUhhTimeZoneConverter(),
      },
    ],
    uhhSpecificConverters: [
      {
        key: 'fixUhhTimeZone',
        converter: new FixUhhTimeZoneConverter(),
      },
    ],
  }),
});
</script>

<template>
  <Card>
    <template #title>{{ $t('converterSelector.title') }}</template>
    <template #content>
      <div class="flex flex-row gap-2" v-for="converter in converter">
        <ToggleSwitch
          @valueChange="
            (value: boolean) => {
              if (value) {
                converterStore.addFileConverter(
                  converter.key,
                  converter.converter,
                );
              } else {
                converterStore.removeFileConverter(converter.key);
              }
            }
          "
        />
        <span>{{ $t(`fileConverter.${converter.key}`) }}</span>
      </div>
      <h1>{{ $t('converterSelector.uhhSpecificConverters') }}</h1>
      <div
        class="flex flex-row gap-2"
        v-for="converter in uhhSpecificConverters"
      >
        <ToggleSwitch
          @valueChange="
            (value: boolean) => {
              if (value) {
                converterStore.addFileConverter(
                  converter.key,
                  converter.converter,
                );
              } else {
                converterStore.removeFileConverter(converter.key);
              }
            }
          "
        />
        <span>{{ $t(`fileConverter.${converter.key}`) }}</span>
      </div>
    </template>
  </Card>
</template>
