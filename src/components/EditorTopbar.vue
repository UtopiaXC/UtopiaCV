<script setup>
import { ref } from 'vue'
import { downloadGeneratedHtml, downloadJson } from '../generator/generator.js'
import { useEditorI18n } from '../i18n/editor-i18n.js'

const { t, locale, setLocale, availableLocales } = useEditorI18n()

const props = defineProps({
  cvData: Object
})

const emit = defineEmits(['import-json'])

const fileInput = ref(null)

function handleExportJson() {
  downloadJson(props.cvData)
}

function handleGenerate() {
  downloadGeneratedHtml(props.cvData)
}

function handleImportClick() {
  fileInput.value.click()
}

function handleFileSelected(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result)
      emit('import-json', data)
    } catch (err) {
      alert('Invalid JSON file: ' + err.message)
    }
  }
  reader.readAsText(file)
  e.target.value = ''
}

function toggleLocale() {
  const idx = availableLocales.indexOf(locale.value)
  const next = availableLocales[(idx + 1) % availableLocales.length]
  setLocale(next)
}
</script>

<template>
  <header class="editor-topbar">
    <div class="editor-topbar-left">
      <div class="editor-logo">
        <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        <span>{{ t('topbar.logo') }}</span>
      </div>
    </div>
    <div class="editor-topbar-actions">
      <button class="btn btn-sm" @click="toggleLocale" :title="locale.toUpperCase()">
        <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
        <span>{{ locale === 'zh' ? '中文' : 'EN' }}</span>
      </button>

      <input ref="fileInput" type="file" accept=".json" style="display:none" @change="handleFileSelected" />

      <button class="btn btn-sm" @click="handleImportClick" :title="t('topbar.import')">
        <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        <span>{{ t('topbar.import') }}</span>
      </button>

      <button class="btn btn-sm" @click="handleExportJson" :title="t('topbar.save')">
        <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
          <polyline points="17 21 17 13 7 13 7 21"></polyline>
          <polyline points="7 3 7 8 15 8"></polyline>
        </svg>
        <span>{{ t('topbar.save') }}</span>
      </button>

      <button class="btn btn-sm btn-primary" @click="handleGenerate" :title="t('topbar.generate')">
        <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        <span>{{ t('topbar.generate') }}</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.icon-svg {
  width: 14px;
  height: 14px;
}
.editor-logo .icon-svg {
  width: 18px;
  height: 18px;
  stroke: var(--editor-primary);
}
.editor-logo {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
