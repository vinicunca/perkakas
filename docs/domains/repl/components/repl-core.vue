<script lang="ts" setup>
import ReplEditorContainer from './repl-editor-container.vue';
import ReplOutput from './repl-output.vue';
import ReplSplitPane from './repl-split-pane.vue';

const outputRef = ref<InstanceType<typeof ReplOutput>>();
</script>

<template>
  <div class="overflow-hidden grow-1 flex flex-col border-t border-$vd-c-divider">
    <ReplSplitPane>
      <template #left>
        <ReplEditorContainer />
      </template>

      <template #right>
        <ReplOutput
          ref="outputRef"
        />
      </template>
    </ReplSplitPane>
  </div>
</template>
