<script setup>
import { ref, watch, provide, nextTick } from 'vue'
import defaultCvData from './data/default-cv-data.json'
import { useEditorI18n } from './i18n/editor-i18n.js'
import EditorTopbar from './components/EditorTopbar.vue'
import ModuleList from './components/ModuleList.vue'
import SectionEditor from './components/editors/SectionEditor.vue'
import PreviewPanel from './components/PreviewPanel.vue'

const { t } = useEditorI18n()

// Deep clone default data
const cvData = ref(JSON.parse(JSON.stringify(defaultCvData)))
const activeSection = ref(null) // section id or 'global'
const previewKey = ref(0)

// Provide to all children
provide('cvData', cvData)
provide('activeSection', activeSection)

// Debounced preview refresh
let refreshTimer = null
function refreshPreview() {
  clearTimeout(refreshTimer)
  refreshTimer = setTimeout(() => {
    previewKey.value++
  }, 500)
}

watch(cvData, () => {
  refreshPreview()
}, { deep: true })

function selectSection(sectionId) {
  activeSection.value = sectionId
}

function importJson(data) {
  cvData.value = data
  activeSection.value = null
  nextTick(() => refreshPreview())
}

const currentSection = ref(null)
watch(activeSection, (id) => {
  if (id === 'global') {
    currentSection.value = null
  } else {
    currentSection.value = cvData.value.sections.find(s => s.id === id) || null
  }
})
</script>

<template>
  <div class="editor-layout">
    <EditorTopbar :cvData="cvData" @import-json="importJson" />

    <div class="editor-sidebar">
      <ModuleList
        :sections="cvData.sections"
        :activeSection="activeSection"
        @select="selectSection"
        @update:sections="(s) => cvData.sections = s"
      />

      <div class="editor-panel" v-if="activeSection === 'global'">
        <div class="editor-panel-header">
          <div>
            <div class="editor-panel-title">{{ t('global.title') }}</div>
            <div class="editor-panel-subtitle">{{ t('global.subtitle') }}</div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('global.name_brand') }}</label>
          <input class="form-input" v-model="cvData.navbar.brand" />
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('global.default_lang') }}</label>
          <select class="form-select" v-model="cvData.meta.defaultLanguage">
            <option v-for="lang in cvData.meta.supportedLanguages" :key="lang" :value="lang">{{ lang.toUpperCase() }}</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('global.supported_langs') }}</label>
          <input
            class="form-input"
            :value="cvData.meta.supportedLanguages.join(', ')"
            @change="(e) => cvData.meta.supportedLanguages = e.target.value.split(',').map(s => s.trim()).filter(Boolean)"
          />
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

        <hr class="divider" />
        <div class="sidebar-section-title">{{ t('global.analytics') }}</div>

        <div class="form-group">
          <label class="module-toggle" style="display: inline-flex;">
            <input type="checkbox" v-model="cvData.meta.analytics.matomo.enabled" />
            <span class="slider"></span>
          </label>
          <span style="margin-left: 8px; font-size: 13px;">{{ t('global.enable_matomo') }}</span>
        </div>

        <template v-if="cvData.meta.analytics.matomo.enabled">
          <div class="form-group">
            <label class="form-label">{{ t('global.matomo_url') }}</label>
            <input class="form-input" v-model="cvData.meta.analytics.matomo.url" />
          </div>
          <div class="form-group">
            <label class="form-label">{{ t('global.matomo_site_id') }}</label>
            <input class="form-input" v-model="cvData.meta.analytics.matomo.siteId" />
          </div>
        </template>
      </div>

      <SectionEditor
        v-else-if="currentSection"
        :section="currentSection"
        :supportedLanguages="cvData.meta.supportedLanguages"
        @update:section="(s) => {
          const idx = cvData.sections.findIndex(x => x.id === s.id)
          if (idx >= 0) cvData.sections[idx] = s
        }"
      />

      <div v-else class="empty-state" style="flex:1;">
        <div class="empty-state-icon">{{ t('empty.icon') }}</div>
        <div class="empty-state-text">{{ t('empty.text') }}</div>
      </div>
    </div>

    <PreviewPanel :cvData="cvData" :previewKey="previewKey" />
  </div>
</template>
