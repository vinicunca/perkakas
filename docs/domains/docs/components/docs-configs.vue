<script lang="ts" setup>
import DataMethod from '~/domains/data/components/data-method.vue';
import DataTitle from '~/domains/data/components/data-title.vue';
import { type FunctionsData } from '~~/scripts/transform';

defineProps<{
  metaDocs: FunctionsData;
}>();
</script>

<template>
  <div class="flex flex-col gap-4">
    <div
      v-for="doc in metaDocs"
      :key="doc.name"
    >
      <div class="rounded-1 flex flex-col border border-$vd-c-gray-1">
        <a :id="doc.name" />

        <div class="p-4 flex-auto">
          <DataTitle
            :name="doc.name"
            :methods="doc.methods[0]"
          />

          <div
            class="not-prose mt-1"
            v-html="doc.description"
          />

          <DataMethod
            v-for="(method, idx) in doc.methods"
            :key="idx"
            :method="method"
          />
        </div>
      </div>
    </div>
  </div>
</template>
