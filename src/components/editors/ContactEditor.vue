<script setup>
import I18nField from '../shared/I18nField.vue'
import { useEditorI18n } from '../../i18n/editor-i18n.js'

const { t } = useEditorI18n()

const props = defineProps({
  section: Object,
  languages: Array
})

const emit = defineEmits(['update:section'])

function clone() { return JSON.parse(JSON.stringify(props.section)) }

function update(path, value) {
  const s = clone()
  const keys = path.split('.')
  let obj = s
  for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]]
  obj[keys[keys.length - 1]] = value
  emit('update:section', s)
}

// Languages
function addLanguage() {
  const s = clone()
  if (!s.data.languages) s.data.languages = []
  s.data.languages.push({ name: { en: '' }, level: { en: '' } })
  emit('update:section', s)
}

function removeLanguage(idx) {
  const s = clone(); s.data.languages.splice(idx, 1); emit('update:section', s)
}

function updateLanguage(idx, field, value) {
  const s = clone(); s.data.languages[idx][field] = value; emit('update:section', s)
}

// Additional links
function addLink() {
  const s = clone()
  if (!s.data.additionalLinks) s.data.additionalLinks = []
  s.data.additionalLinks.push({ label: '', url: '' })
  emit('update:section', s)
}

function removeLink(idx) {
  const s = clone(); s.data.additionalLinks.splice(idx, 1); emit('update:section', s)
}

function updateLink(idx, field, value) {
  const s = clone(); s.data.additionalLinks[idx][field] = value; emit('update:section', s)
}
</script>

<template>
  <div>
    <div class="editor-panel-header">
      <div>
        <div class="editor-panel-title">{{ t('contact.title') }}</div>
        <div class="editor-panel-subtitle">{{ t('contact.subtitle') }}</div>
      </div>
    </div>

    <I18nField :label="t('contact.section_title')" :modelValue="section.data.title" @update:modelValue="update('data.title', $event)" :languages="languages" />

    <div class="form-group">
      <label class="form-label">{{ t('contact.email') }}</label>
      <input class="form-input" :value="section.data.email" @input="update('data.email', $event.target.value)" />
    </div>

    <I18nField :label="t('contact.contact_text')" type="textarea" :modelValue="section.data.contactText" @update:modelValue="update('data.contactText', $event)" :languages="languages" />

    <hr class="divider" />
    <div class="sidebar-section-title">{{ t('contact.language_skills') }}</div>

    <div v-for="(lang, idx) in (section.data.languages || [])" :key="idx" class="item-card" style="padding:12px;">
      <div class="flex-between mb-8">
        <span style="font-size:13px;font-weight:600;">{{ t('contact.language_n') }} {{ idx + 1 }}</span>
        <button class="btn btn-sm btn-danger btn-icon" @click="removeLanguage(idx)" :title="t('common.delete')">✕</button>
      </div>
      <I18nField :label="t('contact.lang_name')" :modelValue="lang.name" @update:modelValue="updateLanguage(idx, 'name', $event)" :languages="languages" />
      <I18nField :label="t('contact.lang_level')" :modelValue="lang.level" @update:modelValue="updateLanguage(idx, 'level', $event)" :languages="languages" />
    </div>
    <button class="add-section-btn" @click="addLanguage">{{ t('contact.add_language') }}</button>

    <hr class="divider" />
    <div class="sidebar-section-title">{{ t('contact.additional_links') }}</div>

    <div v-for="(link, idx) in (section.data.additionalLinks || [])" :key="idx" class="link-item" style="grid-template-columns: 1fr 1fr auto;">
      <input class="form-input" :value="link.label" @input="updateLink(idx, 'label', $event.target.value)" :placeholder="t('common.label')" />
      <input class="form-input" :value="link.url" @input="updateLink(idx, 'url', $event.target.value)" :placeholder="t('common.url')" />
      <button class="btn btn-sm btn-danger btn-icon" @click="removeLink(idx)" :title="t('common.delete')">✕</button>
    </div>
    <button class="add-section-btn" @click="addLink">{{ t('contact.add_link') }}</button>
  </div>
</template>
