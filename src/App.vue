<script setup>
import { ref, watch, provide, computed, nextTick } from 'vue'
import { useEditorI18n } from './i18n/editor-i18n.js'
import EditorTopbar from './components/EditorTopbar.vue'
import ModuleList from './components/ModuleList.vue'
import SectionEditor from './components/editors/SectionEditor.vue'
import PreviewPanel from './components/PreviewPanel.vue'
import InitialSetup from './components/InitialSetup.vue'
import LanguagePicker from './components/LanguagePicker.vue'
import { getLangFullLabel } from './utils/lang.js'

const { t } = useEditorI18n()

const isInitialized = ref(false)
const cvData = ref(null)
const activeSection = ref(null) // section id or 'global'
const previewKey = ref(0)
const currentEditLang = ref('en')

// Provide to all children
provide('cvData', cvData)
provide('activeSection', activeSection)
provide('currentEditLang', currentEditLang)

// Debounced preview refresh
let refreshTimer = null
function refreshPreview() {
  if (!cvData.value) return
  clearTimeout(refreshTimer)
  refreshTimer = setTimeout(() => {
    previewKey.value++
  }, 250)
}

watch(cvData, () => {
  refreshPreview()
}, { deep: true })

function selectSection(sectionId) {
  activeSection.value = sectionId
}

function importJson(data) {
  if (!data.custom) {
    data.custom = { css: '', js: '' }
  }
  cvData.value = data
  isInitialized.value = true
  const dl = data.meta?.defaultLanguage || data.meta?.supportedLanguages?.[0] || 'en'
  currentEditLang.value = dl
  activeSection.value = data.sections?.[0]?.id || 'global'
  nextTick(() => refreshPreview())
}

// Reactive computed property for active section
const currentSection = computed(() => {
  if (!cvData.value || !activeSection.value || activeSection.value === 'global') return null
  return cvData.value.sections?.find(s => s.id === activeSection.value) || null
})

function addAppLang(code) {
  if (!code || !cvData.value) return
  if (!cvData.value.meta.supportedLanguages.includes(code)) {
    cvData.value.meta.supportedLanguages.push(code)
  }
  if (!cvData.value.meta.defaultLanguage) {
    cvData.value.meta.defaultLanguage = code
  }
}

function removeAppLang(code) {
  if (!cvData.value) return
  if (cvData.value.meta.supportedLanguages.length <= 1) {
    alert('Resume must support at least one language.')
    return
  }
  cvData.value.meta.supportedLanguages = cvData.value.meta.supportedLanguages.filter(l => l !== code)
  if (cvData.value.meta.defaultLanguage === code) {
    cvData.value.meta.defaultLanguage = cvData.value.meta.supportedLanguages[0] || 'en'
  }
  if (currentEditLang.value === code) {
    currentEditLang.value = cvData.value.meta.defaultLanguage
  }
}

function updateSectionsList(newList) {
  if (cvData.value) {
    cvData.value.sections = newList
  }
}
</script>

<template>
  <InitialSetup v-if="!isInitialized" @complete="importJson" />

  <div class="editor-layout" v-else>
    <EditorTopbar :cvData="cvData" @import-json="importJson" />

    <div class="editor-sidebar">
      <ModuleList
        :sections="cvData.sections"
        :activeSection="activeSection"
        :supportedLanguages="cvData.meta.supportedLanguages"
        :defaultLang="cvData.meta.defaultLanguage"
        @select="selectSection"
        @update:sections="updateSectionsList"
      />

      <!-- Global Settings Panel -->
      <div class="editor-panel" v-if="activeSection === 'global'">
        <div class="editor-panel-header">
          <div>
            <div class="editor-panel-title">{{ t('global.title') }}</div>
            <div class="editor-panel-subtitle">{{ t('global.subtitle') }}</div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('global.name_brand') }}</label>
          <input class="form-input" v-model="cvData.navbar.brand" placeholder="e.g. John Doe / Portfolio" />
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('global.default_lang') }}</label>
          <select class="form-select" v-model="cvData.meta.defaultLanguage">
            <option v-for="lang in cvData.meta.supportedLanguages" :key="lang" :value="lang">
              {{ getLangFullLabel(lang) }} ({{ lang }})
            </option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('global.supported_langs') }}</label>
          <div class="tags-container" style="margin-bottom:8px; display:flex; gap:8px; flex-wrap:wrap;">
            <span
              class="tech-tag"
              style="padding:5px 10px; border-radius:4px; font-size:12px; display:inline-flex; align-items:center; gap:6px;"
              v-for="lang in cvData.meta.supportedLanguages"
              :key="lang"
            >
              {{ getLangFullLabel(lang) }} ({{ lang }})
              <span
                style="cursor:pointer; font-weight:bold; font-size:14px;"
                class="tag-remove"
                @click="removeAppLang(lang)"
                title="Remove language"
              >×</span>
            </span>
          </div>
          <LanguagePicker @add="addAppLang" />
        </div>

        <hr class="divider" />

        <div class="form-group">
          <label class="form-label">{{ t('global.footer_text') }}</label>
          <input class="form-input" v-model="cvData.footer.text" />
        </div>
        <div class="form-group">
          <label class="form-label">{{ t('global.copyright_name') }}</label>
          <input class="form-input" v-model="cvData.footer.copyright.name" />
        </div>
        <div class="form-group">
          <label class="form-label">{{ t('global.copyright_url') }}</label>
          <input class="form-input" v-model="cvData.footer.copyright.url" />
        </div>
        <div class="form-group">
          <label class="form-label">{{ t('global.copyright_year') }}</label>
          <input class="form-input" type="number" v-model.number="cvData.footer.copyright.startYear" />
        </div>

        <!-- Custom Code: CSS & JS (replacing Matomo) -->
        <hr class="divider" />
        <div class="sidebar-section-title">{{ t('global.custom_code') }}</div>

        <div class="form-group">
          <label class="form-label">{{ t('global.custom_css') }}</label>
          <textarea
            class="form-textarea code-textarea"
            v-model="cvData.custom.css"
            :placeholder="t('global.custom_css_placeholder')"
            rows="5"
          ></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('global.custom_js') }}</label>
          <textarea
            class="form-textarea code-textarea"
            v-model="cvData.custom.js"
            :placeholder="t('global.custom_js_placeholder')"
            rows="5"
          ></textarea>
        </div>
      </div>

      <!-- Active Section Editor Panel -->
      <SectionEditor
        v-else-if="currentSection"
        :section="currentSection"
        :supportedLanguages="cvData.meta.supportedLanguages"
        @update:section="(s) => {
          const idx = cvData.sections.findIndex(x => x.id === s.id)
          if (idx >= 0) {
            cvData.sections[idx] = s
          }
        }"
      />

      <!-- Empty State -->
      <div v-else class="empty-state" style="flex:1;">
        <div class="empty-state-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
        <div class="empty-state-title" style="font-weight:600; color:var(--editor-text); margin-bottom:6px;">
          {{ t('empty.title') }}
        </div>
        <div class="empty-state-text">{{ t('empty.text') }}</div>
      </div>
    </div>

    <!-- Live Preview Panel -->
    <PreviewPanel :cvData="cvData" :previewKey="previewKey" />
  </div>
</template>

<style scoped>
.code-textarea {
  font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
  font-size: 12px;
  line-height: 1.5;
  tab-size: 2;
}
</style>
