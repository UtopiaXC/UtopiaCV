<script setup>
import { ref, watch, computed, inject, onMounted, onUnmounted } from 'vue'
import { generateHtml } from '../generator/generator.js'
import { useEditorI18n } from '../i18n/editor-i18n.js'
import { getLangFullLabel } from '../utils/lang.js'

const { t } = useEditorI18n()

const props = defineProps({
  cvData: Object,
  previewKey: Number
})

const currentEditLang = inject('currentEditLang', null)

const defaultLang = computed(() => props.cvData?.meta?.defaultLanguage || 'en')
const supportedLangs = computed(() => {
  const list = props.cvData?.meta?.supportedLanguages
  return (list && list.length > 0) ? list : [defaultLang.value]
})

const previewLang = ref(
  (currentEditLang?.value && supportedLangs.value.includes(currentEditLang.value))
    ? currentEditLang.value
    : (defaultLang.value || 'en')
)
const previewTheme = ref('light')
const previewDevice = ref('desktop') // 'desktop' | 'tablet' | 'mobile'
const iframeRef = ref(null)

// Two-way synchronization with editor's active language
if (currentEditLang) {
  watch(() => currentEditLang.value, (newLang) => {
    if (newLang && previewLang.value !== newLang && supportedLangs.value.includes(newLang)) {
      previewLang.value = newLang
    }
  })
}

watch(supportedLangs, (langs) => {
  if (!langs.includes(previewLang.value)) {
    previewLang.value = defaultLang.value || langs[0] || 'en'
    if (currentEditLang) currentEditLang.value = previewLang.value
  }
}, { immediate: true })

watch(defaultLang, (dl) => {
  if (dl && !supportedLangs.value.includes(previewLang.value)) {
    previewLang.value = dl
    if (currentEditLang) currentEditLang.value = dl
  }
})

// Sync previewLang change directly into iframe DOM without full document re-render
watch(previewLang, (newLang) => {
  if (!iframeRef.value) return
  try {
    const win = iframeRef.value.contentWindow
    if (win && typeof win.__setLanguage === 'function') {
      win.__setLanguage(newLang)
    } else {
      updatePreview()
    }
  } catch (e) {
    updatePreview()
  }
})

// Sync theme change directly into iframe DOM
watch(previewTheme, (newTheme) => {
  if (!iframeRef.value) return
  try {
    const win = iframeRef.value.contentWindow
    if (win && typeof win.__setTheme === 'function') {
      win.__setTheme(newTheme)
    } else {
      updatePreview()
    }
  } catch (e) {
    updatePreview()
  }
})

function onPreviewLangChange(e) {
  const val = e.target.value
  previewLang.value = val
  if (currentEditLang && currentEditLang.value !== val) {
    currentEditLang.value = val
  }
}

function getPreviewHtml() {
  if (!props.cvData) return ''
  const cvClone = JSON.parse(JSON.stringify(props.cvData))
  if (!cvClone.meta) cvClone.meta = {}
  cvClone.meta.defaultLanguage = previewLang.value

  let html = generateHtml(cvClone)

  if (previewTheme.value === 'dark') {
    html = html.replace('<html lang="', '<html class="dark-mode" lang="')
  }

  return html
}

function updatePreview() {
  if (!iframeRef.value) return
  try {
    const html = getPreviewHtml()
    const iframe = iframeRef.value
    const doc = iframe.contentDocument || iframe.contentWindow.document
    doc.open()
    doc.write(html)
    doc.close()
  } catch (e) {
    console.error('Preview error:', e)
  }
}

// Watch data content changes from parent
watch(() => props.previewKey, () => {
  updatePreview()
}, { immediate: false })

function onIframeLoad() {
  // If iframe has reloaded, make sure language and theme are active
  try {
    const win = iframeRef.value?.contentWindow
    if (win) {
      if (typeof win.__setLanguage === 'function') {
        win.__setLanguage(previewLang.value)
      }
      if (typeof win.__setTheme === 'function') {
        win.__setTheme(previewTheme.value)
      }
    }
  } catch (e) {}
}

function handleIframeMessage(ev) {
  if (ev.data && ev.data.type === 'CV_LANG_CHANGE') {
    const targetLang = ev.data.lang
    if (targetLang && targetLang !== previewLang.value) {
      previewLang.value = targetLang
      if (currentEditLang && currentEditLang.value !== targetLang) {
        currentEditLang.value = targetLang
      }
    }
  }
}

onMounted(() => {
  window.addEventListener('message', handleIframeMessage)
  updatePreview()
})

onUnmounted(() => {
  window.removeEventListener('message', handleIframeMessage)
})
</script>

<template>
  <div class="editor-preview">
    <div class="preview-toolbar">
      <div class="preview-toolbar-group">
        <span class="preview-badge">{{ t('preview.title') }}</span>

        <!-- Two-way synced language switch for preview -->
        <select
          class="form-select preview-select"
          :value="previewLang"
          @change="onPreviewLangChange"
          title="Change preview and editing language"
        >
          <option v-for="lang in supportedLangs" :key="lang" :value="lang">
            {{ getLangFullLabel(lang) }} ({{ lang }})
          </option>
        </select>
      </div>

      <!-- Device Viewport toggles -->
      <div class="preview-toolbar-group">
        <div class="btn-group">
          <button
            type="button"
            class="btn btn-sm btn-icon"
            :class="{ active: previewDevice === 'desktop' }"
            @click="previewDevice = 'desktop'"
            title="Desktop view"
          >
            <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </button>
          <button
            type="button"
            class="btn btn-sm btn-icon"
            :class="{ active: previewDevice === 'tablet' }"
            @click="previewDevice = 'tablet'"
            title="Tablet view (768px)"
          >
            <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
              <line x1="12" y1="18" x2="12.01" y2="18"></line>
            </svg>
          </button>
          <button
            type="button"
            class="btn btn-sm btn-icon"
            :class="{ active: previewDevice === 'mobile' }"
            @click="previewDevice = 'mobile'"
            title="Mobile view (375px)"
          >
            <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
              <line x1="12" y1="18" x2="12.01" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <!-- Theme & Refresh -->
      <div class="preview-toolbar-group">
        <div class="btn-group">
          <button
            type="button"
            class="btn btn-sm"
            :class="{ active: previewTheme === 'light' }"
            @click="previewTheme = 'light'"
            :title="t('preview.light')"
          >
            <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            <span>{{ t('preview.light') }}</span>
          </button>

          <button
            type="button"
            class="btn btn-sm"
            :class="{ active: previewTheme === 'dark' }"
            @click="previewTheme = 'dark'"
            :title="t('preview.dark')"
          >
            <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
            <span>{{ t('preview.dark') }}</span>
          </button>
        </div>

        <button
          type="button"
          class="btn btn-sm btn-icon"
          @click="updatePreview"
          :title="t('preview.refresh')"
        >
          <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
        </button>
      </div>
    </div>

    <div class="preview-iframe-wrapper">
      <div class="iframe-container" :class="previewDevice">
        <iframe
          ref="iframeRef"
          @load="onIframeLoad"
          sandbox="allow-scripts allow-same-origin"
          title="CV Preview"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preview-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 16px;
  background: var(--editor-surface);
  border-bottom: 1px solid var(--editor-border);
  height: 48px;
}
.preview-toolbar-group {
  display: flex;
  align-items: center;
  gap: 8px;
}
.preview-badge {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--editor-text-secondary);
  text-transform: uppercase;
}
.preview-select {
  width: auto;
  padding: 4px 10px;
  font-size: 12px;
  height: 30px;
}
.btn-group {
  display: inline-flex;
  border-radius: var(--editor-radius-sm);
  overflow: hidden;
  border: 1px solid var(--editor-border);
}
.btn-group .btn {
  border-radius: 0;
  border: none;
  border-right: 1px solid var(--editor-border);
  padding: 5px 10px;
  font-size: 12px;
}
.btn-group .btn:last-child {
  border-right: none;
}
.btn-group .btn.active {
  background: var(--editor-primary);
  color: #fff;
}
.icon-svg {
  width: 14px;
  height: 14px;
}
.preview-iframe-wrapper {
  width: 100%;
  height: calc(100% - 48px);
  background: #121218;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  padding: 16px;
}
.iframe-container {
  height: 100%;
  width: 100%;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0,0,0,0.4);
}
.iframe-container.tablet {
  width: 768px;
}
.iframe-container.mobile {
  width: 375px;
}
.iframe-container iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}
</style>
