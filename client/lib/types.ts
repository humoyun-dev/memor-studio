export interface ProjectsType {
  id: number;
  slug: string;
  title: string;
  category: string;
  location: string;
  year: null | string;
  area: string;
  cover_url: string;
  tags: string[];
  description: string;
  partners: {
    id: number;
    name: string;
  }[];
  gallery: string[];
}

export interface MembersType {
  id: number;
  slug: string;
  name: string;
  role: string;
  photo_url: string;
  bio: string;
  socials: {
    https: string;
  }[];
}

export interface NewsType {
  id: number;
  slug: string;
  title: string;
  date: string;
  cover_url: string;
  tags: string[];
  body: string;
}

export interface AwardsType {
  id: number;
  title: string;
  organization: string;
  nomination: string;
  place: string;
  score: string;
  date: string;
  projects_total: number;
  description: string;
  projects: {
    id: number;
    slug: string;
    title: string;
  }[];
}
