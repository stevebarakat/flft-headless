export type WpImage = {
  sourceUrl: string;
  altText: string;
  mediaDetails?: {
    width: number;
    height: number;
  };
};

export type WpMenuItem = {
  id: string;
  label: string;
  url: string;
  path?: string | null;
  childItems?: {
    nodes: WpMenuItem[];
  } | null;
};

export type WpMenu = {
  name: string;
  menuItems: {
    nodes: WpMenuItem[];
  };
};

export type WpPage = {
  id: string;
  title: string;
  content: string | null;
  slug: string;
  uri: string;
  featuredImage?: {
    node: WpImage;
  } | null;
};

export type WpComment = {
  id: string;
  databaseId: number;
  content: string;
  date: string;
  author: {
    node: {
      name: string;
      email: string;
    };
  };
};

export type WpPost = {
  id: string;
  databaseId?: number;
  title: string;
  content: string | null;
  slug: string;
  uri: string;
  date: string;
  featuredImage?: {
    node: WpImage;
  } | null;
  excerpt: string | null;
  author?: {
    node: {
      name: string;
    };
  } | null;
  categories?: {
    nodes: Array<{
      name: string;
      slug: string;
    }>;
  } | null;
  commentCount?: number | null;
  comments?: {
    nodes: WpComment[];
  } | null;
};

export type WpCategory = {
  name: string;
  slug: string;
};

export type WpPageInfo = {
  hasNextPage: boolean;
  endCursor: string | null;
};

export type WpCategoryArchive = {
  posts: {
    pageInfo: WpPageInfo;
    nodes: WpPost[];
  };
  category: WpCategory | null;
  totalCount?: number;
};

export type WpAuthor = {
  name: string;
  slug: string;
};

export type WpAuthorArchive = {
  posts: {
    pageInfo: WpPageInfo;
    nodes: WpPost[];
  };
  author: WpAuthor | null;
  totalCount?: number;
};

export type WpSiteLogo = {
  url: string;
  altText?: string;
  mediaDetails?: {
    width: number;
    height: number;
  };
};

export type WpSiteInfo = {
  title: string;
  tagline: string;
  url: string;
  logo: WpSiteLogo | null;
};

export type WpSocialLink = {
  id: string;
  iconId: string;
  iconUrl: string;
  isEnabled: boolean;
  platform: string;
  sortOrder: number;
  url: string;
  handle: string;
};

export type WpSliderImage = {
  imageUrl: string;
};

export type WpSliderImages = {
  images: WpSliderImage[];
};

export type WpCallToAction = {
  id: string;
  ctaButtonText: string;
  ctaButtonUrl: string;
  description: string;
  heading: string;
  linkText: string;
  linkUrl: string;
  phoneNumber: string;
  phoneNumberLink: string;
  isEnabled: boolean;
  ctaButtonPageId: number | null;
  linkPageId: number | null;
  sortOrder: number;
};

