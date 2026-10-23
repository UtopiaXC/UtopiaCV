import locales from 'locale-codes'
import langs from 'langs'

// Explicit politically-neutral, well-curated region definitions for major languages
const CURATED_REGIONS = {
  zh: [
    { code: 'zh', name: '默认 / 通用' },
    { code: 'zh-CN', name: '大陆简体' },
    { code: 'zh-HK', name: '港澳繁体' },
    { code: 'zh-TW', name: '台湾繁体' },
    { code: 'zh-Hans', name: '简体' },
    { code: 'zh-Hant', name: '繁体' }
  ],
  en: [
    { code: 'en', name: 'Default / General' },
    { code: 'en-US', name: 'United States' },
    { code: 'en-GB', name: 'United Kingdom' },
    { code: 'en-CA', name: 'Canada' },
    { code: 'en-AU', name: 'Australia' }
  ],
  ja: [
    { code: 'ja', name: 'デフォルト / 通用' },
    { code: 'ja-JP', name: '日本' }
  ],
  ko: [
    { code: 'ko', name: '기본 / 通用' },
    { code: 'ko-KR', name: '대한민국' }
  ],
  fr: [
    { code: 'fr', name: 'Par défaut / Général' },
    { code: 'fr-FR', name: 'France' },
    { code: 'fr-CA', name: 'Canada' },
    { code: 'fr-BE', name: 'Belgique' },
    { code: 'fr-CH', name: 'Suisse' }
  ],
  de: [
    { code: 'de', name: 'Standard / Allgemein' },
    { code: 'de-DE', name: 'Deutschland' },
    { code: 'de-AT', name: 'Österreich' },
    { code: 'de-CH', name: 'Schweiz' }
  ],
  es: [
    { code: 'es', name: 'Predeterminado / General' },
    { code: 'es-ES', name: 'España' },
    { code: 'es-MX', name: 'México' },
    { code: 'es-AR', name: 'Argentina' }
  ],
  pt: [
    { code: 'pt', name: 'Padrão / Geral' },
    { code: 'pt-BR', name: 'Brasil' },
    { code: 'pt-PT', name: 'Portugal' }
  ],
  ru: [
    { code: 'ru', name: 'По умолчанию / Общий' },
    { code: 'ru-RU', name: 'Россия' }
  ],
  it: [
    { code: 'it', name: 'Predefinito / Generale' },
    { code: 'it-IT', name: 'Italia' }
  ],
  ar: [
    { code: 'ar', name: 'افتراضي / عام' }
  ],
  hi: [
    { code: 'hi', name: 'डिफ़ॉल्ट / सामान्य' },
    { code: 'hi-IN', name: 'भारत' }
  ]
}

export function getNativeLangNameOnly(tag) {
  if (!tag) return ''
  try {
    const dn = new Intl.DisplayNames([tag], { type: 'language' })
    const resolvedLocale = dn.resolvedOptions().locale
    const baseRequested = tag.split('-')[0].toLowerCase()
    const baseResolved = resolvedLocale.split('-')[0].toLowerCase()

    if (baseResolved !== baseRequested) {
      throw new Error('Fallback detected')
    }

    let localName = dn.of(tag)
    if (localName) localName = localName.charAt(0).toUpperCase() + localName.slice(1)
    return localName
  } catch (e) {
    const base = tag.split('-')[0].toLowerCase()
    const l = langs.where('1', base) || langs.where('2', base) || langs.where('3', base)
    if (l && l.local) {
      return l.local
    }
    const lc = locales.getByTag(tag)
    return lc ? (lc.local || lc.name) : tag
  }
}

// Group locales by base language
const baseGroups = {}
locales.all.forEach(l => {
  const [base] = l.tag.split('-')
  if (!baseGroups[base]) {
    baseGroups[base] = []
  }
  if (!baseGroups[base].find(x => x.tag === l.tag)) {
    baseGroups[base].push(l)
  }
})

// Generate list of base languages
export const baseLanguages = Object.keys(baseGroups).map(base => {
  return {
    code: base,
    name: getNativeLangNameOnly(base)
  }
}).sort((a, b) => (a.name || '').localeCompare(b.name || ''))

const PRIMARY_CODES = ['zh', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'pt', 'ru', 'it', 'ar', 'hi']

export const primaryLanguages = []
export const otherLanguages = []

PRIMARY_CODES.forEach(code => {
  const found = baseLanguages.find(l => l.code === code)
  if (found) {
    primaryLanguages.push(found)
  }
})

baseLanguages.forEach(lang => {
  if (!PRIMARY_CODES.includes(lang.code)) {
    otherLanguages.push(lang)
  }
})

/**
 * Get regions/dialects for a given base language
 * Always includes a default/general (no-region) option
 */
export function getRegionsForBase(base) {
  if (!base) return []
  const cleanBase = base.toLowerCase()
  if (CURATED_REGIONS[cleanBase]) {
    return CURATED_REGIONS[cleanBase]
  }

  const defaultOption = { code: cleanBase, name: 'Default / General' }
  const rawList = baseGroups[cleanBase] || []
  const variants = rawList
    .filter(l => l.tag.toLowerCase() !== cleanBase)
    .map(l => ({
      code: l.tag,
      name: l.location || getNativeLangNameOnly(l.tag)
    }))

  return [defaultOption, ...variants]
}

/**
 * Get full human-readable label formatted as "Language - Region" or "Language"
 * Strictly avoids political conflicts and formats clearly
 */
export function getLangFullLabel(tag) {
  if (!tag) return ''

  // Special curated labels
  const specialLabels = {
    'zh': '中文',
    'zh-CN': '中文 - 大陆简体',
    'zh-HK': '中文 - 港澳繁体',
    'zh-TW': '中文 - 台湾繁体',
    'zh-Hans': '中文 - 简体',
    'zh-Hant': '中文 - 繁体',
    'en': 'English',
    'en-US': 'English - United States',
    'en-GB': 'English - United Kingdom',
    'en-CA': 'English - Canada',
    'en-AU': 'English - Australia',
    'ja': '日本語',
    'ja-JP': '日本語 - 日本',
    'ko': '한국어',
    'ko-KR': '한국어 - 대한민국',
    'fr': 'Français',
    'fr-FR': 'Français - France',
    'fr-CA': 'Français - Canada',
    'de': 'Deutsch',
    'de-DE': 'Deutsch - Deutschland',
    'es': 'Español',
    'es-ES': 'Español - España',
    'es-MX': 'Español - México',
    'pt': 'Português',
    'pt-BR': 'Português - Brasil',
    'pt-PT': 'Português - Portugal',
    'ru': 'Русский',
    'ru-RU': 'Русский - Россия',
    'it': 'Italiano',
    'it-IT': 'Italiano - Italia',
    'ar': 'العربية',
    'hi': 'हिन्दी',
    'hi-IN': 'हिन्दी - भारत'
  }

  if (specialLabels[tag]) {
    return specialLabels[tag]
  }

  const parts = tag.split('-')
  const base = parts[0].toLowerCase()
  const baseName = getNativeLangNameOnly(base) || base

  if (parts.length === 1) {
    return baseName
  }

  const regionCode = parts[1]
  return `${baseName} - ${regionCode}`
}
