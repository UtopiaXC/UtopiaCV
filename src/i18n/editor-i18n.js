// Editor i18n - localization for the editor UI itself
import { ref } from 'vue'

function getDefaultLocale() {
  const saved = localStorage.getItem('editor-locale')
  if (saved && (saved === 'en' || saved === 'zh')) {
    return saved
  }
  const navLang = (typeof navigator !== 'undefined' && navigator.language ? navigator.language : '').toLowerCase()
  return navLang.startsWith('zh') ? 'zh' : 'en'
}

const currentLocale = ref(getDefaultLocale())

const messages = {
  en: {
    // Topbar
    'topbar.logo': 'Utopia CV',
    'topbar.import': 'Import JSON',
    'topbar.save': 'Save JSON',
    'topbar.generate': 'Generate HTML',

    // Initial Setup
    'setup.title': 'Welcome to Utopia CV',
    'setup.subtitle': 'Create a modern, responsive, multilingual developer resume in minutes.',
    'setup.demo_btn': 'Start with Demo Template',
    'setup.demo_desc': 'Pre-filled with rich multilingual sample data in English, Chinese, Japanese',
    'setup.scratch_btn': 'Start from Scratch',
    'setup.scratch_desc': 'Create an empty resume and add your own custom sections',
    'setup.import_btn': 'Import Existing JSON',
    'setup.import_desc': 'Continue editing from a previously saved cv-data.json',
    'setup.basic_info': 'Basic Information',
    'setup.brand_name': 'Brand or Header Name',
    'setup.supported_langs': 'Supported Languages',
    'setup.default_lang': 'Default Language',
    'setup.start_btn': 'Start Editing',
    'setup.create_btn': 'Create',
    'setup.or': 'OR',

    // Module List
    'modules.title': 'Modules',
    'modules.global_settings': 'Global Settings',
    'modules.global_settings_desc': 'Brand, languages, custom CSS and JavaScript',
    'modules.add': '+ Add Section',
    'modules.add_modal_title': 'Add New Section',
    'modules.section_name': 'Module Name',
    'modules.section_name_placeholder': 'e.g. Work History, Honors, Selected Publications',
    'modules.section_name_hint': 'For editor organization only. Not displayed on the public resume.',
    'modules.section_id': 'Section ID',
    'modules.section_id_placeholder': 'e.g. publications, awards, skills',
    'modules.section_type': 'Section Type',
    'modules.cancel': 'Cancel',
    'modules.confirm_add': 'Add Section',
    'modules.confirm_delete': 'Are you sure you want to delete this section?',
    'modules.duplicate_id': 'Section ID already exists. Please choose a unique ID.',
    'modules.id_invalid': 'Section ID must contain only letters, numbers, and hyphens.',

    // Type labels & options (No parentheses)
    'type.about': 'About',
    'type.timeline': 'Timeline',
    'type.card-grid': 'Card Grid',
    'type.project-grid': 'Project Grid',
    'type.contact': 'Contact',

    'type_opt.about': 'About',
    'type_opt.timeline': 'Timeline',
    'type_opt.card-grid': 'Card Grid',
    'type_opt.project-grid': 'Project Grid',
    'type_opt.contact': 'Contact',

    // Section Internal Name
    'section.internal_name': 'Module Display Name',
    'section.internal_name_desc': 'Internal name used in the editor sidebar. Not shown on the public resume.',

    // Global Settings
    'global.title': 'Global Settings',
    'global.subtitle': 'Site-wide configuration, languages, and custom code',
    'global.name_brand': 'Brand or Header Title',
    'global.default_lang': 'Default Language',
    'global.supported_langs': 'Supported CV Languages',
    'global.footer_text': 'Footer Text',
    'global.copyright_name': 'Copyright Name',
    'global.copyright_url': 'Copyright URL',
    'global.copyright_year': 'Copyright Start Year',
    'global.custom_code': 'Custom Code',
    'global.custom_css': 'Custom CSS',
    'global.custom_css_placeholder': '/* Additional custom CSS rules to inject into <style> */\nbody {\n  /* custom style */\n}',
    'global.custom_js': 'Custom JavaScript',
    'global.custom_js_placeholder': '// Custom JavaScript or analytics code to inject into <script>\nconsole.log("Custom script loaded");',

    // Language Bar
    'lang_bar.editing_lang': 'Editing Language',
    'lang_bar.hint': 'All multilingual fields switch together',

    // Language Picker
    'lang_picker.select_lang': 'Select Language',
    'lang_picker.select_region': 'Select Region or Dialect',
    'lang_picker.default_region': 'Default or General',
    'lang_picker.add_btn': 'Add Language',

    // About Editor
    'about.title': 'About',
    'about.subtitle': 'Profile and introduction',
    'about.photo_url': 'Photo or Avatar URL',
    'about.photo_preview': 'Preview',
    'about.name': 'Name',
    'about.title_field': 'Title or Subtitle',
    'about.bio': 'Bio or Summary',
    'about.social_links': 'Social Links',
    'about.add_link': '+ Add Social Link',

    // Timeline Editor
    'timeline.title': 'Timeline',
    'timeline.subtitle_prefix': '',
    'timeline.subtitle_suffix': ' - Experience entries with logos',
    'timeline.section_title': 'Section Public Title',
    'timeline.items': 'Timeline Items',
    'timeline.add_item': '+ Add Item',
    'timeline.item_title': 'Title or Role',
    'timeline.institution': 'Institution or Company',
    'timeline.date_range': 'Date Range',
    'timeline.date_placeholder': '2024.04 - 2026.03',
    'timeline.description': 'Description',
    'timeline.department': 'Department or Notes',
    'timeline.logo_url': 'Logo URL',
    'timeline.logo_link': 'Logo Link URL',
    'timeline.department_link': 'Department Link URL',

    // Card Grid Editor
    'cardgrid.title': 'Card Grid',
    'cardgrid.subtitle_prefix': '',
    'cardgrid.subtitle_suffix': ' - Cards with links',
    'cardgrid.section_title': 'Section Public Title',
    'cardgrid.items': 'Items',
    'cardgrid.add_item': '+ Add Item',
    'cardgrid.item_title': 'Title',
    'cardgrid.description': 'Description',
    'cardgrid.links': 'Links',
    'cardgrid.add_link': '+ Add Link',
    'cardgrid.link_label': 'Label',

    // Project Grid Editor
    'projectgrid.title': 'Project Grid',
    'projectgrid.subtitle_prefix': '',
    'projectgrid.subtitle_suffix': ' - Work projects with tech tags',
    'projectgrid.section_title': 'Section Public Title',
    'projectgrid.items': 'Projects',
    'projectgrid.add_item': '+ Add Project',
    'projectgrid.item_title': 'Project Title',
    'projectgrid.institution': 'Organization or Context',
    'projectgrid.date_range': 'Date Range',
    'projectgrid.date_placeholder': '2023.10 - 2024.04',
    'projectgrid.description': 'Description',
    'projectgrid.tech_tags': 'Tech Tags',
    'projectgrid.add_tag_placeholder': 'Add tag and press Enter...',

    // Contact Editor
    'contact.title': 'Contact',
    'contact.subtitle': 'Contact info and language skills',
    'contact.section_title': 'Section Public Title',
    'contact.email': 'Email',
    'contact.contact_text': 'Contact Description',
    'contact.language_skills': 'Language Skills',
    'contact.language_n': 'Language Item',
    'contact.lang_name': 'Language Name',
    'contact.lang_level': 'Proficiency Level',
    'contact.add_language': '+ Add Language Skill',
    'contact.additional_links': 'Additional Links',
    'contact.add_link': '+ Add Link',

    // Preview
    'preview.title': 'Preview',
    'preview.light': 'Light',
    'preview.dark': 'Dark',
    'preview.refresh': 'Refresh',

    // Empty state
    'empty.title': 'No Module Selected',
    'empty.text': 'Select a module from the list on the left to start editing, or click Global Settings for configuration.',

    // Common
    'common.move_up': 'Move up',
    'common.move_down': 'Move down',
    'common.delete': 'Delete',
    'common.url_placeholder': 'https://...',
    'common.label': 'Label',
    'common.url': 'URL',
    'common.tooltip': 'Tooltip',
    'common.unknown_type': 'Unknown section type',
    'common.close': 'Close',
    'common.add': 'Add',
    'common.edit': 'Edit',

    // Icon labels
    'icon.homepage': 'Homepage',
    'icon.email': 'Email',
    'icon.github': 'GitHub',
    'icon.linkedin': 'LinkedIn',
    'icon.twitter': 'Twitter',
    'icon.scholar': 'Google Scholar',
    'icon.link': 'Link',
    'icon.book': 'Paper or Book',
    'icon.slides': 'Slides',
    'icon.home': 'Home',
    'icon.web': 'Website',
  },
  zh: {
    // Topbar
    'topbar.logo': 'Utopia CV',
    'topbar.import': '导入 JSON',
    'topbar.save': '保存 JSON',
    'topbar.generate': '生成 HTML',

    // Initial Setup
    'setup.title': '欢迎使用 Utopia CV',
    'setup.subtitle': '快速创建现代、响应式、多语言的个人简历。',
    'setup.demo_btn': '使用示例模板开始',
    'setup.demo_desc': '预置中文、英语、日语多语言完整示例数据',
    'setup.scratch_btn': '从空白开始',
    'setup.scratch_desc': '创建空白简历并根据需要添加自定义模块',
    'setup.import_btn': '导入已有 JSON',
    'setup.import_desc': '继续编辑之前保存的 cv-data.json 文件',
    'setup.basic_info': '基本信息',
    'setup.brand_name': '标题或姓名',
    'setup.supported_langs': '支持的语言',
    'setup.default_lang': '默认语言',
    'setup.start_btn': '开始编辑',
    'setup.create_btn': '开始创建',
    'setup.or': '或',

    // Module List
    'modules.title': '模块列表',
    'modules.global_settings': '全局设置',
    'modules.global_settings_desc': '站点信息、语言支持、自定义代码',
    'modules.add': '+ 添加区块',
    'modules.add_modal_title': '添加新区块',
    'modules.section_name': '模块名称',
    'modules.section_name_placeholder': '例如 工作经历、获奖荣誉、代表论文',
    'modules.section_name_hint': '仅用于后台编辑管理，不会展示在生成的简历上',
    'modules.section_id': '区块 ID',
    'modules.section_id_placeholder': '页面锚点，如 publications、awards、skills',
    'modules.section_type': '区块类型',
    'modules.cancel': '取消',
    'modules.confirm_add': '添加区块',
    'modules.confirm_delete': '确定删除此区块？',
    'modules.duplicate_id': '区块 ID 已存在，请使用唯一的 ID。',
    'modules.id_invalid': '区块 ID 只能包含字母、数字和连字符。',

    // Type labels & options (No parentheses)
    'type.about': '关于',
    'type.timeline': '时间线',
    'type.card-grid': '卡片网格',
    'type.project-grid': '项目网格',
    'type.contact': '联系方式',

    'type_opt.about': '关于',
    'type_opt.timeline': '时间线',
    'type_opt.card-grid': '卡片网格',
    'type_opt.project-grid': '项目网格',
    'type_opt.contact': '联系方式',

    // Section Internal Name
    'section.internal_name': '模块管理名称',
    'section.internal_name_desc': '仅在后台侧边栏显示，用于方便管理模块，不会出现在简历中。',

    // Global Settings
    'global.title': '全局设置',
    'global.subtitle': '站点全局配置、语言支持与自定义代码',
    'global.name_brand': '导航栏名称或品牌',
    'global.default_lang': '默认语言',
    'global.supported_langs': '简历支持的语言',
    'global.footer_text': '页脚文本',
    'global.copyright_name': '版权所有者',
    'global.copyright_url': '版权链接',
    'global.copyright_year': '版权起始年份',
    'global.custom_code': '自定义代码',
    'global.custom_css': '自定义 CSS',
    'global.custom_css_placeholder': '/* 自定义 CSS 样式，将注入到页面的 <style> 中 */\nbody {\n  /* 自定义样式 */\n}',
    'global.custom_js': '自定义 JavaScript',
    'global.custom_js_placeholder': '// 自定义 JavaScript 脚本，将注入到页面的 <script> 中\nconsole.log("自定义脚本已加载");',

    // Language Bar
    'lang_bar.editing_lang': '当前编辑语言',
    'lang_bar.hint': '切换后所有多语言输入框将同步切换',

    // Language Picker
    'lang_picker.select_lang': '选择语言',
    'lang_picker.select_region': '选择地区或变体',
    'lang_picker.default_region': '默认或通用',
    'lang_picker.add_btn': '添加语言',

    // About Editor
    'about.title': '关于',
    'about.subtitle': '个人简介与社交账号',
    'about.photo_url': '照片或头像 URL',
    'about.photo_preview': '头像预览',
    'about.name': '姓名',
    'about.title_field': '头衔或副标题',
    'about.bio': '个人简介',
    'about.social_links': '社交链接',
    'about.add_link': '+ 添加社交链接',

    // Timeline Editor
    'timeline.title': '时间线',
    'timeline.subtitle_prefix': '',
    'timeline.subtitle_suffix': ' - 经历条目',
    'timeline.section_title': '简历展示标题',
    'timeline.items': '时间线条目',
    'timeline.add_item': '+ 添加条目',
    'timeline.item_title': '职位或角色',
    'timeline.institution': '机构或公司',
    'timeline.date_range': '时间范围',
    'timeline.date_placeholder': '2024.04 - 2026.03',
    'timeline.description': '经历描述',
    'timeline.department': '部门或备注',
    'timeline.logo_url': 'Logo URL',
    'timeline.logo_link': 'Logo 链接 URL',
    'timeline.department_link': '部门链接 URL',

    // Card Grid Editor
    'cardgrid.title': '卡片网格',
    'cardgrid.subtitle_prefix': '',
    'cardgrid.subtitle_suffix': ' - 带链接的卡片列表',
    'cardgrid.section_title': '简历展示标题',
    'cardgrid.items': '卡片条目',
    'cardgrid.add_item': '+ 添加条目',
    'cardgrid.item_title': '卡片标题',
    'cardgrid.description': '卡片描述',
    'cardgrid.links': '相关链接',
    'cardgrid.add_link': '+ 添加链接',
    'cardgrid.link_label': '链接文本',

    // Project Grid Editor
    'projectgrid.title': '项目网格',
    'projectgrid.subtitle_prefix': '',
    'projectgrid.subtitle_suffix': ' - 项目卡片',
    'projectgrid.section_title': '简历展示标题',
    'projectgrid.items': '项目列表',
    'projectgrid.add_item': '+ 添加项目',
    'projectgrid.item_title': '项目名称',
    'projectgrid.institution': '所属机构或背景',
    'projectgrid.date_range': '时间范围',
    'projectgrid.date_placeholder': '2023.10 - 2024.04',
    'projectgrid.description': '项目描述',
    'projectgrid.tech_tags': '技术栈标签',
    'projectgrid.add_tag_placeholder': '输入标签并按回车...',

    // Contact Editor
    'contact.title': '联系方式',
    'contact.subtitle': '联系信息与语言能力',
    'contact.section_title': '简历展示标题',
    'contact.email': '电子邮箱',
    'contact.contact_text': '联系说明',
    'contact.language_skills': '语言能力',
    'contact.language_n': '语言条目',
    'contact.lang_name': '语言名称',
    'contact.lang_level': '熟练程度',
    'contact.add_language': '+ 添加语言能力',
    'contact.additional_links': '附加链接',
    'contact.add_link': '+ 添加链接',

    // Preview
    'preview.title': '实时预览',
    'preview.light': '浅色',
    'preview.dark': '深色',
    'preview.refresh': '刷新',

    // Empty state
    'empty.title': '未选择模块',
    'empty.text': '请在左侧列表中点击选择一个模块开始编辑，或点击全局设置进入站点配置。',

    // Common
    'common.move_up': '上移',
    'common.move_down': '下移',
    'common.delete': '删除',
    'common.url_placeholder': 'https://...',
    'common.label': '标签',
    'common.url': 'URL',
    'common.tooltip': '提示文字',
    'common.unknown_type': '未知区块类型',
    'common.close': '关闭',
    'common.add': '添加',
    'common.edit': '编辑',

    // Icon labels
    'icon.homepage': '个人主页',
    'icon.email': '电子邮箱',
    'icon.github': 'GitHub',
    'icon.linkedin': 'LinkedIn',
    'icon.twitter': 'Twitter',
    'icon.scholar': '谷歌学术',
    'icon.link': '外部链接',
    'icon.book': '论文或著作',
    'icon.slides': '幻灯片',
    'icon.home': '主页',
    'icon.web': '网站',
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
