<script lang="ts" setup>
import { useData } from 'vitepress';

const props = defineProps<{
  name: string;
}>();

/**
 * The page data is modified in `.vitepress/perkakas/perkakas.mapping.ts` file.
 */
const { page } = useData();

const data = page.value.functions.find((fun) => fun.name === props.name);
</script>

<template>
  <div
    v-if="data"
    v-html="data.description"
  />
</template>
