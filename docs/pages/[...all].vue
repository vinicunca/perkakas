<script lang="ts" setup>
import { type FunctionsData } from '../scripts/transform';
import { useContent, useRequestEvent, useSeoMeta } from '#imports';

const { page, layout } = useContent();

// Page not found, set correct status code on SSR
if (!(page as any).value && process.server) {
  const event = useRequestEvent();
  event.node.res.statusCode = 404;
}

useSeoMeta({
  title: () => page.value?.title,
  description: () => page.value?.description,
});

const { data, pending } = useFetch<{ metaDocs: FunctionsData }>('/api/meta');
</script>

<template>
  <div class="document-driven-page">
    <NuxtLayout :name="layout as string || 'default'">
      <ContentRenderer
        v-if="page && data"
        :key="(page as any)._id"
        :value="{
          ...page,
          metaDocs: data.metaDocs,
        }"
      >
        <template #empty="{ value }">
          <DocumentDrivenEmpty :value="value" />
        </template>
      </ContentRenderer>

      <DocumentDrivenNotFound v-else-if="!pending" />
    </NuxtLayout>
  </div>
</template>
