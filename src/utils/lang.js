import locales from 'locale-codes'
import langs from 'langs'

export function getLangName(tag, displayLocale = 'en') {
  try {
    const dn = new Intl.DisplayNames([displayLocale], { type: 'language' })
    const dnNative = new Intl.DisplayNames([tag], { type: 'language' })
    let localName = dnNative.of(tag)
    let displayName = dn.of(tag)
    
    if (localName) localName = localName.charAt(0).toUpperCase() + localName.slice(1)
    if (displayName) displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1)

    if (localName && localName !== displayName) {
      return `${localName} (${displayName})`
    }
    return localName || tag
  } catch (e) {
    const l = locales.getByTag(tag)
    if (l) {
      return l.location ? `${l.local || l.name} (${l.location})` : (l.local || l.name)
    }
    return tag
  }
}

export function getNativeLangNameOnly(tag) {
  try {
    const dn = new Intl.DisplayNames([tag], { type: 'language' })
    const resolvedLocale = dn.resolvedOptions().locale
    const baseRequested = tag.split('-')[0].toLowerCase()
    const baseResolved = resolvedLocale.split('-')[0].toLowerCase()
    
    // If the browser fell back to a different language, it means it doesn't have native formatting
    if (baseResolved !== baseRequested) {
      throw new Error('Fallback detected')
    }
    
    let localName = dn.of(tag)
    if (localName) localName = localName.charAt(0).toUpperCase() + localName.slice(1)
    return localName
  } catch(e) {
    const base = tag.split('-')[0].toLowerCase()
    const l = langs.where('1', base) || langs.where('2', base) || langs.where('3', base)
    if (l && l.local) {
      // It has a local name! e.g. "Shqip"
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
  // Avoid exact duplicates
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
}).sort((a, b) => a.name.localeCompare(b.name))

const TOP_LANG_CODES = ['en', 'zh', 'hi', 'es', 'ar', 'fr', 'bn', 'pt', 'ru', 'id', 'ur', 'de', 'ja', 'mr', 'te']

export const commonLanguages = []
export const otherLanguages = []

baseLanguages.forEach(lang => {
  if (TOP_LANG_CODES.includes(lang.code)) {
    // We will sort commonLanguages based on the original TOP_LANG_CODES order later
  } else {
    otherLanguages.push(lang)
  }
})

// Keep top languages in the exact order specified by frequency
TOP_LANG_CODES.forEach(code => {
  const found = baseLanguages.find(l => l.code === code)
  if (found) {
    commonLanguages.push(found)
  }
})

export function getRegionsForBase(base) {
  if (!baseGroups[base]) return []
  return baseGroups[base].map(l => {
    return {
      code: l.tag,
      name: getNativeLangNameOnly(l.tag)
    }
  }).sort((a, b) => a.name.localeCompare(b.name))
}
