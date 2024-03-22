<script lang="ts" setup>
import { flatten, pipe, values } from '@vinicunca/perkakas';

import { getTags } from '../utils/get-tags';
import { data } from './perkakas.data';

const functions = pipe(
  data,
  values,
  flatten(),
);
</script>

<template>
  <div class="flex flex-col gap-6">
    <div
      v-for="func in functions"
      :id="func.name"
      :key="func.name"
      class="rounded-xl border border-$vp-c-divider shadow scroll-mt-20"
    >
      <!-- Header -->
      <div class="flex flex-col gap-y-1.5 p-4 sm:p-6 text-2xl">
        <div class="flex items-center gap-2">
          <!-- Name -->
          <div class="font-semibold leading-none tracking-tight">
            {{ func.name }}
          </div>

          <!-- Badge -->
          <PerkakasBadge class="ml-auto bg-$vp-c-badge-primary text-white ">
            {{ func.category }}
          </PerkakasBadge>

          <PerkakasTags
            v-for="tag in getTags(func)"
            :key="tag"
            :tag="tag"
          />

          <a
            :href="func.sourceUrl"
            target="_blank"
            class="inline-flex items-center justify-center vpi-social-github"
            title="View source on Github"
          >
            <span class="sr-only">View source on GitHub</span>
          </a>
        </div>

        <p
          class="m-0! text-sm max-w-[65ch]"
          v-html="func.description"
        />
      </div>

      <!-- Content -->
      <div class="p-4 pt-0 sm:p-6">
        <div
          v-for="(method, idx) in func.methods"
          :key="`method-${func.name}-${idx}`"
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
    </div>
  </div>
</template>
./perkakas.data
