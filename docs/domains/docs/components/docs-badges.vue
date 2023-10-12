<script lang="ts" setup>
defineProps<{
  badges: string[];
}>();
</script>

<template>
  <div>
    {{ badges }}
  </div>
</template>
