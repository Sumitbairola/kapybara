export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  slug: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  categories?: PostCategory[];
}

export interface PostCategory {
  id: number;
  name: string;
}

