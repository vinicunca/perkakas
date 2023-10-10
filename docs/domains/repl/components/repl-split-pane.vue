<script lang="ts" setup>
const container = ref();

const state = reactive({
  dragging: false,
  split: 50,
});

const boundSplit = computed(() => {
  const { split } = state;

  if (split < 20) {
    return 20;
  }

  if (split > 80) {
    return 80;
  }

  return split;
});

let startPosition = 0;
let startSplit = 0;

function dragStart(event: MouseEvent) {
  state.dragging = true;
  startPosition = event.pageX;
  startSplit = boundSplit.value;
}

function dragMove(event: MouseEvent) {
  if (state.dragging) {
    const position = event.pageX;
    const totalSize = container.value.offsetWidth;
    const dp = position - startPosition;
    state.split = startSplit + ~~((dp / totalSize) * 100);
  }
}

function dragEnd() {
  state.dragging = false;
}
</script>

<template>
  <div
    ref="container"
    class="flex relative grow-1"
    :class="{
      'cursor-ew-resize': state.dragging,
    }"
    @mousemove="dragMove"
    @mouseup="dragEnd"
    @mouseleave="dragEnd"
  >
    <div
      class="relative border-r border-$vd-c-divider"
      :class="{
        'pointer-events-none': state.dragging,
      }"
      :style="{ width: `${boundSplit}%` }"
    >
      <slot name="left" />

      <div
        class="absolute z-30 top-0 bottom-0 right-[-5px] w-[10px] cursor-ew-resize"
        @mousedown.prevent="dragStart"
      />
    </div>

    <div
      class="relative"
      :class="{
        'pointer-events-none': state.dragging,
      }"
      :style="{ width: `${100 - boundSplit}%` }"
    >
      <slot name="right" />
    </div>
  </div>
</template>
