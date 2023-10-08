<script lang="ts" setup>
import { type FunctionsData } from '~~/scripts/transform';

const props = defineProps<{
  method: FunctionsData[number]['methods'][number];
}>();
</script>

<template>
  <div class="mt-1 flex flex-col items-start">
    <div
      v-if="method.tag"
      class="bg-$vd-c-bg-alt inline-block rounded-1 font-700 text-size-[75%] px-[0.4em]"
    >
      {{ method.tag }}
    </div>

    <div>
      {{ method.signature }}
    </div>
  </div>
</template>
