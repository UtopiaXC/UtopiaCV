<script setup>
import { ref } from 'vue'
import I18nField from '../shared/I18nField.vue'
import { useEditorI18n } from '../../i18n/editor-i18n.js'

const { t } = useEditorI18n()

const props = defineProps({
  section: Object,
  languages: Array
})

const emit = defineEmits(['update:section'])
const expandedItems = ref({})

function clone() { return JSON.parse(JSON.stringify(props.section)) }
function updateTitle(val) { const s = clone(); s.data.title = val; emit('update:section', s) }
function toggleItem(id) { expandedItems.value[id] = !expandedItems.value[id] }

function updateItem(idx, field, value) {
  const s = clone(); s.data.items[idx][field] = value; emit('update:section', s)
}

function addItem() {
  const s = clone()
  const id = 'item-' + Date.now()
  s.data.items.push({
    id,
    title: { en: 'New Project' },
    institution: { en: '' },
    dateRange: '',
    description: { en: '' },
    techTags: []
  })
  emit('update:section', s)
  expandedItems.value[id] = true
}

function removeItem(idx) { const s = clone(); s.data.items.splice(idx, 1); emit('update:section', s) }

function moveItem(idx, dir) {
  const s = clone()
  const newIdx = idx + dir
  if (newIdx < 0 || newIdx >= s.data.items.length) return
  ;[s.data.items[idx], s.data.items[newIdx]] = [s.data.items[newIdx], s.data.items[idx]]
  emit('update:section', s)
}

// Tech tags
const newTag = ref('')

function addTag(itemIdx) {
  if (!newTag.value.trim()) return
  const s = clone()
  if (!s.data.items[itemIdx].techTags) s.data.items[itemIdx].techTags = []
  s.data.items[itemIdx].techTags.push(newTag.value.trim())
  emit('update:section', s)
  newTag.value = ''
}

function removeTag(itemIdx, tagIdx) {
  const s = clone()
  s.data.items[itemIdx].techTags.splice(tagIdx, 1)
  emit('update:section', s)
}
</script>

<template>
  <div>
    <div class="editor-panel-header">
      <div>
        <div class="editor-panel-title">{{ t('projectgrid.title') }}</div>
        <div class="editor-panel-subtitle">{{ t('projectgrid.subtitle_prefix') }}{{ section.id }}{{ t('projectgrid.subtitle_suffix') }}</div>
      </div>
    </div>

    <I18nField :label="t('projectgrid.section_title')" :modelValue="section.data.title" @update:modelValue="updateTitle" :languages="languages" />

    <hr class="divider" />
    <div class="sidebar-section-title">{{ t('projectgrid.items') }} ({{ section.data.items?.length || 0 }})</div>

    <div
      v-for="(item, idx) in section.data.items"
      :key="item.id"
      class="item-card"
      :class="{ expanded: expandedItems[item.id] }"
    >
      <div class="item-card-header" @click="toggleItem(item.id)">
        <span class="item-card-title">{{ item.title?.en || item.id }} <span class="text-muted" style="font-size:11px">{{ item.dateRange }}</span></span>
        <div class="item-card-actions">
          <button class="btn btn-sm btn-icon" @click.stop="moveItem(idx, -1)" :disabled="idx === 0" :title="t('common.move_up')">↑</button>
          <button class="btn btn-sm btn-icon" @click.stop="moveItem(idx, 1)" :disabled="idx === section.data.items.length - 1" :title="t('common.move_down')">↓</button>
          <button class="btn btn-sm btn-danger btn-icon" @click.stop="removeItem(idx)" :title="t('common.delete')">✕</button>
        </div>
      </div>

      <div class="item-card-body">
        <I18nField :label="t('projectgrid.item_title')" :modelValue="item.title" @update:modelValue="updateItem(idx, 'title', $event)" :languages="languages" />
        <I18nField :label="t('projectgrid.institution')" :modelValue="item.institution" @update:modelValue="updateItem(idx, 'institution', $event)" :languages="languages" />

        <div class="form-group">
          <label class="form-label">{{ t('projectgrid.date_range') }}</label>
          <input class="form-input" :value="item.dateRange" @input="updateItem(idx, 'dateRange', $event.target.value)" :placeholder="t('projectgrid.date_placeholder')" />
        </div>

        <I18nField :label="t('projectgrid.description')" type="textarea" :modelValue="item.description" @update:modelValue="updateItem(idx, 'description', $event)" :languages="languages" />

        <div class="form-group">
          <label class="form-label">{{ t('projectgrid.tech_tags') }}</label>
          <div class="tag-list">
            <span v-for="(tag, ti) in (item.techTags || [])" :key="ti" class="tag-item">
              {{ tag }}
              <span class="tag-remove" @click="removeTag(idx, ti)">×</span>
            </span>
          </div>
          <div class="tag-input-row">
            <input class="form-input" v-model="newTag" :placeholder="t('projectgrid.add_tag_placeholder')" @keydown.enter="addTag(idx)" />
            <button class="btn btn-sm" @click="addTag(idx)">+</button>
          </div>
        </div>
      </div>
    </div>

    <button class="add-section-btn" @click="addItem">{{ t('projectgrid.add_item') }}</button>
  </div>
</template>
