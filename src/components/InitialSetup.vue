<script setup>
import { ref } from 'vue'
import { useEditorI18n } from '../i18n/editor-i18n.js'
import defaultCvData from '../data/default-cv-data.json'
import { getLangFullLabel } from '../utils/lang.js'
import LanguagePicker from './LanguagePicker.vue'

const emit = defineEmits(['complete'])

const { t, locale, setLocale } = useEditorI18n()

const mode = ref(null)

const isBrowserZh = (typeof navigator !== 'undefined' && navigator.language ? navigator.language : '').toLowerCase().startsWith('zh')

const form = ref({
  brand: isBrowserZh ? '我的简历' : 'My Resume',
  supportedLangs: isBrowserZh ? ['zh', 'en'] : ['en', 'zh'],
  defaultLang: isBrowserZh ? 'zh' : 'en'
})

function addLang(code) {
  if (code && !form.value.supportedLangs.includes(code)) {
    form.value.supportedLangs.push(code)
    if (!form.value.defaultLang) {
      form.value.defaultLang = code
    }
  }
}

function removeLang(code) {
  if (form.value.supportedLangs.length <= 1) {
    alert('At least one language must be supported.')
    return
  }
  form.value.supportedLangs = form.value.supportedLangs.filter(l => l !== code)
  if (form.value.defaultLang === code) {
    form.value.defaultLang = form.value.supportedLangs[0] || 'en'
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
      alert('Invalid JSON file: ' + err.message)
    }
  }
  reader.readAsText(file)
}

function startWithDemo() {
  emit('complete', JSON.parse(JSON.stringify(defaultCvData)))
}

function startScratch() {
  const supported = form.value.supportedLangs.length > 0 ? form.value.supportedLangs : ['en']
  const defaultLang = form.value.defaultLang || supported[0] || 'en'

  const newCvData = JSON.parse(JSON.stringify(defaultCvData))

  const initI18n = (val = '') => {
    const o = {}
    supported.forEach(l => { o[l] = val })
    return o
  }

  newCvData.meta.supportedLanguages = supported
  newCvData.meta.defaultLanguage = defaultLang
  newCvData.navbar.brand = form.value.brand || 'Resume'
  newCvData.sections = [
    {
      id: 'about',
      name: isBrowserZh ? '关于我' : 'About Me',
      type: 'about',
      enabled: true,
      order: 0,
      data: {
        photo: '',
        name: initI18n(form.value.brand || 'Your Name'),
        title: initI18n('Software Developer'),
        bio: initI18n('Introduce yourself here...'),
        socialLinks: []
      }
    },
    {
      id: 'experience',
      name: isBrowserZh ? '工作经历' : 'Work Experience',
      type: 'timeline',
      enabled: true,
      order: 1,
      data: {
        title: initI18n('Experience'),
        items: []
      }
    },
    {
      id: 'contact',
      name: isBrowserZh ? '联系方式' : 'Contact',
      type: 'contact',
      enabled: true,
      order: 2,
      data: {
        title: initI18n('Contact'),
        email: '',
        contactText: initI18n(''),
        languages: [],
        additionalLinks: []
      }
    }
  ]

  emit('complete', newCvData)
}
</script>

<template>
  <div class="setup-container">
    <div class="setup-card">
      <div class="setup-header">
        <div class="setup-brand">
          <svg class="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <div>
            <h1>{{ t('setup.title') }}</h1>
            <p class="setup-subtitle">{{ t('setup.subtitle') }}</p>
          </div>
        </div>
        <div class="lang-switcher">
          <select class="form-select form-select-sm" :value="locale" @change="setLocale($event.target.value)">
            <option value="en">English</option>
            <option value="zh">中文</option>
          </select>
        </div>
      </div>

      <div class="setup-options" v-if="!mode">
        <!-- Option 1: Demo Template -->
        <div class="setup-option-card primary-card" @click="startWithDemo">
          <div class="option-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <div class="option-content">
            <div class="option-title">{{ t('setup.demo_btn') }}</div>
            <div class="option-desc">{{ t('setup.demo_desc') }}</div>
          </div>
          <button type="button" class="btn btn-sm btn-primary">{{ t('setup.start_btn') }}</button>
        </div>

        <!-- Option 2: Start from scratch -->
        <div class="setup-option-card" @click="mode = 'scratch'">
          <div class="option-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
          <div class="option-content">
            <div class="option-title">{{ t('setup.scratch_btn') }}</div>
            <div class="option-desc">{{ t('setup.scratch_desc') }}</div>
          </div>
          <button type="button" class="btn btn-sm">{{ t('setup.create_btn') }}</button>
        </div>

        <!-- Option 3: Import JSON -->
        <label class="setup-option-card import-card">
          <input type="file" accept=".json" @change="handleFileUpload" style="display: none" />
          <div class="option-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </div>
          <div class="option-content">
            <div class="option-title">{{ t('setup.import_btn') }}</div>
            <div class="option-desc">{{ t('setup.import_desc') }}</div>
          </div>
          <span class="btn btn-sm">{{ t('topbar.import') }}</span>
        </label>
      </div>

      <!-- Scratch Configuration Form -->
      <div class="setup-form" v-else>
        <h2>{{ t('setup.basic_info') }}</h2>

        <div class="form-group">
          <label class="form-label">{{ t('setup.brand_name') }}</label>
          <input class="form-input" v-model="form.brand" placeholder="e.g. John Doe / My CV" />
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('setup.supported_langs') }}</label>
          <div class="tags-container" style="margin-bottom:8px; display:flex; gap:8px; flex-wrap:wrap;">
            <span
              class="tech-tag"
              style="padding:5px 10px; border-radius:4px; font-size:12px; display:inline-flex; align-items:center; gap:6px;"
              v-for="lang in form.supportedLangs"
              :key="lang"
            >
              {{ getLangFullLabel(lang) }} ({{ lang }})
              <span class="tag-remove" style="cursor:pointer; font-weight:bold" @click="removeLang(lang)">×</span>
            </span>
          </div>
          <LanguagePicker @add="addLang" />
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('setup.default_lang') }}</label>
          <select class="form-select" v-model="form.defaultLang">
            <option v-for="lang in form.supportedLangs" :key="lang" :value="lang">
              {{ getLangFullLabel(lang) }} ({{ lang }})
            </option>
          </select>
        </div>

        <div class="form-actions">
          <button type="button" class="btn" @click="mode = null">{{ t('modules.cancel') }}</button>
          <button type="button" class="btn btn-primary" @click="startScratch">{{ t('setup.start_btn') }}</button>
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
  min-height: 100vh;
  background-color: var(--editor-bg, #0f0f14);
  font-family: inherit;
  color: var(--editor-text, #e8e8f0);
  padding: 20px;
}
.setup-card {
  background: var(--editor-surface, #1a1a24);
  padding: 36px;
  border-radius: var(--editor-radius-lg, 14px);
  box-shadow: 0 10px 40px rgba(0,0,0,0.4);
  border: 1px solid var(--editor-border, #333345);
  width: 100%;
  max-width: 580px;
  box-sizing: border-box;
}
.setup-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--editor-border);
}
.setup-brand {
  display: flex;
  gap: 14px;
  align-items: center;
}
.brand-icon {
  width: 32px;
  height: 32px;
  stroke: var(--editor-primary);
  flex-shrink: 0;
}
.setup-header h1 {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: var(--editor-text);
}
.setup-subtitle {
  font-size: 13px;
  color: var(--editor-text-secondary);
  margin-top: 4px;
}
.form-select-sm {
  padding: 4px 8px;
  font-size: 12px;
  height: 28px;
  width: auto;
}
.setup-options {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.setup-option-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: var(--editor-surface-2, #22222e);
  border: 1px solid var(--editor-border, #333345);
  border-radius: var(--editor-radius, 10px);
  cursor: pointer;
  transition: all var(--editor-transition, 0.2s);
}
.setup-option-card:hover {
  border-color: var(--editor-primary);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}
.setup-option-card.primary-card {
  border-color: var(--editor-primary);
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), transparent);
}
.option-icon {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  background: var(--editor-surface-3, #2a2a38);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.option-icon svg {
  width: 20px;
  height: 20px;
  stroke: var(--editor-primary);
}
.option-content {
  flex: 1;
}
.option-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--editor-text);
}
.option-desc {
  font-size: 12px;
  color: var(--editor-text-muted);
  margin-top: 2px;
}
.setup-form h2 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
}
</style>
