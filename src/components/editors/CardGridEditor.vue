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
  const id = 'card-' + Date.now()

  const initI18n = (def = '') => {
    const o = {}
    props.languages.forEach(l => { o[l] = def })
    return o
  }

  items.push({
    id,
    title: initI18n('Card Title'),
    description: initI18n('Description of project, paper, or achievement...'),
    links: []
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

// Links
function addLink(itemIdx) {
  const items = [...(props.section.data.items || [])]
  const initI18n = (def = '') => {
    const o = {}
    props.languages.forEach(l => { o[l] = def })
    return o
  }

  const links = [...(items[itemIdx].links || [])]
  links.push({
    label: initI18n('View Project'),
    url: '',
    icon: 'fa-solid fa-link'
  })
  items[itemIdx] = { ...items[itemIdx], links }
  updateField('items', items)
}

function removeLink(itemIdx, linkIdx) {
  const items = [...(props.section.data.items || [])]
  const links = [...(items[itemIdx].links || [])]
  links.splice(linkIdx, 1)
  items[itemIdx] = { ...items[itemIdx], links }
  updateField('items', items)
}

function updateLink(itemIdx, linkIdx, field, value) {
  const items = [...(props.section.data.items || [])]
  const links = [...(items[itemIdx].links || [])]
  links[linkIdx] = { ...links[linkIdx], [field]: value }
  items[itemIdx] = { ...items[itemIdx], links }
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

const iconOptions = [
  { value: 'fa-solid fa-link', key: 'icon.link' },
  { value: 'fa-brands fa-github', key: 'icon.github' },
  { value: 'fa-solid fa-book', key: 'icon.book' },
  { value: 'fa-solid fa-file-powerpoint', key: 'icon.slides' },
  { value: 'fa-solid fa-house', key: 'icon.home' },
  { value: 'fa-solid fa-globe', key: 'icon.web' },
]
</script>

<template>
  <div v-if="section && section.data">
    <div class="editor-panel-header">
      <div>
        <div class="editor-panel-title">{{ t('cardgrid.title') }}</div>
        <div class="editor-panel-subtitle">{{ t('cardgrid.subtitle_prefix') }}{{ section.id }}{{ t('cardgrid.subtitle_suffix') }}</div>
      </div>
    </div>

    <I18nField
      :label="t('cardgrid.section_title')"
      :modelValue="section.data.title || {}"
      @update:modelValue="updateTitle"
      :languages="languages"
    />

    <hr class="divider" />
    <div class="sidebar-section-title">{{ t('cardgrid.items') }} ({{ section.data.items?.length || 0 }})</div>

    <div
      v-for="(item, idx) in (section.data.items || [])"
      :key="item.id"
      class="item-card"
      :class="{ expanded: expandedItems[item.id] }"
    >
      <div class="item-card-header" @click="toggleItem(item.id)">
        <span class="item-card-title">{{ getItemTitle(item) }}</span>
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
          :label="t('cardgrid.item_title')"
          :modelValue="item.title || {}"
          @update:modelValue="updateItem(idx, 'title', $event)"
          :languages="languages"
        />

        <I18nField
          :label="t('cardgrid.description')"
          type="textarea"
          :modelValue="item.description || {}"
          @update:modelValue="updateItem(idx, 'description', $event)"
          :languages="languages"
        />

        <div class="sidebar-section-title mt-12">{{ t('cardgrid.links') }} ({{ item.links?.length || 0 }})</div>

        <div v-for="(link, li) in (item.links || [])" :key="li" class="card-link-block">
          <I18nField
            :label="t('cardgrid.link_label')"
            :modelValue="link.label || {}"
            @update:modelValue="updateLink(idx, li, 'label', $event)"
            :languages="languages"
            compact
          />
          <div class="card-link-row">
            <input
              class="form-input"
              :value="link.url || ''"
              @input="updateLink(idx, li, 'url', $event.target.value)"
              :placeholder="t('common.url')"
            />
            <select
              class="form-select"
              :value="link.icon"
              @change="updateLink(idx, li, 'icon', $event.target.value)"
              style="width:130px; font-size:12px;"
            >
              <option v-for="opt in iconOptions" :key="opt.value" :value="opt.value">{{ t(opt.key) }}</option>
            </select>
            <button
              type="button"
              class="btn btn-sm btn-danger btn-icon"
              @click="removeLink(idx, li)"
              :title="t('common.delete')"
            >
              <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <button type="button" class="add-section-btn" style="margin-top:6px" @click="addLink(idx)">
          {{ t('cardgrid.add_link') }}
        </button>
      </div>
    </div>

    <button type="button" class="add-section-btn" @click="addItem">
      {{ t('cardgrid.add_item') }}
    </button>
  </div>
</template>

<style scoped>
.icon-svg {
  width: 13px;
  height: 13px;
}
.card-link-block {
  background: var(--editor-surface-3);
  border: 1px solid var(--editor-border);
  border-radius: var(--editor-radius-sm);
  padding: 10px;
  margin-bottom: 8px;
}
.card-link-row {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
