<script lang="ts" setup>
import { useData } from 'vitepress';

import { getTags } from '../data/perkakas.utils';

const props = defineProps<{
  name: string;
}>();

/**
 * The page data has been modified in `.vitepress/perkakas/perkakas.mapping.ts` file.
 */
const { page } = useData();

const data = page.value.functions.find((fun) => fun.name === props.name);
</script>

<template>
  <div
    v-if="data"
    class="flex flex-col gap-y-1.5"
  >
    <!-- Header -->
    <div class="flex items-center gap-2 mb-4">
      <!-- Badge -->
      <PerkakasBadge class="bg-$vp-c-badge-primary text-white ">
        {{ data.category }}
      </PerkakasBadge>

      <!-- Tags -->
      <PerkakasTags
        v-for="tag in getTags(data)"
        :key="tag"
        :tag="tag"
      />

      <!-- Github -->
      <a
        :href="data.sourceUrl"
        target="_blank"
        class="inline-flex items-center justify-center vpi-social-github"
        title="View source on Github"
      >
        <span class="sr-only">View source on GitHub</span>
      </a>
    </div>

    <!-- Methods -->
    <div
      v-for="(method, idx) in data.methods"
      :key="`method-${data.name}-${idx}`"
      class="flex flex-col gap-2"
    >
      <p class="m-0! font-bold">
        {{ method.tag }}
      </p>

      <div
        v-html="method.signature"
      />

      <PerkakasParameters
        :args="method.args"
        :returns="method.returns"
      />

      <div
        v-html="method.example"
      />
    </div>
  </div>
</template>
