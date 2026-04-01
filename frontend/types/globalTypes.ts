export interface Res<T> {
    success: boolean,
    message: string,
    data: T,
    errors: any[]
}

// File
export interface IFile {
    name: string,
    size: number,
    url: string
}

// Folder

export type IFolder = {
    folders: string[]
}

export type ISlide = {
    titleUz: string;
    titleEn: string;
    titleRu: string;
    titleKr: string;

    descriptionUz: string;
    descriptionRu: string;
    descriptionEn: string;
    descriptionKr: string;

    isActive: boolean;

    relatedPage: unknown | null;
    relatedPageId: number | null;

    mainImagePath: string;

    owner: unknown | null;
    ownerId: number;

    id: number;

    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export type meta = {
    totalCount: number;
    page: number;
    totalPages: number;
    pageSize: number;
} 

export type CreateNews = {
    titleUz: string;
    titleEn: string;
    titleRu: string;
    titleKr: string;
    descriptionUz: string;
    descriptionRu: string;
    descriptionEn: string;
    descriptionKr: string;
    contentUz: string;
    contentRu: string;
    contentEn: string;
    contentKr: string;
    mainImagePath: string;
}



export type CreateDNewsBody = CreateNews & {
    id: number;
    likes: number;
    views: number;
    owner: any | null; 
    ownerId: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}


export interface NewsItem {
  id: number;
  titleUz: string;
  titleEn: string;
  titleRu: string;
  titleKr: string;
  descriptionUz: string;
  descriptionRu: string;
  descriptionEn: string;
  descriptionKr: string;
  contentUz: string;
  contentRu: string;
  contentEn: string;
  contentKr: string;
  mainImagePath: string;
  likes: number;
  views: number;
  owner: any | null; 
  ownerId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null; 
}

export interface NewsItemDashboard extends CreateNews {
  id: number;
  likes: number;
  views: number;
  owner: any | null; 
  ownerId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type SimplePageDashboard = {
    titleUz: string;
    titleEn: string;
    titleRu: string;
    titleKr: string;
    contentUz: string;
    contentRu: string;
    contentEn: string;
    contentKr: string;
}
export type ContentDetails = {
  workStartTime: string;
  workEndTime: string;
  receptionDays: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  fathersName: string;
  dateOfBirth: string;
  position: string;
  address: string;
  mainImgURL: string;
  content: string; 
}

export interface DepartmentDetails {
    name: string;
    address: string;
    phone: string;
    email: string;
    facebook: string;
    telegram: string;
    linkedin: string;
    mainPicture: string;
}

export interface MenuItemDashboard {
  id: number;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  nameKr: string;
  priority: number;
  parentId: number | null;
  children: MenuItemDashboard[];
  relatedPage: any | null; 
  relatedPageId: number | null;
  externalLink: string | null;
  owner: any | null; 
  ownerId: number | null;
  createdAt: string; 
  updatedAt: string; 
  deletedAt: string | null; 
}

export interface MenuItemCreateDashboard {
    nameUz: string;
  nameRu: string;
  nameEn: string;
  nameKr: string;
  priority: number;
  parentId: number | null;
  relatedPageId: number | null;
  externalLink: string | null;

}