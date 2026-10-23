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
  const updated = {
    ...props.section,
    data: {
      ...props.section.data,
      [field]: value
    }
  }
  emit('update:section', updated)
}

function addSocialLink() {
  const current = props.section.data.socialLinks || []
  updateField('socialLinks', [
    ...current,
    { type: 'link', url: '', tooltip: '', icon: 'fa-solid fa-link' }
  ])
}

function removeSocialLink(idx) {
  const current = [...(props.section.data.socialLinks || [])]
  current.splice(idx, 1)
  updateField('socialLinks', current)
}

function updateSocialLink(idx, field, value) {
  const current = [...(props.section.data.socialLinks || [])]
  if (!current[idx]) return
  current[idx] = { ...current[idx], [field]: value }
  updateField('socialLinks', current)
}

const iconOptions = [
  { value: 'fa-solid fa-house', key: 'icon.homepage' },
  { value: 'fa-solid fa-envelope', key: 'icon.email' },
  { value: 'fa-brands fa-github', key: 'icon.github' },
  { value: 'fa-brands fa-linkedin', key: 'icon.linkedin' },
  { value: 'fa-brands fa-twitter', key: 'icon.twitter' },
  { value: 'fa-brands fa-google-scholar', key: 'icon.scholar' },
  { value: 'fa-solid fa-link', key: 'icon.link' },
  { value: 'fa-solid fa-book', key: 'icon.book' },
  { value: 'fa-solid fa-file-powerpoint', key: 'icon.slides' },
]
</script>

<template>
  <div v-if="section && section.data">
    <div class="editor-panel-header">
      <div>
        <div class="editor-panel-title">{{ t('about.title') }}</div>
        <div class="editor-panel-subtitle">{{ t('about.subtitle') }}</div>
      </div>
    </div>

    <!-- Photo URL with preview thumbnail -->
    <div class="form-group">
      <label class="form-label">{{ t('about.photo_url') }}</label>
      <div class="photo-input-group">
        <input
          class="form-input"
          :value="section.data.photo || ''"
          @input="updateField('photo', $event.target.value)"
          placeholder="https://example.com/avatar.jpg"
        />
        <div class="photo-preview-box" v-if="section.data.photo">
          <img :src="section.data.photo" alt="Avatar preview" />
        </div>
      </div>
    </div>

    <I18nField
      :label="t('about.name')"
      :modelValue="section.data.name || {}"
      @update:modelValue="updateField('name', $event)"
      :languages="languages"
    />

    <I18nField
      :label="t('about.title_field')"
      :modelValue="section.data.title || {}"
      @update:modelValue="updateField('title', $event)"
      :languages="languages"
    />

    <I18nField
      :label="t('about.bio')"
      type="textarea"
      :modelValue="section.data.bio || {}"
      @update:modelValue="updateField('bio', $event)"
      :languages="languages"
    />

    <hr class="divider" />
    <div class="sidebar-section-title">{{ t('about.social_links') }}</div>

    <div
      v-for="(link, idx) in (section.data.socialLinks || [])"
      :key="idx"
      class="social-link-item"
    >
      <select
        class="form-select"
        :value="link.icon"
        @change="updateSocialLink(idx, 'icon', $event.target.value)"
        style="font-size:12px;padding:6px;"
      >
        <option v-for="opt in iconOptions" :key="opt.value" :value="opt.value">{{ t(opt.key) }}</option>
      </select>
      <input
        class="form-input"
        :value="link.url"
        @input="updateSocialLink(idx, 'url', $event.target.value)"
        :placeholder="t('common.url')"
        style="font-size:12px;"
      />
      <input
        class="form-input"
        :value="link.tooltip"
        @input="updateSocialLink(idx, 'tooltip', $event.target.value)"
        :placeholder="t('common.tooltip')"
        style="font-size:12px;"
      />
      <button
        type="button"
        class="btn btn-sm btn-danger btn-icon"
        @click="removeSocialLink(idx)"
        :title="t('common.delete')"
      >
        <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    <button type="button" class="add-section-btn" style="margin-top:8px" @click="addSocialLink">
      {{ t('about.add_link') }}
    </button>
  </div>
</template>

<style scoped>
.photo-input-group {
  display: flex;
  gap: 12px;
  align-items: center;
}
.photo-preview-box {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  border: 1px solid var(--editor-border);
  overflow: hidden;
  background: var(--editor-surface-2);
  flex-shrink: 0;
}
.photo-preview-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.icon-svg {
  width: 13px;
  height: 13px;
}
</style>
