import type { LocaleSuffix } from '~/types/api'

export const adminLocales: { label: string, suffix: LocaleSuffix, icon: string }[] = [
  { label: 'O‘zbekcha', suffix: 'Uz', icon: 'i-circle-flags-uz' },
  { label: 'Ўзбекча', suffix: 'Kr', icon: 'i-circle-flags-uz' },
  { label: 'Русский', suffix: 'Ru', icon: 'i-circle-flags-ru' },
  { label: 'English', suffix: 'En', icon: 'i-circle-flags-gb' }
]

export const adminNavigation = [
  [
    { label: 'Boshqaruv paneli', icon: 'i-lucide-layout-dashboard', to: '/admin', exact: true },
    { label: 'Yangiliklar', icon: 'i-lucide-newspaper', to: '/admin/news' },
    { label: 'E’lonlar', icon: 'i-lucide-megaphone', to: '/admin/announcements' },
    { label: 'Sahifalar', icon: 'i-lucide-files', to: '/admin/pages' }
  ],
  [
    { label: 'Menyu', icon: 'i-lucide-list-tree', to: '/admin/menu' },
    { label: 'Slaydlar', icon: 'i-lucide-gallery-horizontal-end', to: '/admin/slides' },
    { label: 'Foydali havolalar', icon: 'i-lucide-link', to: '/admin/useful-links' },
    { label: 'Fayllar', icon: 'i-lucide-folder-open', to: '/admin/files' }
  ]
]

export const pageTypeMeta = [
  { value: 0, label: 'Oddiy sahifa', icon: 'i-lucide-file-text', color: 'primary' as const },
  { value: 1, label: 'Rahbar sahifasi', icon: 'i-lucide-user-round', color: 'secondary' as const },
  { value: 2, label: 'Kafedra sahifasi', icon: 'i-lucide-building-2', color: 'success' as const }
]
