<script setup lang="ts">
import { RouterView } from 'vue-router'
import { NConfigProvider } from 'naive-ui'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'

hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('xml', xml)
</script>

<template>
  <NConfigProvider :hljs="hljs">
    <RouterView />
  </NConfigProvider>
</template>
