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
  const id = 'item-' + Date.now()

  const initI18n = (def = '') => {
    const o = {}
    props.languages.forEach(l => { o[l] = def })
    return o
  }

  items.push({
    id,
    logo: '',
    logoLink: '',
    title: initI18n('Role / Position'),
    institution: initI18n('Company / University'),
    dateRange: '',
    description: initI18n(''),
    department: initI18n(''),
    departmentLink: ''
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
  return item.id || 'Item'
}
</script>

<template>
  <div v-if="section && section.data">
    <div class="editor-panel-header">
      <div>
        <div class="editor-panel-title">{{ t('timeline.title') }}</div>
        <div class="editor-panel-subtitle">{{ t('timeline.subtitle_prefix') }}{{ section.id }}{{ t('timeline.subtitle_suffix') }}</div>
      </div>
    </div>

    <I18nField
      :label="t('timeline.section_title')"
      :modelValue="section.data.title || {}"
      @update:modelValue="updateTitle"
      :languages="languages"
    />

    <hr class="divider" />
    <div class="sidebar-section-title">{{ t('timeline.items') }} ({{ section.data.items?.length || 0 }})</div>

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
          :label="t('timeline.item_title')"
          :modelValue="item.title || {}"
          @update:modelValue="updateItem(idx, 'title', $event)"
          :languages="languages"
        />

        <I18nField
          :label="t('timeline.institution')"
          :modelValue="item.institution || {}"
          @update:modelValue="updateItem(idx, 'institution', $event)"
          :languages="languages"
        />

        <div class="form-group">
          <label class="form-label">{{ t('timeline.date_range') }}</label>
          <input
            class="form-input"
            :value="item.dateRange || ''"
            @input="updateItem(idx, 'dateRange', $event.target.value)"
            :placeholder="t('timeline.date_placeholder')"
          />
        </div>

        <I18nField
          :label="t('timeline.description')"
          type="textarea"
          :modelValue="item.description || {}"
          @update:modelValue="updateItem(idx, 'description', $event)"
          :languages="languages"
        />

        <I18nField
          :label="t('timeline.department')"
          :modelValue="item.department || {}"
          @update:modelValue="updateItem(idx, 'department', $event)"
          :languages="languages"
        />

        <div class="form-group">
          <label class="form-label">{{ t('timeline.logo_url') }}</label>
          <div style="display:flex;gap:8px;align-items:center;">
            <input
              class="form-input"
              :value="item.logo || ''"
              @input="updateItem(idx, 'logo', $event.target.value)"
              :placeholder="t('common.url_placeholder')"
            />
            <div v-if="item.logo" style="width:32px;height:32px;border-radius:4px;overflow:hidden;border:1px solid var(--editor-border);flex-shrink:0;">
              <img :src="item.logo" style="width:100%;height:100%;object-fit:contain;" alt="Logo" />
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('timeline.logo_link') }}</label>
          <input
            class="form-input"
            :value="item.logoLink || ''"
            @input="updateItem(idx, 'logoLink', $event.target.value)"
            :placeholder="t('common.url_placeholder')"
          />
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('timeline.department_link') }}</label>
          <input
            class="form-input"
            :value="item.departmentLink || ''"
            @input="updateItem(idx, 'departmentLink', $event.target.value)"
            :placeholder="t('common.url_placeholder')"
          />
        </div>
      </div>
    </div>

    <button type="button" class="add-section-btn" @click="addItem">
      {{ t('timeline.add_item') }}
    </button>
  </div>
</template>

<style scoped>
.icon-svg {
  width: 13px;
  height: 13px;
}
</style>
