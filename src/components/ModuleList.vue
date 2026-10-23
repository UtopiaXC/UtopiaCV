<script setup>
import { ref, computed } from 'vue'
import { useEditorI18n } from '../i18n/editor-i18n.js'

const { t } = useEditorI18n()

const props = defineProps({
  sections: { type: Array, default: () => [] },
  activeSection: [String, null],
  supportedLanguages: { type: Array, default: () => ['en'] },
  defaultLang: { type: String, default: 'en' }
})

const emit = defineEmits(['select', 'update:sections'])

const typeOptions = [
  { value: 'about', key: 'type_opt.about' },
  { value: 'timeline', key: 'type_opt.timeline' },
  { value: 'card-grid', key: 'type_opt.card-grid' },
  { value: 'project-grid', key: 'type_opt.project-grid' },
  { value: 'contact', key: 'type_opt.contact' },
]

// Drag state
const dragIdx = ref(null)
const dragOverIdx = ref(null)

const sortedSections = computed(() => {
  return [...props.sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
})

function onDragStart(e, idx) {
  dragIdx.value = idx
  e.dataTransfer.effectAllowed = 'move'
}

function onDragOver(e, idx) {
  e.preventDefault()
  dragOverIdx.value = idx
}

function onDrop(e, idx) {
  e.preventDefault()
  if (dragIdx.value === null || dragIdx.value === idx) {
    dragIdx.value = null
    dragOverIdx.value = null
    return
  }
  const list = [...sortedSections.value]
  const [moved] = list.splice(dragIdx.value, 1)
  list.splice(idx, 0, moved)
  list.forEach((s, i) => { s.order = i })
  emit('update:sections', [...list])
  dragIdx.value = null
  dragOverIdx.value = null
}

function onDragEnd() {
  dragIdx.value = null
  dragOverIdx.value = null
}

function moveSection(idx, dir) {
  const list = [...sortedSections.value]
  const targetIdx = idx + dir
  if (targetIdx < 0 || targetIdx >= list.length) return
  const temp = list[idx]
  list[idx] = list[targetIdx]
  list[targetIdx] = temp
  list.forEach((s, i) => { s.order = i })
  emit('update:sections', [...list])
}

function toggleSection(section) {
  section.enabled = !section.enabled
}

// Add new section
const showAddModal = ref(false)
const newSectionType = ref('card-grid')
const newSectionName = ref('')
const newSectionId = ref('')
const addError = ref('')

function openAddModal() {
  newSectionType.value = 'card-grid'
  newSectionId.value = generateDefaultId('card-grid')
  newSectionName.value = getDefaultSectionName('card-grid')
  addError.value = ''
  showAddModal.value = true
}

function generateDefaultId(type) {
  const base = type === 'card-grid' ? 'projects' : type === 'project-grid' ? 'skills' : type
  let id = base
  let counter = 1
  while (props.sections.some(s => s.id === id)) {
    counter++
    id = `${base}-${counter}`
  }
  return id
}

function getDefaultSectionName(type) {
  const names = {
    about: '关于',
    timeline: '经历',
    'card-grid': '项目',
    'project-grid': '技能',
    contact: '联系'
  }
  return names[type] || '新模块'
}

function onTypeChange() {
  newSectionId.value = generateDefaultId(newSectionType.value)
  newSectionName.value = getDefaultSectionName(newSectionType.value)
}

function addSection() {
  addError.value = ''
  const rawId = newSectionId.value.trim().toLowerCase()
  if (!rawId) {
    addError.value = t('modules.section_id_placeholder')
    return
  }
  const id = rawId.replace(/[^a-z0-9_-]/g, '-')
  if (props.sections.some(s => s.id === id)) {
    addError.value = t('modules.duplicate_id')
    return
  }

  const sectionName = newSectionName.value.trim() || getDefaultSectionName(newSectionType.value)

  const initialI18n = (defaultVal = '') => {
    const obj = {}
    props.supportedLanguages.forEach(l => {
      obj[l] = defaultVal
    })
    return obj
  }

  const defaults = {
    about: {
      photo: '',
      name: initialI18n('Your Name'),
      title: initialI18n('Software Engineer'),
      bio: initialI18n('Introduce yourself here...'),
      socialLinks: []
    },
    timeline: {
      title: initialI18n(sectionName),
      items: []
    },
    'card-grid': {
      title: initialI18n(sectionName),
      items: []
    },
    'project-grid': {
      title: initialI18n(sectionName),
      items: []
    },
    contact: {
      title: initialI18n('Contact'),
      email: '',
      contactText: initialI18n(''),
      languages: [],
      additionalLinks: []
    },
  }

  const newSection = {
    id,
    name: sectionName,
    type: newSectionType.value,
    enabled: true,
    order: props.sections.length,
    data: defaults[newSectionType.value] || {}
  }

  emit('update:sections', [...props.sections, newSection])
  showAddModal.value = false
  newSectionId.value = ''
  newSectionName.value = ''
  emit('select', id)
}

function deleteSection(sectionId) {
  if (!confirm(t('modules.confirm_delete'))) return
  const filtered = props.sections.filter(s => s.id !== sectionId)
  filtered.forEach((s, i) => { s.order = i })
  emit('update:sections', filtered)
  if (props.activeSection === sectionId) {
    emit('select', null)
  }
}
</script>

<template>
  <div class="sidebar-section">
    <!-- Prominent Global Settings Card -->
    <div
      class="global-settings-card"
      :class="{ active: activeSection === 'global' }"
      @click="emit('select', 'global')"
    >
      <div class="global-settings-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </div>
      <div class="global-settings-text">
        <div class="global-settings-title">{{ t('modules.global_settings') }}</div>
        <div class="global-settings-desc">{{ t('modules.global_settings_desc') }}</div>
      </div>
    </div>

    <hr class="divider" style="margin: 14px 0;" />

    <div class="flex-between mb-8">
      <span class="sidebar-section-title" style="margin-bottom:0">{{ t('modules.title') }}</span>
    </div>

    <ul class="module-list">
      <li
        v-for="(section, idx) in sortedSections"
        :key="section.id"
        class="module-item"
        :class="{
          active: activeSection === section.id,
          dragging: dragIdx === idx,
          disabled: !section.enabled
        }"
        draggable="true"
        @dragstart="onDragStart($event, idx)"
        @dragover="onDragOver($event, idx)"
        @drop="onDrop($event, idx)"
        @dragend="onDragEnd"
        @click="emit('select', section.id)"
      >
        <span class="drag-handle" @mousedown.stop title="Drag to reorder">
          <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
            <circle cx="9" cy="6" r="1.5"></circle>
            <circle cx="15" cy="6" r="1.5"></circle>
            <circle cx="9" cy="12" r="1.5"></circle>
            <circle cx="15" cy="12" r="1.5"></circle>
            <circle cx="9" cy="18" r="1.5"></circle>
            <circle cx="15" cy="18" r="1.5"></circle>
          </svg>
        </span>

        <!-- Display section.name (internal management name) -->
        <span class="module-name" :title="section.name || section.id">
          {{ section.name || section.id }}
        </span>

        <span class="module-type">{{ t('type.' + section.type) }}</span>

        <div class="module-item-actions">
          <button
            type="button"
            class="btn-order"
            @click.stop="moveSection(idx, -1)"
            :disabled="idx === 0"
            :title="t('common.move_up')"
          >
            ↑
          </button>
          <button
            type="button"
            class="btn-order"
            @click.stop="moveSection(idx, 1)"
            :disabled="idx === sortedSections.length - 1"
            :title="t('common.move_down')"
          >
            ↓
          </button>
        </div>

        <label class="module-toggle" @click.stop title="Toggle section visibility">
          <input type="checkbox" :checked="section.enabled" @change="toggleSection(section)" />
          <span class="slider"></span>
        </label>

        <button
          type="button"
          class="btn btn-sm btn-danger btn-icon"
          @click.stop="deleteSection(section.id)"
          :title="t('common.delete')"
        >
          <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </li>
    </ul>

    <button type="button" class="add-section-btn" @click="openAddModal">
      {{ t('modules.add') }}
    </button>
  </div>

  <!-- Add Section Modal -->
  <teleport to="body">
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal">
        <div class="modal-title">{{ t('modules.add_modal_title') }}</div>

        <div class="form-group">
          <label class="form-label">{{ t('modules.section_type') }}</label>
          <select class="form-select" v-model="newSectionType" @change="onTypeChange">
            <option v-for="opt in typeOptions" :key="opt.value" :value="opt.value">{{ t(opt.key) }}</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('modules.section_name') }}</label>
          <input
            class="form-input"
            v-model="newSectionName"
            :placeholder="t('modules.section_name_placeholder')"
          />
          <span class="text-muted" style="font-size:12px; margin-top:4px; display:block;">
            {{ t('modules.section_name_hint') }}
          </span>
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('modules.section_id') }}</label>
          <input
            class="form-input"
            v-model="newSectionId"
            :placeholder="t('modules.section_id_placeholder')"
            @keydown.enter="addSection"
          />
          <span class="text-danger mt-8" v-if="addError" style="font-size:12px; display:block;">{{ addError }}</span>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn" @click="showAddModal = false">{{ t('modules.cancel') }}</button>
          <button type="button" class="btn btn-primary" @click="addSection" :disabled="!newSectionId.trim()">
            {{ t('modules.confirm_add') }}
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.global-settings-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: var(--editor-surface-2);
  border: 1px solid var(--editor-border);
  border-radius: var(--editor-radius-sm);
  cursor: pointer;
  transition: all var(--editor-transition);
}
.global-settings-card:hover {
  background: var(--editor-surface-3);
  border-color: var(--editor-border-hover);
}
.global-settings-card.active {
  background: var(--editor-primary-glow);
  border-color: var(--editor-primary);
}
.global-settings-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: var(--editor-surface-3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.global-settings-icon svg {
  width: 18px;
  height: 18px;
  stroke: var(--editor-primary);
}
.global-settings-text {
  flex: 1;
}
.global-settings-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--editor-text);
}
.global-settings-desc {
  font-size: 11px;
  color: var(--editor-text-muted);
  margin-top: 2px;
}
.icon-svg {
  width: 14px;
  height: 14px;
}
.module-item.disabled {
  opacity: 0.6;
}
.module-item-actions {
  display: flex;
  gap: 2px;
  align-items: center;
}
.btn-order {
  background: transparent;
  border: none;
  color: var(--editor-text-muted);
  font-size: 11px;
  width: 18px;
  height: 18px;
  padding: 0;
  cursor: pointer;
  border-radius: 3px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.btn-order:hover:not(:disabled) {
  background: var(--editor-surface-3);
  color: var(--editor-text);
}
.btn-order:disabled {
  opacity: 0.2;
  cursor: not-allowed;
}
</style>
