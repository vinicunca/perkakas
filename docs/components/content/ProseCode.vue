<script lang="ts" setup>
defineProps({
  code: {
    type: String,
    default: '',
  },
  language: {
    type: String,
    default: null,
  },
  filename: {
    type: String,
    default: null,
  },
  highlights: {
    type: Array as () => number[],
    default: () => [],
  },
  meta: {
    type: String,
    default: null,
  },
});
</script>

<template>
  <div
    class="relative overflow-x-auto bg-$vd-code-tab-bg my-5 mx-[-999rem] px-[999rem]"
    :class="[
      `language-${language}`,
    ]"
  >
    <slot />
  </div>
</template>

<style lang="postcss">
pre code {
  counter-reset: step;
  counter-increment: step 0;

  .line {
    display: block;
    min-height: 1rem;
  }
}
</style>

