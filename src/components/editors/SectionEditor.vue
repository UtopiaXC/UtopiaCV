<script setup>
import { inject } from 'vue'
import AboutEditor from './AboutEditor.vue'
import TimelineEditor from './TimelineEditor.vue'
import CardGridEditor from './CardGridEditor.vue'
import ProjectGridEditor from './ProjectGridEditor.vue'
import ContactEditor from './ContactEditor.vue'
import { useEditorI18n } from '../../i18n/editor-i18n.js'
import { getLangFullLabel } from '../../utils/lang.js'

const { t } = useEditorI18n()

const props = defineProps({
  section: Object,
  supportedLanguages: { type: Array, default: () => ['en'] }
})

const emit = defineEmits(['update:section'])

const currentEditLang = inject('currentEditLang', null)

const editors = {
  about: AboutEditor,
  timeline: TimelineEditor,
  'card-grid': CardGridEditor,
  'project-grid': ProjectGridEditor,
  contact: ContactEditor,
}

function updateSection(updates) {
  emit('update:section', { ...props.section, ...updates })
}

function updateName(name) {
  emit('update:section', { ...props.section, name })
}
</script>

<template>
  <div class="editor-panel" v-if="section">
    <!-- Section Internal Name for Editor Management -->
    <div class="form-group section-name-group">
      <div class="flex-between">
        <label class="form-label mb-0">{{ t('section.internal_name') }}</label>
        <span class="section-id-badge">ID: {{ section.id }}</span>
      </div>
      <input
        class="form-input mt-8"
        :value="section.name || ''"
        @input="updateName($event.target.value)"
        :placeholder="section.id"
      />
      <span class="text-muted" style="font-size:11px; margin-top:4px; display:block;">
        {{ t('section.internal_name_desc') }}
      </span>
    </div>

    <!-- Quick Language Switcher Bar for all fields in this section -->
    <div class="lang-switch-bar" v-if="supportedLanguages.length > 1 && currentEditLang">
      <div class="lang-switch-label">
        <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
        <span>{{ t('lang_bar.editing_lang') }}:</span>
      </div>
      <div class="lang-pill-group">
        <button
          type="button"
          v-for="lang in supportedLanguages"
          :key="lang"
          class="lang-pill-btn"
          :class="{ active: currentEditLang.value === lang }"
          @click="currentEditLang.value = lang"
          :title="getLangFullLabel(lang)"
        >
          {{ lang.toUpperCase() }}
        </button>
      </div>
    </div>

    <component
      :is="editors[section.type]"
      v-if="editors[section.type]"
      :section="section"
      :languages="supportedLanguages"
      @update:section="updateSection"
    />

    <div v-else class="empty-state">
      <div class="empty-state-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="48" height="48">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <div class="empty-state-text">{{ t('common.unknown_type') }}: {{ section.type }}</div>
    </div>
  </div>
</template>

<style scoped>
.section-name-group {
  background: var(--editor-surface-2);
  border: 1px solid var(--editor-border);
  border-radius: var(--editor-radius-sm);
  padding: 12px;
  margin-bottom: 16px;
}
.section-id-badge {
  font-size: 11px;
  font-family: monospace;
  color: var(--editor-text-muted);
  background: var(--editor-surface-3);
  padding: 2px 6px;
  border-radius: 4px;
}
.lang-switch-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  background: var(--editor-surface-2);
  border: 1px solid var(--editor-border);
  border-radius: var(--editor-radius-sm);
  padding: 8px 12px;
  margin-bottom: 20px;
}
.lang-switch-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--editor-text-secondary);
  font-weight: 500;
}
.icon-svg {
  width: 14px;
  height: 14px;
}
.lang-pill-group {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.lang-pill-btn {
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid var(--editor-border);
  border-radius: 4px;
  background: var(--editor-surface);
  color: var(--editor-text-muted);
  cursor: pointer;
  transition: all var(--editor-transition);
}
.lang-pill-btn:hover {
  color: var(--editor-text);
  border-color: var(--editor-border-hover);
}
.lang-pill-btn.active {
  background: var(--editor-primary);
  border-color: var(--editor-primary);
  color: #fff;
}
</style>
