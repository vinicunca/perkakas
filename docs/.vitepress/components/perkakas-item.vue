<script lang="ts" setup>
import { useData } from 'vitepress';

import { getTags } from '../perkakas/perkakas.utils';

const { page } = useData();
</script>

<template>
  <div class="flex flex-col gap-y-1.5">
    <!-- Header -->
    <div class="flex items-center gap-2 mb-4">
      <!-- Badge -->
      <PerkakasBadge class="bg-$vp-c-badge-primary text-white ">
        {{ page.func.category }}
      </PerkakasBadge>

      <!-- Tags -->
      <PerkakasTags
        v-for="tag in getTags(page.func)"
        :key="tag"
        :tag="tag"
      />

      <!-- Github -->
      <a
        :href="page.func.sourceUrl"
        target="_blank"
        class="inline-flex items-center justify-center vpi-social-github"
        title="View source on Github"
      >
        <span class="sr-only">View source on GitHub</span>
      </a>
    </div>

    <!-- Methods -->
    <div
      v-for="(method, idx) in page.func.methods"
      :key="`method-${page.func.name}-${idx}`"
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
