<script setup>
import { ref, watch, computed } from 'vue'
import { primaryLanguages, otherLanguages, getRegionsForBase } from '../utils/lang.js'
import { useEditorI18n } from '../i18n/editor-i18n.js'

const { t } = useEditorI18n()
const emit = defineEmits(['add'])

const selectedBase = ref('')
const selectedRegionCode = ref('')

const availableRegions = computed(() => {
  if (!selectedBase.value) return []
  return getRegionsForBase(selectedBase.value)
})

// When base changes, set region to the first available (default / general option)
watch(selectedBase, (newBase) => {
  if (newBase) {
    const regions = getRegionsForBase(newBase)
    selectedRegionCode.value = regions[0]?.code || newBase
  } else {
    selectedRegionCode.value = ''
  }
})

function handleAdd() {
  const code = selectedRegionCode.value || selectedBase.value
  if (!code) return
  emit('add', code)
  selectedBase.value = ''
  selectedRegionCode.value = ''
}
</script>

<template>
  <div class="lang-picker-box">
    <div class="lang-picker-controls">
      <!-- Step 1: Select Language -->
      <select class="form-select lang-select" v-model="selectedBase">
        <option value="" disabled>{{ t('lang_picker.select_lang') }}</option>
        <optgroup label="Primary Languages / 主要语言">
          <option v-for="lang in primaryLanguages" :key="lang.code" :value="lang.code">
            {{ lang.name }} ({{ lang.code }})
          </option>
        </optgroup>
        <optgroup label="Other Languages / 其它语言">
          <option v-for="lang in otherLanguages" :key="lang.code" :value="lang.code">
            {{ lang.name }} ({{ lang.code }})
          </option>
        </optgroup>
      </select>

      <!-- Step 2: Select Region (only when language selected) -->
      <select
        v-if="selectedBase && availableRegions.length > 0"
        class="form-select region-select"
        v-model="selectedRegionCode"
      >
        <option v-for="reg in availableRegions" :key="reg.code" :value="reg.code">
          {{ reg.name }} ({{ reg.code }})
        </option>
      </select>
    </div>

    <!-- Step 3: Add button -->
    <button
      type="button"
      class="btn btn-sm btn-primary add-lang-btn"
      :disabled="!selectedBase"
      @click="handleAdd"
    >
      {{ t('lang_picker.add_btn') }}
    </button>
  </div>
</template>

<style scoped>
.lang-picker-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}
.lang-picker-controls {
  display: flex;
  gap: 8px;
  width: 100%;
}
.lang-select {
  flex: 1;
  min-width: 0;
}
.region-select {
  flex: 1;
  min-width: 0;
}
.add-lang-btn {
  align-self: flex-start;
}
</style>
