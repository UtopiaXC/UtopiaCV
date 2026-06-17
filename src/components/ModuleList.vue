<script setup>
import { ref } from 'vue'
import { useEditorI18n } from '../i18n/editor-i18n.js'

const { t } = useEditorI18n()

const props = defineProps({
  sections: Array,
  activeSection: [String, null]
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
  const sorted = [...props.sections].sort((a, b) => a.order - b.order)
  const [moved] = sorted.splice(dragIdx.value, 1)
  sorted.splice(idx, 0, moved)
  sorted.forEach((s, i) => s.order = i)
  emit('update:sections', [...props.sections])
  dragIdx.value = null
  dragOverIdx.value = null
}

function onDragEnd() {
  dragIdx.value = null
  dragOverIdx.value = null
}

function toggleSection(section) {
  section.enabled = !section.enabled
}

// Add new section
const showAddModal = ref(false)
const newSectionType = ref('card-grid')
const newSectionId = ref('')

function addSection() {
  if (!newSectionId.value.trim()) return
  const id = newSectionId.value.trim().toLowerCase().replace(/\s+/g, '-')

  const defaults = {
    about: { photo: '', name: { en: '' }, title: { en: '' }, bio: { en: '' }, socialLinks: [] },
    timeline: { title: { en: 'New Section' }, items: [] },
    'card-grid': { title: { en: 'New Section' }, items: [] },
    'project-grid': { title: { en: 'New Section' }, items: [] },
    contact: { title: { en: 'Contact' }, email: '', contactText: { en: '' }, languages: [], additionalLinks: [] },
  }

  const newSection = {
    id,
    type: newSectionType.value,
    enabled: true,
    order: props.sections.length,
    data: defaults[newSectionType.value] || {}
  }

  emit('update:sections', [...props.sections, newSection])
  showAddModal.value = false
  newSectionId.value = ''
  emit('select', id)
}

function deleteSection(sectionId) {
  if (!confirm(t('modules.confirm_delete'))) return
  const filtered = props.sections.filter(s => s.id !== sectionId)
  emit('update:sections', filtered)
  if (props.activeSection === sectionId) emit('select', null)
}

const sortedSections = () => [...props.sections].sort((a, b) => a.order - b.order)
</script>

<template>
  <div class="sidebar-section">
    <div class="flex-between mb-8">
      <span class="sidebar-section-title" style="margin-bottom:0">{{ t('modules.title') }}</span>
      <button class="btn btn-sm" @click="emit('select', 'global')" :class="{ 'btn-primary': activeSection === 'global' }">⚙️</button>
    </div>

    <ul class="module-list">
      <li
        v-for="(section, idx) in sortedSections()"
        :key="section.id"
        class="module-item"
        :class="{
          active: activeSection === section.id,
          dragging: dragIdx === idx
        }"
        draggable="true"
        @dragstart="onDragStart($event, idx)"
        @dragover="onDragOver($event, idx)"
        @drop="onDrop($event, idx)"
        @dragend="onDragEnd"
        @click="emit('select', section.id)"
      >
        <span class="drag-handle" @mousedown.stop>⠿</span>
        <span class="module-name">{{ section.data.title?.en || section.data.name?.en || section.id }}</span>
        <span class="module-type">{{ t('type.' + section.type) }}</span>
        <label class="module-toggle" @click.stop>
          <input type="checkbox" :checked="section.enabled" @change="toggleSection(section)" />
          <span class="slider"></span>
        </label>
        <button class="btn btn-sm btn-danger btn-icon" @click.stop="deleteSection(section.id)" :title="t('common.delete')">✕</button>
      </li>
    </ul>

    <button class="add-section-btn" @click="showAddModal = true">
      {{ t('modules.add') }}
    </button>
  </div>

  <!-- Add Section Modal -->
  <teleport to="body">
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal">
        <div class="modal-title">{{ t('modules.add_modal_title') }}</div>
        <div class="form-group">
          <label class="form-label">{{ t('modules.section_id') }}</label>
          <input class="form-input" v-model="newSectionId" :placeholder="t('modules.section_id_placeholder')" />
        </div>
        <div class="form-group">
          <label class="form-label">{{ t('modules.section_type') }}</label>
          <select class="form-select" v-model="newSectionType">
            <option v-for="opt in typeOptions" :key="opt.value" :value="opt.value">{{ t(opt.key) }}</option>
          </select>
        </div>
        <div class="modal-actions">
          <button class="btn" @click="showAddModal = false">{{ t('modules.cancel') }}</button>
          <button class="btn btn-primary" @click="addSection" :disabled="!newSectionId.trim()">{{ t('modules.confirm_add') }}</button>
        </div>
      </div>
    </div>
  </teleport>
</template>
