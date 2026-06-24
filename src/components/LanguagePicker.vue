<script setup>
import { ref, watch, computed } from 'vue'
import { commonLanguages, otherLanguages, getRegionsForBase } from '../utils/lang.js'

const emit = defineEmits(['add'])

const selectedBase = ref('')
const selectedRegion = ref('')

const availableRegions = computed(() => {
  if (!selectedBase.value) return []
  return getRegionsForBase(selectedBase.value)
})

watch(selectedRegion, (newVal) => {
  if (newVal) {
    emit('add', newVal)
    // reset selection after adding
    selectedBase.value = ''
    selectedRegion.value = ''
  }
})
</script>

<template>
  <div class="lang-picker-container">
    <select class="form-select" v-model="selectedBase" style="flex: 1;">
      <option value="">+ Select Language...</option>
      <optgroup label="Top Languages">
        <option v-for="lang in commonLanguages" :key="lang.code" :value="lang.code">{{ lang.name }}</option>
      </optgroup>
      <optgroup label="All Languages">
        <option v-for="lang in otherLanguages" :key="lang.code" :value="lang.code">{{ lang.name }}</option>
      </optgroup>
    </select>
    <select class="form-select" v-if="selectedBase" v-model="selectedRegion" style="flex: 1;">
      <option value="">-- Select Region --</option>
      <option v-for="reg in availableRegions" :key="reg.code" :value="reg.code">{{ reg.name }}</option>
    </select>
  </div>
</template>

<style scoped>
.lang-picker-container {
  display: flex;
  gap: 8px;
  width: 100%;
}
</style>
