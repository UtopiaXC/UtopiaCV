<script setup>
import I18nField from '../shared/I18nField.vue'
import { useEditorI18n } from '../../i18n/editor-i18n.js'

const { t } = useEditorI18n()

const props = defineProps({
  section: Object,
  languages: Array
})

const emit = defineEmits(['update:section'])

function update(path, value) {
  const updated = JSON.parse(JSON.stringify(props.section))
  const keys = path.split('.')
  let obj = updated
  for (let i = 0; i < keys.length - 1; i++) {
    obj = obj[keys[i]]
  }
  obj[keys[keys.length - 1]] = value
  emit('update:section', updated)
}

function addSocialLink() {
  const updated = JSON.parse(JSON.stringify(props.section))
  updated.data.socialLinks.push({ type: 'link', url: '', tooltip: '', icon: 'fa-solid fa-link' })
  emit('update:section', updated)
}

function removeSocialLink(idx) {
  const updated = JSON.parse(JSON.stringify(props.section))
  updated.data.socialLinks.splice(idx, 1)
  emit('update:section', updated)
}

function updateSocialLink(idx, field, value) {
  const updated = JSON.parse(JSON.stringify(props.section))
  updated.data.socialLinks[idx][field] = value
  emit('update:section', updated)
}

const iconOptions = [
  { value: 'fa-solid fa-house', key: 'icon.homepage' },
  { value: 'fa-solid fa-envelope', key: 'icon.email' },
  { value: 'fa-brands fa-github', key: 'icon.github' },
  { value: 'fa-brands fa-linkedin', key: 'icon.linkedin' },
  { value: 'fa-brands fa-twitter', key: 'icon.twitter' },
  { value: 'fa-brands fa-google-scholar', key: 'icon.scholar' },
  { value: 'fa-solid fa-link', key: 'icon.link' },
]
</script>

<template>
  <div>
    <div class="editor-panel-header">
      <div>
        <div class="editor-panel-title">{{ t('about.title') }}</div>
        <div class="editor-panel-subtitle">{{ t('about.subtitle') }}</div>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">{{ t('about.photo_url') }}</label>
      <input class="form-input" :value="section.data.photo" @input="update('data.photo', $event.target.value)" placeholder="https://example.com/photo.jpg" />
    </div>

    <I18nField :label="t('about.name')" :modelValue="section.data.name" @update:modelValue="update('data.name', $event)" :languages="languages" />

    <I18nField :label="t('about.title_field')" :modelValue="section.data.title" @update:modelValue="update('data.title', $event)" :languages="languages" />

    <I18nField :label="t('about.bio')" type="textarea" :modelValue="section.data.bio" @update:modelValue="update('data.bio', $event)" :languages="languages" />

    <hr class="divider" />
    <div class="sidebar-section-title">{{ t('about.social_links') }}</div>

    <div v-for="(link, idx) in section.data.socialLinks" :key="idx" class="social-link-item">
      <select class="form-select" :value="link.icon" @change="updateSocialLink(idx, 'icon', $event.target.value)" style="font-size:12px;padding:6px;">
        <option v-for="opt in iconOptions" :key="opt.value" :value="opt.value">{{ t(opt.key) }}</option>
      </select>
      <input class="form-input" :value="link.url" @input="updateSocialLink(idx, 'url', $event.target.value)" :placeholder="t('common.url')" style="font-size:12px;" />
      <input class="form-input" :value="link.tooltip" @input="updateSocialLink(idx, 'tooltip', $event.target.value)" :placeholder="t('common.tooltip')" style="font-size:12px;" />
      <button class="btn btn-sm btn-danger btn-icon" @click="removeSocialLink(idx)">✕</button>
    </div>

    <button class="add-section-btn" style="margin-top:8px" @click="addSocialLink">{{ t('about.add_link') }}</button>
  </div>
</template>
