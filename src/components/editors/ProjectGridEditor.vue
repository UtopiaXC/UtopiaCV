<script setup>
import { ref, inject } from 'vue'
import I18nField from '../shared/I18nField.vue'
import { useEditorI18n } from '../../i18n/editor-i18n.js'

const { t } = useEditorI18n()

const props = defineProps({
  section: Object,
  languages: { type: Array, default: () => ['en'] }
})

const emit = defineEmits(['update:section'])

const currentEditLang = inject('currentEditLang', null)
const expandedItems = ref({})
const tagInputs = ref({})

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

function toggleItem(id) {
  expandedItems.value[id] = !expandedItems.value[id]
}

function updateItem(idx, field, value) {
  const items = [...(props.section.data.items || [])]
  if (!items[idx]) return
  items[idx] = { ...items[idx], [field]: value }
  updateField('items', items)
}

function addItem() {
  const items = [...(props.section.data.items || [])]
  const id = 'proj-' + Date.now()

  const initI18n = (def = '') => {
    const o = {}
    props.languages.forEach(l => { o[l] = def })
    return o
  }

  items.push({
    id,
    title: initI18n('Project Title'),
    institution: initI18n('Organization / Client'),
    dateRange: '',
    description: initI18n(''),
    techTags: []
  })

  updateField('items', items)
  expandedItems.value[id] = true
}

function removeItem(idx) {
  const items = [...(props.section.data.items || [])]
  items.splice(idx, 1)
  updateField('items', items)
}

function moveItem(idx, dir) {
  const items = [...(props.section.data.items || [])]
  const newIdx = idx + dir
  if (newIdx < 0 || newIdx >= items.length) return
  const tmp = items[idx]
  items[idx] = items[newIdx]
  items[newIdx] = tmp
  updateField('items', items)
}

// Tech tags
function addTag(itemIdx, itemId) {
  const text = (tagInputs.value[itemId] || '').trim()
  if (!text) return
  const items = [...(props.section.data.items || [])]
  const currentTags = [...(items[itemIdx].techTags || [])]
  if (!currentTags.includes(text)) {
    currentTags.push(text)
    items[itemIdx] = { ...items[itemIdx], techTags: currentTags }
    updateField('items', items)
  }
  tagInputs.value[itemId] = ''
}

function removeTag(itemIdx, tagIdx) {
  const items = [...(props.section.data.items || [])]
  const currentTags = [...(items[itemIdx].techTags || [])]
  currentTags.splice(tagIdx, 1)
  items[itemIdx] = { ...items[itemIdx], techTags: currentTags }
  updateField('items', items)
}

function getItemTitle(item) {
  if (!item) return ''
  const tObj = item.title
  if (typeof tObj === 'string') return tObj
  if (tObj && typeof tObj === 'object') {
    const cur = currentEditLang?.value || props.languages[0] || 'en'
    if (tObj[cur] && String(tObj[cur]).trim()) return tObj[cur]
    for (const v of Object.values(tObj)) {
      if (v && String(v).trim()) return v
    }
  }
  return item.id || 'Project'
}
</script>

<template>
  <div v-if="section && section.data">
    <div class="editor-panel-header">
      <div>
        <div class="editor-panel-title">{{ t('projectgrid.title') }}</div>
        <div class="editor-panel-subtitle">{{ t('projectgrid.subtitle_prefix') }}{{ section.id }}{{ t('projectgrid.subtitle_suffix') }}</div>
      </div>
    </div>

    <I18nField
      :label="t('projectgrid.section_title')"
      :modelValue="section.data.title || {}"
      @update:modelValue="updateTitle"
      :languages="languages"
    />

    <hr class="divider" />
    <div class="sidebar-section-title">{{ t('projectgrid.items') }} ({{ section.data.items?.length || 0 }})</div>

    <div
      v-for="(item, idx) in (section.data.items || [])"
      :key="item.id"
      class="item-card"
      :class="{ expanded: expandedItems[item.id] }"
    >
      <div class="item-card-header" @click="toggleItem(item.id)">
        <span class="item-card-title">
          {{ getItemTitle(item) }}
          <span class="text-muted" style="font-size:11px; margin-left:6px;" v-if="item.dateRange">
            ({{ item.dateRange }})
          </span>
        </span>
        <div class="item-card-actions">
          <button
            type="button"
            class="btn btn-sm btn-icon"
            @click.stop="moveItem(idx, -1)"
            :disabled="idx === 0"
            :title="t('common.move_up')"
          >
            ↑
          </button>
          <button
            type="button"
            class="btn btn-sm btn-icon"
            @click.stop="moveItem(idx, 1)"
            :disabled="idx === section.data.items.length - 1"
            :title="t('common.move_down')"
          >
            ↓
          </button>
          <button
            type="button"
            class="btn btn-sm btn-danger btn-icon"
            @click.stop="removeItem(idx)"
            :title="t('common.delete')"
          >
            <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <div class="item-card-body">
        <I18nField
          :label="t('projectgrid.item_title')"
          :modelValue="item.title || {}"
          @update:modelValue="updateItem(idx, 'title', $event)"
          :languages="languages"
        />

        <I18nField
          :label="t('projectgrid.institution')"
          :modelValue="item.institution || {}"
          @update:modelValue="updateItem(idx, 'institution', $event)"
          :languages="languages"
        />

        <div class="form-group">
          <label class="form-label">{{ t('projectgrid.date_range') }}</label>
          <input
            class="form-input"
            :value="item.dateRange || ''"
            @input="updateItem(idx, 'dateRange', $event.target.value)"
            :placeholder="t('projectgrid.date_placeholder')"
          />
        </div>

        <I18nField
          :label="t('projectgrid.description')"
          type="textarea"
          :modelValue="item.description || {}"
          @update:modelValue="updateItem(idx, 'description', $event)"
          :languages="languages"
        />

        <div class="form-group">
          <label class="form-label">{{ t('projectgrid.tech_tags') }}</label>
          <div class="tag-list" v-if="item.techTags && item.techTags.length > 0">
            <span v-for="(tag, ti) in item.techTags" :key="ti" class="tag-item">
              {{ tag }}
              <span class="tag-remove" @click="removeTag(idx, ti)" title="Remove">×</span>
            </span>
          </div>
          <div class="tag-input-row">
            <input
              class="form-input"
              v-model="tagInputs[item.id]"
              :placeholder="t('projectgrid.add_tag_placeholder')"
              @keydown.enter.prevent="addTag(idx, item.id)"
            />
            <button type="button" class="btn btn-sm" @click="addTag(idx, item.id)">
              {{ t('common.add') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <button type="button" class="add-section-btn" @click="addItem">
      {{ t('projectgrid.add_item') }}
    </button>
  </div>
</template>

<style scoped>
.icon-svg {
  width: 13px;
  height: 13px;
}
</style>
