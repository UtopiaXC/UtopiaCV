<script setup>
import I18nField from '../shared/I18nField.vue'
import { useEditorI18n } from '../../i18n/editor-i18n.js'

const { t } = useEditorI18n()

const props = defineProps({
  section: Object,
  languages: { type: Array, default: () => ['en'] }
})

const emit = defineEmits(['update:section'])

function updateField(field, value) {
  emit('update:section', {
    ...props.section,
    data: {
      ...props.section.data,
      [field]: value
    }
  })
}

function updateTitle(val) {
  updateField('title', val)
}

function updateContactText(val) {
  updateField('contactText', val)
}

// Languages skills
function addLanguage() {
  const current = [...(props.section.data.languages || [])]
  const initI18n = (def = '') => {
    const o = {}
    props.languages.forEach(l => { o[l] = def })
    return o
  }

  current.push({
    name: initI18n('Language'),
    level: initI18n('Native / Fluent / Professional')
  })
  updateField('languages', current)
}

function removeLanguage(idx) {
  const current = [...(props.section.data.languages || [])]
  current.splice(idx, 1)
  updateField('languages', current)
}

function updateLanguage(idx, field, value) {
  const current = [...(props.section.data.languages || [])]
  if (!current[idx]) return
  current[idx] = { ...current[idx], [field]: value }
  updateField('languages', current)
}

// Additional links
function addLink() {
  const current = [...(props.section.data.additionalLinks || [])]
  current.push({ label: '', url: '' })
  updateField('additionalLinks', current)
}

function removeLink(idx) {
  const current = [...(props.section.data.additionalLinks || [])]
  current.splice(idx, 1)
  updateField('additionalLinks', current)
}

function updateLink(idx, field, value) {
  const current = [...(props.section.data.additionalLinks || [])]
  if (!current[idx]) return
  current[idx] = { ...current[idx], [field]: value }
  updateField('additionalLinks', current)
}
</script>

<template>
  <div v-if="section && section.data">
    <div class="editor-panel-header">
      <div>
        <div class="editor-panel-title">{{ t('contact.title') }}</div>
        <div class="editor-panel-subtitle">{{ t('contact.subtitle') }}</div>
      </div>
    </div>

    <I18nField
      :label="t('contact.section_title')"
      :modelValue="section.data.title || {}"
      @update:modelValue="updateTitle"
      :languages="languages"
    />

    <div class="form-group">
      <label class="form-label">{{ t('contact.email') }}</label>
      <input
        class="form-input"
        :value="section.data.email || ''"
        @input="updateField('email', $event.target.value)"
        placeholder="your.email@example.com"
      />
    </div>

    <I18nField
      :label="t('contact.contact_text')"
      type="textarea"
      :modelValue="section.data.contactText || {}"
      @update:modelValue="updateContactText"
      :languages="languages"
    />

    <hr class="divider" />
    <div class="sidebar-section-title">{{ t('contact.language_skills') }} ({{ section.data.languages?.length || 0 }})</div>

    <div
      v-for="(lang, idx) in (section.data.languages || [])"
      :key="idx"
      class="item-card"
      style="padding:14px;"
    >
      <div class="flex-between mb-8">
        <span style="font-size:13px; font-weight:600;">
          {{ t('contact.language_n') }} #{{ idx + 1 }}
        </span>
        <button
          type="button"
          class="btn btn-sm btn-danger btn-icon"
          @click="removeLanguage(idx)"
          :title="t('common.delete')"
        >
          <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <I18nField
        :label="t('contact.lang_name')"
        :modelValue="lang.name || {}"
        @update:modelValue="updateLanguage(idx, 'name', $event)"
        :languages="languages"
      />
      <I18nField
        :label="t('contact.lang_level')"
        :modelValue="lang.level || {}"
        @update:modelValue="updateLanguage(idx, 'level', $event)"
        :languages="languages"
      />
    </div>

    <button type="button" class="add-section-btn" @click="addLanguage">
      {{ t('contact.add_language') }}
    </button>

    <hr class="divider" />
    <div class="sidebar-section-title">{{ t('contact.additional_links') }} ({{ section.data.additionalLinks?.length || 0 }})</div>

    <div
      v-for="(link, idx) in (section.data.additionalLinks || [])"
      :key="idx"
      class="link-item"
      style="grid-template-columns: 1fr 1fr auto;"
    >
      <input
        class="form-input"
        :value="link.label || ''"
        @input="updateLink(idx, 'label', $event.target.value)"
        :placeholder="t('common.label')"
      />
      <input
        class="form-input"
        :value="link.url || ''"
        @input="updateLink(idx, 'url', $event.target.value)"
        :placeholder="t('common.url')"
      />
      <button
        type="button"
        class="btn btn-sm btn-danger btn-icon"
        @click="removeLink(idx)"
        :title="t('common.delete')"
      >
        <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    <button type="button" class="add-section-btn" @click="addLink">
      {{ t('contact.add_link') }}
    </button>
  </div>
</template>

<style scoped>
.icon-svg {
  width: 13px;
  height: 13px;
}
</style>
