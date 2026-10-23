<script setup>
/**
 * I18nField - Multilingual input/textarea with synchronized language tabs
 */
import { ref, watch, inject, computed } from 'vue'

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  languages: { type: Array, default: () => ['en'] },
  label: { type: String, default: '' },
  type: { type: String, default: 'input' }, // 'input' or 'textarea'
  placeholder: { type: String, default: '' },
  compact: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])

const injectedLang = inject('currentEditLang', null)

const activeLang = ref(
  (injectedLang?.value && props.languages.includes(injectedLang.value))
    ? injectedLang.value
    : (props.languages[0] || 'en')
)

if (injectedLang) {
  watch(() => injectedLang.value, (newVal) => {
    if (newVal && props.languages.includes(newVal)) {
      activeLang.value = newVal
    }
  })
}

watch(() => props.languages, (newLangs) => {
  if (!newLangs || newLangs.length === 0) return
  if (!newLangs.includes(activeLang.value)) {
    activeLang.value = (injectedLang?.value && newLangs.includes(injectedLang.value))
      ? injectedLang.value
      : newLangs[0]
  }
}, { deep: true })

function selectLang(lang) {
  activeLang.value = lang
  if (injectedLang && injectedLang.value !== lang) {
    injectedLang.value = lang
  }
}

function updateValue(lang, value) {
  const current = (props.modelValue && typeof props.modelValue === 'object') ? props.modelValue : {}
  emit('update:modelValue', { ...current, [lang]: value })
}

function isMissing(lang) {
  if (!props.modelValue || typeof props.modelValue !== 'object') return true
  const v = props.modelValue[lang]
  return v === undefined || v === null || String(v).trim() === ''
}

// Compute ghost text or hint from another language if current is empty
const translationHint = computed(() => {
  if (!props.modelValue || typeof props.modelValue !== 'object') return ''
  if (!isMissing(activeLang.value)) return ''
  for (const l of props.languages) {
    if (l !== activeLang.value && props.modelValue[l] && String(props.modelValue[l]).trim()) {
      return `(${l.toUpperCase()}: ${props.modelValue[l]})`
    }
  }
  return ''
})

const computedPlaceholder = computed(() => {
  if (props.placeholder) {
    return translationHint.value ? `${props.placeholder} ${translationHint.value}` : props.placeholder
  }
  const fieldName = props.label ? props.label.toLowerCase() : 'text'
  const base = `Enter ${fieldName} in ${activeLang.value.toUpperCase()}`
  return translationHint.value ? `${base} ${translationHint.value}` : base
})
</script>

<template>
  <div class="form-group" :class="{ 'compact-field': compact }">
    <div class="flex-between mb-4" v-if="label || languages.length > 1">
      <label class="form-label mb-0" v-if="label">{{ label }}</label>
      <div class="i18n-tabs" v-if="languages.length > 1">
        <button
          type="button"
          v-for="lang in languages"
          :key="lang"
          class="i18n-tab"
          :class="{
            active: activeLang === lang,
            missing: isMissing(lang) && activeLang !== lang
          }"
          @click="selectLang(lang)"
          :title="isMissing(lang) ? `${lang.toUpperCase()} (Not translated)` : lang.toUpperCase()"
        >
          {{ lang }}
        </button>
      </div>
    </div>

    <input
      v-if="type === 'input'"
      class="form-input"
      :value="(modelValue && typeof modelValue === 'object' ? modelValue[activeLang] : '') || ''"
      @input="updateValue(activeLang, $event.target.value)"
      :placeholder="computedPlaceholder"
    />
    <textarea
      v-else
      class="form-textarea"
      :value="(modelValue && typeof modelValue === 'object' ? modelValue[activeLang] : '') || ''"
      @input="updateValue(activeLang, $event.target.value)"
      :placeholder="computedPlaceholder"
      rows="4"
    />
  </div>
</template>

<style scoped>
.mb-0 {
  margin-bottom: 0 !important;
}
.mb-4 {
  margin-bottom: 4px;
}
.compact-field {
  margin-bottom: 8px;
}
</style>
