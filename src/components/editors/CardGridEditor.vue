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

function updateTitle(val) {
  const s = clone(); s.data.title = val; emit('update:section', s)
}

function toggleItem(id) { expandedItems.value[id] = !expandedItems.value[id] }

function updateItem(idx, field, value) {
  const s = clone(); s.data.items[idx][field] = value; emit('update:section', s)
}

function addItem() {
  const s = clone()
  const id = 'item-' + Date.now()
  s.data.items.push({
    id,
    title: { en: 'New Item' },
    description: { en: '' },
    links: []
  })
  emit('update:section', s)
  expandedItems.value[id] = true
}

function removeItem(idx) {
  const s = clone(); s.data.items.splice(idx, 1); emit('update:section', s)
}

function moveItem(idx, dir) {
  const s = clone()
  const newIdx = idx + dir
  if (newIdx < 0 || newIdx >= s.data.items.length) return
  ;[s.data.items[idx], s.data.items[newIdx]] = [s.data.items[newIdx], s.data.items[idx]]
  emit('update:section', s)
}

// Links
function addLink(itemIdx) {
  const s = clone()
  s.data.items[itemIdx].links.push({ label: { en: 'Link' }, url: '', icon: 'fa-solid fa-link' })
  emit('update:section', s)
}

function removeLink(itemIdx, linkIdx) {
  const s = clone()
  s.data.items[itemIdx].links.splice(linkIdx, 1)
  emit('update:section', s)
}

function updateLink(itemIdx, linkIdx, field, value) {
  const s = clone()
  s.data.items[itemIdx].links[linkIdx][field] = value
  emit('update:section', s)
}

const iconOptions = [
  { value: 'fa-solid fa-link', key: 'icon.link' },
  { value: 'fa-brands fa-github', key: 'icon.github' },
  { value: 'fa-solid fa-book', key: 'icon.book' },
  { value: 'fa-solid fa-file-powerpoint', key: 'icon.slides' },
  { value: 'fa-solid fa-home', key: 'icon.home' },
  { value: 'fa-solid fa-globe', key: 'icon.web' },
]
</script>

<template>
  <div>
    <div class="editor-panel-header">
      <div>
        <div class="editor-panel-title">{{ t('cardgrid.title') }}</div>
        <div class="editor-panel-subtitle">{{ t('cardgrid.subtitle_prefix') }}{{ section.id }}{{ t('cardgrid.subtitle_suffix') }}</div>
      </div>
    </div>

    <I18nField :label="t('cardgrid.section_title')" :modelValue="section.data.title" @update:modelValue="updateTitle" :languages="languages" />

    <hr class="divider" />
    <div class="sidebar-section-title">{{ t('cardgrid.items') }} ({{ section.data.items?.length || 0 }})</div>

    <div
      v-for="(item, idx) in section.data.items"
      :key="item.id"
      class="item-card"
      :class="{ expanded: expandedItems[item.id] }"
    >
      <div class="item-card-header" @click="toggleItem(item.id)">
        <span class="item-card-title">{{ item.title?.en || item.id }}</span>
        <div class="item-card-actions">
          <button class="btn btn-sm btn-icon" @click.stop="moveItem(idx, -1)" :disabled="idx === 0" :title="t('common.move_up')">↑</button>
          <button class="btn btn-sm btn-icon" @click.stop="moveItem(idx, 1)" :disabled="idx === section.data.items.length - 1" :title="t('common.move_down')">↓</button>
          <button class="btn btn-sm btn-danger btn-icon" @click.stop="removeItem(idx)" :title="t('common.delete')">✕</button>
        </div>
      </div>

      <div class="item-card-body">
        <I18nField :label="t('cardgrid.item_title')" :modelValue="item.title" @update:modelValue="updateItem(idx, 'title', $event)" :languages="languages" />
        <I18nField :label="t('cardgrid.description')" type="textarea" :modelValue="item.description" @update:modelValue="updateItem(idx, 'description', $event)" :languages="languages" />

        <div class="sidebar-section-title mt-12">{{ t('cardgrid.links') }}</div>
        <div v-for="(link, li) in item.links" :key="li" class="link-item">
          <I18nField label="" :modelValue="link.label" @update:modelValue="updateLink(idx, li, 'label', $event)" :languages="languages" />
          <input class="form-input" :value="link.url" @input="updateLink(idx, li, 'url', $event.target.value)" :placeholder="t('common.url')" />
          <select class="form-select" :value="link.icon" @change="updateLink(idx, li, 'icon', $event.target.value)" style="width:auto;font-size:11px;padding:4px;">
            <option v-for="opt in iconOptions" :key="opt.value" :value="opt.value">{{ t(opt.key) }}</option>
          </select>
          <button class="btn btn-sm btn-danger btn-icon" @click="removeLink(idx, li)" :title="t('common.delete')">✕</button>
        </div>
        <button class="add-section-btn" style="margin-top:4px" @click="addLink(idx)">{{ t('cardgrid.add_link') }}</button>
      </div>
    </div>

    <button class="add-section-btn" @click="addItem">{{ t('cardgrid.add_item') }}</button>
  </div>
</template>
