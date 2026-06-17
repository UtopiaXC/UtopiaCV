<script setup>
/**
 * I18nField - Multi-language input/textarea with language tabs
 * Props:
 *   modelValue: { en: "...", zh: "...", ja: "..." }
 *   languages: ['en', 'zh', 'ja']
 *   label: "Field Name"
 *   type: 'input' | 'textarea'
 */
import { ref } from 'vue'

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  languages: { type: Array, default: () => ['en'] },
  label: { type: String, default: '' },
  type: { type: String, default: 'input' }, // 'input' or 'textarea'
  placeholder: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

const activeLang = ref(props.languages[0] || 'en')

function updateValue(lang, value) {
  const updated = { ...props.modelValue, [lang]: value }
  emit('update:modelValue', updated)
}

function isMissing(lang) {
  return !props.modelValue[lang] || props.modelValue[lang].trim() === ''
}
</script>

<template>
  <div class="form-group">
    <label class="form-label" v-if="label">{{ label }}</label>
    <div class="i18n-tabs">
      <button
        v-for="lang in languages"
        :key="lang"
        class="i18n-tab"
        :class="{ active: activeLang === lang, missing: isMissing(lang) && activeLang !== lang }"
        @click="activeLang = lang"
      >
        {{ lang }}
      </button>
    </div>
    <input
      v-if="type === 'input'"
      class="form-input"
      :value="modelValue[activeLang] || ''"
      @input="updateValue(activeLang, $event.target.value)"
      :placeholder="placeholder || `Enter ${label?.toLowerCase() || 'text'} in ${activeLang.toUpperCase()}`"
    />
    <textarea
      v-else
      class="form-textarea"
      :value="modelValue[activeLang] || ''"
      @input="updateValue(activeLang, $event.target.value)"
      :placeholder="placeholder || `Enter ${label?.toLowerCase() || 'text'} in ${activeLang.toUpperCase()}`"
      rows="4"
    />
  </div>
</template>
