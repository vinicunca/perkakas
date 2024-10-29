<script lang="ts" setup>
defineProps<{
  tag: string;
}>();

const tagToClass: Record<string, string> = {
  indexed: 'bg-sky-600 text-sky-50 dark:bg-sky-500 dark:text-sky-950',
  pipeable: 'bg-green-600 text-green-50 dark:bg-green-500 dark:text-green-950',
  strict: 'bg-rose-600 text-rose-50 dark:bg-rose-500 dark:text-rose-950',
};
</script>

<template>
  <PerkakasBadge
    :class="[
      tagToClass[tag],
    ]"
  >
    {{ tag }}
  </PerkakasBadge>
</template>
