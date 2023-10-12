<script lang="ts" setup>
import { type FunctionsData } from '~~/scripts/transform';

const props = defineProps<{
  name: string;
  methods: FunctionsData[number]['methods'][number];
}>();

const badgeMeta = computed(() => {
  let showBadge = true;
  let badgeText = '';
  let bgColor = '';

  const methods = props.methods;

  if (methods.indexed) {
    badgeText = 'indexed';
    bgColor = 'bg-[#FF9800]';
  } else if (methods.pipeable) {
    badgeText = 'pipeable';
    bgColor = 'bg-[#9C27B0]';
  } else if (methods.strict) {
    badgeText = 'strict';
    bgColor = 'bg-[#F44336]';
  } else {
    showBadge = false;
  }

  return {
    showBadge,
    badgeText,
    bgColor,
  };
});
</script>

<template>
  <h3 class="m-0 text-size-[1.75rem] inline-flex items-center gap-2">
    {{ name }}

    <small v-if="badgeMeta.showBadge">
      <span
        class="text-white inline-block rounded-1 font-700 text-size-[75%] px-[0.4em]"
        :class="badgeMeta.bgColor"
      >
        {{ badgeMeta.badgeText }}
      </span>
    </small>
  </h3>
</template>
