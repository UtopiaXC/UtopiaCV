// Editor i18n - localization for the editor UI itself
import { ref, computed } from 'vue'

const currentLocale = ref(localStorage.getItem('editor-locale') || 'en')

const messages = {
  en: {
    // Topbar
    'topbar.logo': 'Utopia CV',
    'topbar.import': 'Import JSON',
    'topbar.save': 'Save JSON',
    'topbar.generate': 'Generate HTML',

    // Initial Setup
    'setup.title': 'Welcome to Utopia CV',
    'setup.import_btn': 'Import JSON',
    'setup.scratch_btn': 'Start from Scratch',
    'setup.basic_info': 'Basic Information',
    'setup.brand_name': 'Title (Name)',
    'setup.supported_langs': 'Supported Languages (comma separated)',
    'setup.default_lang': 'Default Language',
    'setup.start_btn': 'Start Editing',
    'setup.or': 'OR',

    // Module List
    'modules.title': 'Modules',
    'modules.add': '+ Add Section',
    'modules.add_modal_title': 'Add New Section',
    'modules.section_id': 'Section ID',
    'modules.section_id_placeholder': 'e.g. publications, awards',
    'modules.section_type': 'Section Type',
    'modules.cancel': 'Cancel',
    'modules.confirm_add': 'Add',
    'modules.confirm_delete': 'Delete this section?',

    // Type labels
    'type.about': 'About',
    'type.timeline': 'Timeline',
    'type.card-grid': 'Cards',
    'type.project-grid': 'Projects',
    'type.contact': 'Contact',

    // Type options
    'type_opt.about': 'About (Profile)',
    'type_opt.timeline': 'Timeline (Experience)',
    'type_opt.card-grid': 'Card Grid (Research/Projects)',
    'type_opt.project-grid': 'Project Grid (Work w/ Tech Tags)',
    'type_opt.contact': 'Contact',

    // Global Settings
    'global.title': '⚙️ Global Settings',
    'global.subtitle': 'Site-wide configuration',
    'global.name_brand': 'Title Name',
    'global.default_lang': 'Default Language',
    'global.supported_langs': 'Supported Languages (comma separated)',
    'global.footer_text': 'Footer Text',
    'global.copyright_name': 'Copyright Name',
    'global.copyright_url': 'Copyright URL',
    'global.copyright_year': 'Copyright Start Year',
    'global.analytics': 'Analytics (Matomo)',
    'global.enable_matomo': 'Enable Matomo',
    'global.matomo_url': 'Matomo URL',
    'global.matomo_site_id': 'Site ID',

    // About Editor
    'about.title': '👤 About',
    'about.subtitle': 'Profile & introduction',
    'about.photo_url': 'Photo URL',
    'about.name': 'Name',
    'about.title_field': 'Title / Subtitle',
    'about.bio': 'Bio',
    'about.social_links': 'Social Links',
    'about.add_link': '+ Add Link',

    // Timeline Editor
    'timeline.title': '📋 Timeline',
    'timeline.subtitle_prefix': '',
    'timeline.subtitle_suffix': ' - Experience entries with logos',
    'timeline.section_title': 'Section Title',
    'timeline.items': 'Items',
    'timeline.add_item': '+ Add Item',
    'timeline.item_title': 'Title',
    'timeline.institution': 'Institution',
    'timeline.date_range': 'Date Range',
    'timeline.date_placeholder': '2024.04 ~ 2026.03',
    'timeline.description': 'Description',
    'timeline.department': 'Department',
    'timeline.logo_url': 'Logo URL',
    'timeline.logo_link': 'Logo Link',
    'timeline.department_link': 'Department Link',

    // Card Grid Editor
    'cardgrid.title': '🃏 Card Grid',
    'cardgrid.subtitle_prefix': '',
    'cardgrid.subtitle_suffix': ' - Cards with links',
    'cardgrid.section_title': 'Section Title',
    'cardgrid.items': 'Items',
    'cardgrid.add_item': '+ Add Item',
    'cardgrid.item_title': 'Title',
    'cardgrid.description': 'Description',
    'cardgrid.links': 'Links',
    'cardgrid.add_link': '+ Add Link',

    // Project Grid Editor
    'projectgrid.title': '🏢 Project Grid',
    'projectgrid.subtitle_prefix': '',
    'projectgrid.subtitle_suffix': ' - Work projects with tech tags',
    'projectgrid.section_title': 'Section Title',
    'projectgrid.items': 'Items',
    'projectgrid.add_item': '+ Add Item',
    'projectgrid.item_title': 'Title',
    'projectgrid.institution': 'Institution',
    'projectgrid.date_range': 'Date Range',
    'projectgrid.date_placeholder': '2023.10 ~ 2024.04',
    'projectgrid.description': 'Description',
    'projectgrid.tech_tags': 'Tech Tags',
    'projectgrid.add_tag_placeholder': 'Add tag...',

    // Contact Editor
    'contact.title': '📬 Contact',
    'contact.subtitle': 'Contact info & language skills',
    'contact.section_title': 'Section Title',
    'contact.email': 'Email',
    'contact.contact_text': 'Contact Text',
    'contact.language_skills': 'Language Skills',
    'contact.language_n': 'Language',
    'contact.lang_name': 'Name',
    'contact.lang_level': 'Level',
    'contact.add_language': '+ Add Language',
    'contact.additional_links': 'Additional Links',
    'contact.add_link': '+ Add Link',

    // Preview
    'preview.title': 'PREVIEW',
    'preview.light': '☀️ Light',
    'preview.dark': '🌙 Dark',
    'preview.refresh': '🔄',

    // Empty state
    'empty.icon': '📝',
    'empty.text': 'Select a module from the list above to start editing, or click ⚙️ for global settings.',

    // Common
    'common.move_up': 'Move up',
    'common.move_down': 'Move down',
    'common.delete': 'Delete',
    'common.url_placeholder': 'https://...',
    'common.label': 'Label',
    'common.url': 'URL',
    'common.tooltip': 'Tooltip',
    'common.unknown_type': 'Unknown section type',

    // Icon labels
    'icon.homepage': '🏠 Homepage',
    'icon.email': '✉️ Email',
    'icon.github': '🐙 GitHub',
    'icon.linkedin': '💼 LinkedIn',
    'icon.twitter': '🐦 Twitter',
    'icon.scholar': '📖 Google Scholar',
    'icon.link': '🔗 Link',
    'icon.book': '📚 Book/Paper',
    'icon.slides': '📊 Slides',
    'icon.home': '🏠 Homepage',
    'icon.web': '🌐 Web',
  },
  zh: {
    // Topbar
    'topbar.logo': 'Utopia CV',
    'topbar.import': '导入 JSON',
    'topbar.save': '保存 JSON',
    'topbar.generate': '生成 HTML',

    // Initial Setup
    'setup.title': '欢迎使用 Utopia CV',
    'setup.import_btn': '导入 JSON',
    'setup.scratch_btn': '从头开始',
    'setup.basic_info': '基本信息',
    'setup.brand_name': '标题（姓名）',
    'setup.supported_langs': '支持的语言',
    'setup.default_lang': '默认语言',
    'setup.start_btn': '开始编辑',
    'setup.or': '或',

    // Module List
    'modules.title': '模块',
    'modules.add': '+ 添加区块',
    'modules.add_modal_title': '添加新区块',
    'modules.section_id': '区块 ID',
    'modules.section_id_placeholder': '例如 publications、awards',
    'modules.section_type': '区块类型',
    'modules.cancel': '取消',
    'modules.confirm_add': '添加',
    'modules.confirm_delete': '确定删除此区块？',

    // Type labels
    'type.about': '关于',
    'type.timeline': '时间线',
    'type.card-grid': '卡片',
    'type.project-grid': '项目',
    'type.contact': '联系',

    // Type options
    'type_opt.about': '关于（个人简介）',
    'type_opt.timeline': '时间线（经历）',
    'type_opt.card-grid': '卡片网格（研究/项目）',
    'type_opt.project-grid': '项目网格（工作项目+技术标签）',
    'type_opt.contact': '联系方式',

    // Global Settings
    'global.title': '⚙️ 全局设置',
    'global.subtitle': '站点全局配置',
    'global.name_brand': '标题姓名',
    'global.default_lang': '默认语言',
    'global.supported_langs': '支持的语言',
    'global.footer_text': '页脚文本',
    'global.copyright_name': '版权所有者',
    'global.copyright_url': '版权链接',
    'global.copyright_year': '版权起始年份',
    'global.analytics': '分析（Matomo）',
    'global.enable_matomo': '启用 Matomo',
    'global.matomo_url': 'Matomo URL',
    'global.matomo_site_id': '站点 ID',

    // About Editor
    'about.title': '👤 关于',
    'about.subtitle': '个人简介',
    'about.photo_url': '头像 URL',
    'about.name': '姓名',
    'about.title_field': '头衔 / 副标题',
    'about.bio': '个人简介',
    'about.social_links': '社交链接',
    'about.add_link': '+ 添加链接',

    // Timeline Editor
    'timeline.title': '📋 时间线',
    'timeline.subtitle_prefix': '',
    'timeline.subtitle_suffix': ' - 带 Logo 的经历条目',
    'timeline.section_title': '区块标题',
    'timeline.items': '条目',
    'timeline.add_item': '+ 添加条目',
    'timeline.item_title': '标题',
    'timeline.institution': '机构',
    'timeline.date_range': '时间范围',
    'timeline.date_placeholder': '2024.04 ~ 2026.03',
    'timeline.description': '描述',
    'timeline.department': '部门',
    'timeline.logo_url': 'Logo URL',
    'timeline.logo_link': 'Logo 链接',
    'timeline.department_link': '部门链接',

    // Card Grid Editor
    'cardgrid.title': '🃏 卡片网格',
    'cardgrid.subtitle_prefix': '',
    'cardgrid.subtitle_suffix': ' - 带链接的卡片',
    'cardgrid.section_title': '区块标题',
    'cardgrid.items': '条目',
    'cardgrid.add_item': '+ 添加条目',
    'cardgrid.item_title': '标题',
    'cardgrid.description': '描述',
    'cardgrid.links': '链接',
    'cardgrid.add_link': '+ 添加链接',

    // Project Grid Editor
    'projectgrid.title': '🏢 项目网格',
    'projectgrid.subtitle_prefix': '',
    'projectgrid.subtitle_suffix': ' - 带技术标签的工作项目',
    'projectgrid.section_title': '区块标题',
    'projectgrid.items': '条目',
    'projectgrid.add_item': '+ 添加条目',
    'projectgrid.item_title': '标题',
    'projectgrid.institution': '机构',
    'projectgrid.date_range': '时间范围',
    'projectgrid.date_placeholder': '2023.10 ~ 2024.04',
    'projectgrid.description': '描述',
    'projectgrid.tech_tags': '技术标签',
    'projectgrid.add_tag_placeholder': '添加标签...',

    // Contact Editor
    'contact.title': '📬 联系方式',
    'contact.subtitle': '联系信息 & 语言能力',
    'contact.section_title': '区块标题',
    'contact.email': '邮箱',
    'contact.contact_text': '联系说明',
    'contact.language_skills': '语言能力',
    'contact.language_n': '语言',
    'contact.lang_name': '语言名称',
    'contact.lang_level': '水平',
    'contact.add_language': '+ 添加语言',
    'contact.additional_links': '附加链接',
    'contact.add_link': '+ 添加链接',

    // Preview
    'preview.title': '预览',
    'preview.light': '☀️ 浅色',
    'preview.dark': '🌙 深色',
    'preview.refresh': '🔄',

    // Empty state
    'empty.icon': '📝',
    'empty.text': '从上方列表选择一个模块开始编辑，或点击 ⚙️ 进入全局设置。',

    // Common
    'common.move_up': '上移',
    'common.move_down': '下移',
    'common.delete': '删除',
    'common.url_placeholder': 'https://...',
    'common.label': '标签',
    'common.url': 'URL',
    'common.tooltip': '提示文字',
    'common.unknown_type': '未知区块类型',

    // Icon labels
    'icon.homepage': '🏠 主页',
    'icon.email': '✉️ 邮箱',
    'icon.github': '🐙 GitHub',
    'icon.linkedin': '💼 LinkedIn',
    'icon.twitter': '🐦 Twitter',
    'icon.scholar': '📖 谷歌学术',
    'icon.link': '🔗 链接',
    'icon.book': '📚 论文',
    'icon.slides': '📊 幻灯片',
    'icon.home': '🏠 主页',
    'icon.web': '🌐 网站',
  }
}

export function useEditorI18n() {
  function t(key) {
    const locale = currentLocale.value
    return messages[locale]?.[key] || messages['en']?.[key] || key
  }

  function setLocale(locale) {
    currentLocale.value = locale
    localStorage.setItem('editor-locale', locale)
  }

  return {
    t,
    locale: currentLocale,
    setLocale,
    availableLocales: Object.keys(messages),
  }
}
