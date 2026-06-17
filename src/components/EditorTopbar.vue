<script setup>
import { ref } from 'vue'
import { generateHtml, downloadGeneratedHtml, downloadJson } from '../generator/generator.js'
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
  <div class="editor-topbar">
    <div class="editor-topbar-left">
      <div class="editor-logo">{{ t('topbar.logo') }}</div>
    </div>
    <div class="editor-topbar-actions">
      <button class="btn btn-sm" @click="toggleLocale" :title="locale.toUpperCase()">
        🌐 {{ locale.toUpperCase() }}
      </button>
      <input ref="fileInput" type="file" accept=".json" style="display:none" @change="handleFileSelected" />
      <button class="btn" @click="handleImportClick" :title="t('topbar.import')">
        📂 {{ t('topbar.import') }}
      </button>
      <button class="btn" @click="handleExportJson" :title="t('topbar.save')">
        💾 {{ t('topbar.save') }}
      </button>
      <button class="btn btn-success" @click="handleGenerate" :title="t('topbar.generate')">
        🚀 {{ t('topbar.generate') }}
      </button>
    </div>
  </div>
</template>
