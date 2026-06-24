<script setup>
import { ref, watch, computed } from 'vue'
import { generateHtml } from '../generator/generator.js'
import { useEditorI18n } from '../i18n/editor-i18n.js'
import { getNativeLangNameOnly } from '../utils/lang.js'

const { t } = useEditorI18n()

const props = defineProps({
  cvData: Object,
  previewKey: Number
})

const previewLang = ref('en')
const previewTheme = ref('light')
const iframeRef = ref(null)

const supportedLangs = computed(() => props.cvData?.meta?.supportedLanguages || ['en'])

function updatePreview() {
  if (!iframeRef.value) return
  try {
    const html = generateHtml(props.cvData)
    const doc = iframeRef.value.contentDocument
    doc.open()
    doc.write(html)
    doc.close()

    // Apply theme/lang overrides after a short delay
    setTimeout(() => {
      if (!iframeRef.value?.contentDocument) return
      const innerDoc = iframeRef.value.contentDocument
      const docEl = innerDoc.documentElement

      if (previewTheme.value === 'dark') {
        docEl.classList.add('dark-mode')
      } else {
        docEl.classList.remove('dark-mode')
      }

      const langItem = innerDoc.querySelector(`#lang-switcher-menu li[data-lang="${previewLang.value}"]`)
      if (langItem) langItem.click()
    }, 150)
  } catch (e) {
    console.error('Preview error:', e)
  }
}

watch(() => props.previewKey, () => {
  updatePreview()
}, { immediate: false })

watch([previewLang, previewTheme], () => {
  updatePreview()
})

function onIframeLoad() {
  updatePreview()
}
</script>

<template>
  <div class="editor-preview">
    <div class="preview-toolbar">
      <span class="text-muted" style="font-size:12px;font-weight:600;">{{ t('preview.title') }}</span>
      <select class="form-select" style="width:auto;padding:4px 8px;font-size:12px;" v-model="previewLang" @change="updatePreview">
        <option v-for="lang in supportedLangs" :key="lang" :value="lang">{{ getNativeLangNameOnly(lang) || lang }}</option>
      </select>
      <button
        class="btn btn-sm"
        :class="{ active: previewTheme === 'light' }"
        @click="previewTheme = 'light'"
      >{{ t('preview.light') }}</button>
      <button
        class="btn btn-sm"
        :class="{ active: previewTheme === 'dark' }"
        @click="previewTheme = 'dark'"
      >{{ t('preview.dark') }}</button>
      <button class="btn btn-sm" @click="updatePreview" :title="t('preview.refresh')">{{ t('preview.refresh') }}</button>
    </div>
    <div class="preview-iframe-wrapper">
      <iframe
        ref="iframeRef"
        @load="onIframeLoad"
        style="width:100%;height:100%;"
        sandbox="allow-scripts allow-same-origin"
      ></iframe>
    </div>
  </div>
</template>
