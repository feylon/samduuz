export interface IMenuItem {
  id: number;
  name: string;
  priority: number;

  parent: IMenuItem | null;
  parentId: number | null;

  children: IMenuItem[];

  relatedPage: any | null; 
  relatedPageId: number | null;

  externalLink: string | null;
}


export interface SlideMainPage {
  id: number;
  title: string;
  description: string;
  relatedPage: RelatedPage;
  mainImagePath: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RelatedPage {
  id: number;
  titleUz: string;
  titleEn: string;
  titleRu: string;
  titleKr: string;
  pageType: number;

  contentUz: string;
  contentRu: string;
  contentEn: string;
  contentKr: string;

  owner: any | null;
  ownerId: number;
  menu: any | null;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface INewsItemMainPage {
  id: number;
  title: string;
  description: string;
  content: string;
  mainImagePath: string;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface INewsResponse {
  items: INewsItemMainPage[];
}

export interface IPage {
  id : number;
  title : string;
  content : string;
  createdAt : string;
  updatedAt : string;
  pageType : number;
}
