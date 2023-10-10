<script lang="ts" setup>
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from 'radix-vue';

defineProps<{
  params: Array<{
    name: string;
    description: string;
  }>;
  returns: {
    name: string;
  };
}>();

const isOpen = ref(false);

const buttonTitle = computed(() => isOpen.value ? 'Hide Parameters' : 'Show Parameters');
</script>

<template>
  <CollapsibleRoot
    v-model:open="isOpen"
    class="mt-4"
  >
    <CollapsibleTrigger
      class="group flex items-center border border-$vd-c-border rounded-2 px-3 py-1 text-sm font-500 leading-6 transition-colors-280 data-[state=open]:text-$vd-c-brand-1 hover:text-$vd-c-brand-1"
    >
      {{ buttonTitle }}

      <i class="i-radix-icons:chevron-right ml-1 transition-transform-280 group-data-[state=open]:rotate-90" />
    </CollapsibleTrigger>

    <CollapsibleContent
      class="mt-3 overflow-hidden data-[state=closed]:animate-collapsible-slide-up data-[state=open]:animate-collapsible-slide-down"
    >
      <div class="flex flex-col items-start gap-2">
        <h4>Parameters</h4>

        <div
          v-for="param in params"
          :key="param.name"
          class="inline-flex items-center gap-1"
        >
          <code>{{ param.name }}</code>

          <span>{{ param.description }}</span>
        </div>

        <h4>Returns</h4>

        <code>{{ returns.name }}</code>
      </div>
    </CollapsibleContent>
  </CollapsibleRoot>
</template>
