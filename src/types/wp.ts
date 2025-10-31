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

export type WpPost = {
  id: string;
  title: string;
  content: string | null;
  slug: string;
  uri: string;
  date: string;
  featuredImage?: {
    node: WpImage;
  } | null;
  excerpt: string | null;
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

