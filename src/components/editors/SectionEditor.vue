<script setup>
import AboutEditor from './AboutEditor.vue'
import TimelineEditor from './TimelineEditor.vue'
import CardGridEditor from './CardGridEditor.vue'
import ProjectGridEditor from './ProjectGridEditor.vue'
import ContactEditor from './ContactEditor.vue'
import { useEditorI18n } from '../../i18n/editor-i18n.js'

const { t } = useEditorI18n()

const props = defineProps({
  section: Object,
  supportedLanguages: Array
})

const emit = defineEmits(['update:section'])

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
</script>

<template>
  <div class="editor-panel" v-if="section">
    <component
      :is="editors[section.type]"
      v-if="editors[section.type]"
      :section="section"
      :languages="supportedLanguages"
      @update:section="updateSection"
    />
    <div v-else class="empty-state">
      <div class="empty-state-icon">❓</div>
      <div class="empty-state-text">{{ t('common.unknown_type') }}: {{ section.type }}</div>
    </div>
  </div>
</template>
