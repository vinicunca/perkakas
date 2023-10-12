<script setup lang="ts">
import { sleep } from '@vinicunca/perkakas';
import CoreList from '~/domains/core/components/list/core-list.vue';
import navJson from '~~/data/nav.json';

const opened = ref<string[]>([]);

onMounted(async () => {
  await sleep(1000);

  const element = document.querySelector('#app-sidebar .router-link-active');

  if (!element) {
    return;
  };

  element.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'center',
  });
});
</script>

<template>
  <CoreList
    id="app-sidebar"
    v-model:opened="opened"
    class="mt-3"
    :nav-items="navJson"
  />
</template>
