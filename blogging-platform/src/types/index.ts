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
  // use a broader type here because the server returns a string for status
  status: string;
  createdAt: Date;
  updatedAt: Date;
  categories?: PostCategory[];
}

export interface PostCategory {
  id: number;
  name: string;
}

