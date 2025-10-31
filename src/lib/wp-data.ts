import { wpClient } from "./wp-client";
import {
  GET_MENU_BY_NAME,
  GET_PAGE_BY_URI,
  GET_POST_BY_URI,
  GET_ALL_PAGES,
  GET_ALL_POSTS,
  GET_MEDIA_BY_ID,
  GET_SITE_INFO,
  GET_SOCIAL_LINKS,
  GET_SLIDER_IMAGES,
  GET_CALL_TO_ACTION,
  GET_LATEST_TIPS_AND_TRICKS,
} from "./graphql/queries";
import type { WpMenu, WpPage, WpPost, WpSiteLogo, WpSiteInfo, WpSocialLink, WpSliderImage, WpCallToAction } from "@/types/wp";

export async function getMenu(name: string = "Main"): Promise<WpMenu | null> {
  try {
    const data = await wpClient.request<{
      menu: {
        menuItems: { nodes: WpMenu["menuItems"]["nodes"] };
      } | null;
    }>(GET_MENU_BY_NAME, { name });

    if (!data.menu) {
      return null;
    }

    return {
      name,
      menuItems: data.menu.menuItems,
    };
  } catch (error) {
    console.error("Error fetching menu:", error);
    return null;
  }
}

export async function getPageByUri(uri: string): Promise<WpPage | null> {
  try {
    const data = await wpClient.request<{
      nodeByUri: WpPage | null;
    }>(GET_PAGE_BY_URI, { uri });

    return data.nodeByUri;
  } catch (error) {
    console.error("Error fetching page:", error);
    return null;
  }
}

export async function getPostByUri(uri: string): Promise<WpPost | null> {
  try {
    const data = await wpClient.request<{
      nodeByUri: WpPost | null;
    }>(GET_POST_BY_URI, { uri });

    return data.nodeByUri;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export async function getAllPages(): Promise<WpPage[]> {
  try {
    const data = await wpClient.request<{
      pages: { nodes: WpPage[] };
    }>(GET_ALL_PAGES);

    return data.pages.nodes;
  } catch (error) {
    console.error("Error fetching pages:", error);
    return [];
  }
}

export async function getAllPosts(): Promise<WpPost[]> {
  try {
    const data = await wpClient.request<{
      posts: { nodes: WpPost[] };
    }>(GET_ALL_POSTS);

    return data.posts.nodes;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export async function getSiteLogo(logoId: string): Promise<WpSiteLogo | null> {
  if (!logoId) {
    return null;
  }

  try {
    const mediaData = await wpClient.request<{
      mediaItem: {
        sourceUrl: string;
        altText: string;
        mediaDetails?: {
          width: number;
          height: number;
        };
      } | null;
    }>(GET_MEDIA_BY_ID, { id: logoId });

    if (mediaData.mediaItem) {
      return {
        url: mediaData.mediaItem.sourceUrl,
        altText: mediaData.mediaItem.altText,
        mediaDetails: mediaData.mediaItem.mediaDetails,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching site logo:", error);
    return null;
  }
}

export async function getSiteInfo(logoId?: string): Promise<WpSiteInfo> {
  try {
    const data = await wpClient.request<{
      generalSettings: {
        url: string;
        title: string;
        description: string;
      };
    }>(GET_SITE_INFO);

    let logo: WpSiteLogo | null = null;
    if (logoId) {
      logo = await getSiteLogo(logoId);
    }

    return {
      title: data.generalSettings.title,
      tagline: data.generalSettings.description,
      url: data.generalSettings.url,
      logo,
    };
  } catch (error) {
    console.error("Error fetching site info:", error);
    return {
      title: "",
      tagline: "",
      url: "",
      logo: null,
    };
  }
}

export async function getSocialLinks(): Promise<WpSocialLink[]> {
  try {
    const data = await wpClient.request<{
      socialLinks: WpSocialLink[];
    }>(GET_SOCIAL_LINKS);

    return data.socialLinks
      .filter((link) => link.isEnabled)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  } catch (error) {
    console.error("Error fetching social links:", error);
    return [];
  }
}

export async function getSliderImages(): Promise<WpSliderImage[]> {
  try {
    const data = await wpClient.request<{
      imageSlider: {
        images: WpSliderImage[];
      } | null;
    }>(GET_SLIDER_IMAGES);

    return data.imageSlider?.images || [];
  } catch (error) {
    console.error("Error fetching slider images:", error);
    return [];
  }
}

export async function getCallToAction(): Promise<WpCallToAction | null> {
  try {
    const data = await wpClient.request<{
      callToAction: WpCallToAction | null;
    }>(GET_CALL_TO_ACTION);

    if (!data.callToAction || !data.callToAction.isEnabled) {
      return null;
    }

    return data.callToAction;
  } catch (error) {
    console.error("Error fetching call to action:", error);
    return null;
  }
}

export async function getLatestTipsAndTricks(): Promise<WpPost[]> {
  try {
    const data = await wpClient.request<{
      posts: { nodes: WpPost[] };
    }>(GET_LATEST_TIPS_AND_TRICKS);

    return data.posts.nodes;
  } catch (error) {
    console.error("Error fetching latest tips and tricks:", error);
    return [];
  }
}

