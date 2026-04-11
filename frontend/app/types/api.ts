export interface ApiResponse<T> {
  success: boolean
  statusCode: number
  message: string
  data: T
  errors: { field: string, message: string }[]
}

export interface PaginationMeta {
  totalCount: number
  page: number
  totalPages: number
  pageSize: number
}

export interface Paginated<T> {
  items: T[]
  meta: PaginationMeta
}

export type LocaleSuffix = 'Uz' | 'Kr' | 'Ru' | 'En'

export enum PageType {
  Simple = 0,
  Employee = 1,
  Department = 2
}

export interface PublicationListItem {
  id: number
  slug: string
  title: string
  description: string
  mainImagePath: string
  views: number
  likes: number
  publishedAt: string
  updatedAt: string
}

export interface PublicationDetail extends PublicationListItem {
  content: string
  related: PublicationListItem[]
}

export interface PublicPage {
  id: number
  slug: string
  pageType: PageType
  title: string
  content: string
  excerpt: string
  views: number
  createdAt: string
  updatedAt: string
}

export interface PublicSlide {
  id: number
  title: string
  description: string
  mainImagePath: string
  link: string | null
  isExternal: boolean
}

export interface PublicMenu {
  id: number
  name: string
  priority: number
  link: string | null
  isExternal: boolean
  children: PublicMenu[]
}

export interface PublicUsefulLink {
  id: number
  name: string
  externalLink: string
  imagePath: string
}

export interface EmployeeDetails {
  firstName: string
  lastName: string
  fathersName: string
  position: string
  dateOfBirth: string
  address: string
  phoneNumber: string
  email: string
  receptionDays: string
  workStartTime: string
  workEndTime: string
  mainImgURL: string
  content: string
}

export interface DepartmentDetails {
  name: string
  address: string
  phone: string
  email: string
  facebook: string
  telegram: string
  linkedin: string
  mainPicture: string
  content: string
}

interface Timestamps {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface Publication extends Timestamps {
  slug: string
  titleUz: string
  titleKr: string
  titleRu: string
  titleEn: string
  descriptionUz: string
  descriptionKr: string
  descriptionRu: string
  descriptionEn: string
  contentUz: string
  contentKr: string
  contentRu: string
  contentEn: string
  mainImagePath: string
  views: number
  likes: number
  isPublished: boolean
  publishedAt: string
  ownerId: number | null
}

export interface Page extends Timestamps {
  pageType: PageType
  slug: string
  titleUz: string
  titleKr: string
  titleRu: string
  titleEn: string
  contentUz: string
  contentKr: string
  contentRu: string
  contentEn: string
  isPublished: boolean
  views: number
}

export interface PageOption {
  id: number
  titleUz: string
  slug: string
  pageType: PageType
}

export interface Slide extends Timestamps {
  titleUz: string
  titleKr: string
  titleRu: string
  titleEn: string
  descriptionUz: string
  descriptionKr: string
  descriptionRu: string
  descriptionEn: string
  mainImagePath: string
  externalLink: string | null
  isActive: boolean
  priority: number
  relatedPageId: number | null
  relatedPage: Page | null
}

export interface Menu extends Timestamps {
  nameUz: string
  nameKr: string
  nameRu: string
  nameEn: string
  priority: number
  parentId: number | null
  relatedPageId: number | null
  relatedPage: Page | null
  externalLink: string | null
  children: Menu[]
}

export interface UsefulLink extends Timestamps {
  nameUz: string
  nameKr: string
  nameRu: string
  nameEn: string
  externalLink: string
  imagePath: string
  priority: number
  isActive: boolean
}

export interface FileItem {
  name: string
  url: string
  size: number
  kind: 'image' | 'video' | 'document' | 'archive' | 'other'
  modifiedAt: string
}

export interface LatestItem {
  id: number
  titleUz: string
  slug: string
  views: number
  publishedAt: string
}

export interface DashboardStats {
  news: number
  announcements: number
  pages: number
  slides: number
  activeSlides: number
  menus: number
  usefulLinks: number
  files: number
  totalViews: number
  latestNews: LatestItem[]
  popularNews: LatestItem[]
  latestAnnouncements: LatestItem[]
}

export interface AdminUser {
  id: number
  username: string
  fullName: string
  role: 'admin' | 'editor'
  lastLoginAt: string | null
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: string
  user: AdminUser
}
