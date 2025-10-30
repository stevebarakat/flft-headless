import { wpClient } from "./wp-client";
import {
  GET_MENU_BY_NAME,
  GET_PAGE_BY_URI,
  GET_POST_BY_URI,
  GET_ALL_PAGES,
  GET_ALL_POSTS,
  GET_MEDIA_BY_ID,
  GET_SITE_INFO,
} from "./graphql/queries";
import type { WpMenu, WpPage, WpPost, WpSiteLogo, WpSiteInfo } from "@/types/wp";

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

