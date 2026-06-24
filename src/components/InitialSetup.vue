<script setup>
import { ref } from 'vue'
import { useEditorI18n } from '../i18n/editor-i18n.js'
import defaultCvData from '../data/default-cv-data.json'
import { getNativeLangNameOnly } from '../utils/lang.js'
import LanguagePicker from './LanguagePicker.vue'

const emit = defineEmits(['complete'])

const { t, locale, setLocale } = useEditorI18n()

const mode = ref(null)

const form = ref({
  brand: '',
  supportedLangs: [],
  defaultLang: ''
})

function addLang(code) {
  if (code && !form.value.supportedLangs.includes(code)) {
    form.value.supportedLangs.push(code)
  }
}

function removeLang(code) {
  form.value.supportedLangs = form.value.supportedLangs.filter(l => l !== code)
  if (form.value.defaultLang === code) {
    form.value.defaultLang = form.value.supportedLangs[0] || ''
  }
}

function handleFileUpload(e) {
  const file = e.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const json = JSON.parse(e.target.result)
      emit('complete', json)
    } catch (err) {
      alert('Invalid JSON file')
    }
  }
  reader.readAsText(file)
}

function startScratch() {
  const supported = form.value.supportedLangs
  const defaultLang = form.value.defaultLang

  const newCvData = JSON.parse(JSON.stringify(defaultCvData))
  newCvData.sections = [] // Clear default sections as requested
  newCvData.meta.supportedLanguages = supported
  newCvData.meta.defaultLanguage = defaultLang
  newCvData.navbar.brand = form.value.brand

  emit('complete', newCvData)
}
</script>

<template>
  <div class="setup-container">
    <div class="setup-card">
      <div class="setup-header">
        <h1>{{ t('setup.title') }}</h1>
        <div class="lang-switcher">
           <select class="form-select" :value="locale" @change="setLocale($event.target.value)">
             <option value="en">English</option>
             <option value="zh">中文</option>
           </select>
        </div>
      </div>

      <div class="setup-actions" v-if="!mode">
        <label class="setup-btn primary">
          {{ t('setup.import_btn') }}
          <input type="file" accept=".json" @change="handleFileUpload" style="display: none" />
        </label>
        
        <div class="setup-divider">{{ t('setup.or') }}</div>

        <button class="setup-btn secondary" @click="mode = 'scratch'">
          {{ t('setup.scratch_btn') }}
        </button>
      </div>

      <div class="setup-form" v-else>
        <h2>{{ t('setup.basic_info') }}</h2>
        
        <div class="form-group">
          <label class="form-label">{{ t('setup.brand_name') }}</label>
          <input class="form-input" v-model="form.brand" />
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('setup.supported_langs') }}</label>
          <div class="tags-container" style="margin-bottom:8px; display:flex; gap:8px; flex-wrap:wrap;">
            <span class="tech-tag" style="padding:4px 8px; border-radius:4px; font-size:13px; display:inline-flex; align-items:center; gap:4px;" v-for="lang in form.supportedLangs" :key="lang">
              {{ getNativeLangNameOnly(lang) || lang }} 
              <span class="tag-remove" style="cursor:pointer; font-weight:bold" @click="removeLang(lang)">×</span>
            </span>
          </div>
          <LanguagePicker @add="addLang" />
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('setup.default_lang') }}</label>
          <select class="form-select" v-model="form.defaultLang">
            <option v-for="lang in form.supportedLangs" :key="lang" :value="lang">{{ getNativeLangNameOnly(lang) || lang }}</option>
          </select>
        </div>

        <div class="form-actions">
          <button class="setup-btn secondary" @click="mode = null">{{ t('modules.cancel') }}</button>
          <button class="setup-btn primary" @click="startScratch">{{ t('setup.start_btn') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.setup-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: var(--editor-bg, #f5f5f5);
  font-family: system-ui, -apple-system, sans-serif;
  color: var(--editor-text, #333);
}
.setup-card {
  background: var(--editor-surface, white);
  padding: 40px;
  border-radius: 12px;
  box-shadow: var(--editor-shadow, 0 4px 20px rgba(0,0,0,0.1));
  border: 1px solid var(--editor-border, transparent);
  width: 100%;
  max-width: 480px;
  box-sizing: border-box;
}
.setup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}
.setup-header h1 {
  margin: 0;
  font-size: 24px;
  color: var(--editor-text, #333);
}
.lang-switcher select {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid var(--editor-border, #ddd);
  font-size: 14px;
  background: var(--editor-surface, white);
  color: var(--editor-text, #333);
}
.setup-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.setup-btn {
  display: block;
  text-align: center;
  padding: 12px 20px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  font-weight: 500;
  transition: all 0.2s;
  width: 100%;
  box-sizing: border-box;
}
.setup-btn.primary {
  background: var(--editor-primary, #007bff);
  color: white;
}
.setup-btn.primary:hover {
  background: var(--editor-primary-hover, #0056b3);
}
.setup-btn.secondary {
  background: var(--editor-surface-2, #f0f0f0);
  color: var(--editor-text, #333);
  border: 1px solid var(--editor-border, transparent);
}
.setup-btn.secondary:hover {
  background: var(--editor-surface-3, #e0e0e0);
}
.setup-divider {
  text-align: center;
  color: var(--editor-text-muted, #888);
  font-size: 14px;
  margin: 15px 0;
  position: relative;
}
.setup-divider::before, .setup-divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background: var(--editor-border, #eee);
}
.setup-divider::before { left: 0; }
.setup-divider::after { right: 0; }
.setup-form h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
  color: var(--editor-text, #444);
}
.form-group {
  margin-bottom: 15px;
}
.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--editor-text-secondary, #555);
  font-weight: 500;
}
.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--editor-border, #ddd);
  background: var(--editor-surface, white);
  color: var(--editor-text, #333);
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 14px;
}
.form-input:focus, .form-select:focus {
  border-color: var(--editor-primary, #007bff);
  outline: none;
}
.form-select {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--editor-border, #ddd);
  background: var(--editor-surface, white);
  color: var(--editor-text, #333);
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 14px;
}
.tech-tag {
  background: var(--editor-surface-2, #eee);
  border: 1px solid var(--editor-border, #ddd);
  color: var(--editor-text, #333);
}
.tech-tag .tag-remove {
  color: var(--editor-text-muted, #888);
}
.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 25px;
}
.form-actions .setup-btn {
  flex: 1;
}
</style>
