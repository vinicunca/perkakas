<script lang="ts" setup>
import { useData } from 'vitepress';

import { getTags } from '../data/perkakas.utils';

/**
 * The page data is modified in `.vitepress/perkakas/perkakas.mapping.ts` file.
 */
const { page } = useData()
</script>

<template>
  <template v-for="fun in page.functions" :key="fun.name">
    <h2 :id="fun.name" tabindex="-1">
      <code>{{ fun.name }}</code>
      <a :href="`#${fun.name}`" class="header-anchor" :aria-label="`Permalink to ${fun.name}`">
        &ZeroWidthSpace;
      </a>
    </h2>

    <div v-html="fun.description" />

    <div class="flex flex-col gap-y-1.5">
      <!-- Header -->
      <div class="flex items-center gap-2 mb-4">
        <!-- Badge -->
        <PerkakasBadge class="bg-$vp-c-badge-primary text-white ">
          {{ fun.category }}
        </PerkakasBadge>

        <!-- Tags -->
        <PerkakasTags v-for="tag in getTags(fun)" :key="tag" :tag="tag" />

        <!-- Github -->
        <a :href="fun.sourceUrl" target="_blank" class="inline-flex items-center justify-center vpi-social-github"
          title="View source on Github" style="--icon: url(https://api.iconify.design/simple-icons/github.svg)">
          <span class="sr-only">View source on GitHub</span>
        </a>
      </div>

      <!-- Methods -->
      <div v-for="(method, idx) in fun.methods" :key="`method-${fun.name}-${idx}`" class="flex flex-col gap-2">
        <p class="m-0! font-bold">
          {{ method.tag }}
        </p>

        <div v-html="method.signature" />

        <PerkakasParameters :args="method.args" :returns="method.returns" />

        <div v-html="method.example" />
      </div>
    </div>
  </template>
</template>
