export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
};

export type Author = {
  id: number;
  name: string;
  slug: string;
  bio: string | null;
  avatar_url: string | null;
};

export type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  image_caption: string | null;
  source_name: string | null;
  source_url: string | null;
  is_featured: boolean;
  is_breaking: boolean;
  published_at: string;
  views: number;
  status: "draft" | "published" | "archived";
  category_id: number;
  author_id: number;
  category: Category | null;
  author: Author | null;
};
