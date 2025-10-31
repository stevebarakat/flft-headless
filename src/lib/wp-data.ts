import { wpClient } from "./wp-client";
import {
  GET_MENU_BY_NAME,
  GET_ALL_MENUS,
  GET_PAGE_BY_URI,
  GET_POST_BY_URI,
  GET_POST_BY_SLUG,
  GET_POST_BY_SLUG_ID,
  GET_ALL_PAGES,
  GET_ALL_POSTS,
  GET_MEDIA_BY_ID,
  GET_SITE_INFO,
  GET_SOCIAL_LINKS,
  GET_SLIDER_IMAGES,
  GET_CALL_TO_ACTION,
  GET_LATEST_TIPS_AND_TRICKS,
  GET_POSTS_BY_CATEGORY,
  GET_CATEGORY_POSTS_FOR_RSS,
  GET_POSTS_BY_AUTHOR,
  SUBMIT_CONTACT_FORM,
  CREATE_COMMENT,
} from "./graphql/queries";
import type { WpMenu, WpPage, WpPost, WpSiteLogo, WpSiteInfo, WpSocialLink, WpSliderImage, WpCallToAction, WpCategoryArchive, WpAuthorArchive } from "@/types/wp";

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
  const variations = new Set<string>();

  variations.add(uri);
  variations.add(uri.endsWith("/") ? uri.slice(0, -1) : `${uri}/`);
  if (uri.startsWith("/")) {
    variations.add(uri.slice(1));
    variations.add(uri.endsWith("/") ? uri.slice(1, -1) : `${uri.slice(1)}/`);
  } else {
    variations.add(`/${uri}`);
    variations.add(`/${uri}/`);
  }

  for (const uriVariation of variations) {
    try {
      const data = await wpClient.request<{
        nodeByUri: WpPost | null;
      }>(GET_POST_BY_URI, { uri: uriVariation });

      if (data.nodeByUri) {
        return data.nodeByUri;
      }
    } catch (error) {
      continue;
    }
  }

  return null;
}

export async function getPostBySlug(slug: string): Promise<WpPost | null> {
  try {
    let data = await wpClient.request<{
      postBy: WpPost | null;
    }>(GET_POST_BY_SLUG, { slug });

    if (!data.postBy) {
      data = await wpClient.request<{
        postBy: WpPost | null;
      }>(GET_POST_BY_SLUG, { slug: decodeURIComponent(slug) });
    }

    if (!data.postBy) {
      const dataById = await wpClient.request<{
        post: WpPost | null;
      }>(GET_POST_BY_SLUG_ID, { slug });

      if (dataById.post) {
        return dataById.post;
      }
    }

    return data.postBy;
  } catch (error) {
    console.error("Error fetching post by slug:", error);
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

async function countCategoryPosts(categorySlug: string, first: number = 100): Promise<number> {
  let totalCount = 0;
  let cursor: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const pageData = await wpClient.request<{
      posts: {
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
        nodes: WpPost[];
      };
    }>(GET_POSTS_BY_CATEGORY, {
      categorySlug,
      first,
      after: cursor,
    });

    totalCount += pageData.posts.nodes.length;
    hasNextPage = pageData.posts.pageInfo.hasNextPage;
    cursor = pageData.posts.pageInfo.endCursor || null;
  }

  return totalCount;
}

export async function getCategoryPosts(
  categorySlug: string,
  first: number = 10,
  after?: string | null,
  page?: number
): Promise<WpCategoryArchive | null> {
  try {
    let cursor: string | null = after || null;
    let lastPageData: {
      posts: {
        pageInfo: WpCategoryArchive["posts"]["pageInfo"];
        nodes: WpCategoryArchive["posts"]["nodes"];
      };
    } | null = null;

    if (page && page > 1) {
      for (let i = 1; i < page; i++) {
        const pageData = await wpClient.request<{
          posts: {
            pageInfo: WpCategoryArchive["posts"]["pageInfo"];
            nodes: WpCategoryArchive["posts"]["nodes"];
          };
        }>(GET_POSTS_BY_CATEGORY, {
          categorySlug,
          first,
          after: cursor,
        });

        lastPageData = pageData;

        if (!pageData.posts.pageInfo.hasNextPage) {
          break;
        }

        cursor = pageData.posts.pageInfo.endCursor || null;
      }
    }

    const data = await wpClient.request<{
      posts: {
        pageInfo: WpCategoryArchive["posts"]["pageInfo"];
        nodes: WpCategoryArchive["posts"]["nodes"];
      };
    }>(GET_POSTS_BY_CATEGORY, {
      categorySlug,
      first,
      after: cursor,
    });

    const resultData = data.posts.nodes.length > 0 ? data : lastPageData || data;

    const firstPost = resultData.posts.nodes[0];
    const categoryNode = firstPost?.categories?.nodes.find(
      (cat) => cat.slug === categorySlug
    );

    return {
      posts: resultData.posts,
      category: categoryNode
        ? { name: categoryNode.name, slug: categoryNode.slug }
        : { name: categorySlug, slug: categorySlug },
      totalCount: await countCategoryPosts(categorySlug, first),
    };
  } catch (error) {
    console.error("Error fetching category posts:", error);
    return null;
  }
}

export async function getCategoryPostsForRSS(categorySlug: string) {
  try {
    const data = await wpClient.request<{
      posts: { nodes: WpPost[] };
    }>(GET_CATEGORY_POSTS_FOR_RSS, {
      categorySlug,
      first: 50,
    });

    const firstPost = data.posts.nodes[0];
    const categoryNode = firstPost?.categories?.nodes.find(
      (cat) => cat.slug === categorySlug
    );

    return {
      posts: data.posts.nodes,
      category: categoryNode
        ? { name: categoryNode.name, slug: categoryNode.slug }
        : { name: categorySlug, slug: categorySlug },
    };
  } catch (error) {
    console.error("Error fetching category posts for RSS:", error);
    return null;
  }
}

async function countAuthorPosts(authorName: string, first: number = 100): Promise<number> {
  let totalCount = 0;
  let cursor: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const pageData = await wpClient.request<{
      posts: {
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
        nodes: WpPost[];
      };
    }>(GET_POSTS_BY_AUTHOR, {
      authorName,
      first,
      after: cursor,
    });

    totalCount += pageData.posts.nodes.length;
    hasNextPage = pageData.posts.pageInfo.hasNextPage;
    cursor = pageData.posts.pageInfo.endCursor || null;
  }

  return totalCount;
}

export async function getAuthorPosts(
  authorName: string,
  first: number = 10,
  after?: string | null,
  page?: number
): Promise<WpAuthorArchive | null> {
  try {
    let cursor: string | null = after || null;
    let lastPageData: {
      posts: {
        pageInfo: WpAuthorArchive["posts"]["pageInfo"];
        nodes: WpAuthorArchive["posts"]["nodes"];
      };
    } | null = null;

    if (page && page > 1) {
      for (let i = 1; i < page; i++) {
        const pageData = await wpClient.request<{
          posts: {
            pageInfo: WpAuthorArchive["posts"]["pageInfo"];
            nodes: WpAuthorArchive["posts"]["nodes"];
          };
        }>(GET_POSTS_BY_AUTHOR, {
          authorName,
          first,
          after: cursor,
        });

        lastPageData = pageData;

        if (!pageData.posts.pageInfo.hasNextPage) {
          break;
        }

        cursor = pageData.posts.pageInfo.endCursor || null;
      }
    }

    const data = await wpClient.request<{
      posts: {
        pageInfo: WpAuthorArchive["posts"]["pageInfo"];
        nodes: WpAuthorArchive["posts"]["nodes"];
      };
    }>(GET_POSTS_BY_AUTHOR, {
      authorName,
      first,
      after: cursor,
    });

    const resultData = data.posts.nodes.length > 0 ? data : lastPageData || data;

    const firstPost = resultData.posts.nodes[0];
    const authorNameFromPost = firstPost?.author?.node?.name;

    const authorSlug = authorName.toLowerCase().replace(/\s+/g, "-");

    return {
      posts: resultData.posts,
      author: authorNameFromPost
        ? { name: authorNameFromPost, slug: authorSlug }
        : { name: authorName, slug: authorSlug },
      totalCount: await countAuthorPosts(authorName, first),
    };
  } catch (error) {
    console.error("Error fetching author posts:", error);
    return null;
  }
}

export async function submitContactForm(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; submissionId?: string; message?: string }> {
  try {
    const result = await wpClient.request<{
      submitContactForm: {
        success: boolean;
        submissionId?: string;
        message?: string;
      };
    }>(SUBMIT_CONTACT_FORM, {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    });

    return result.submitContactForm;
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to submit contact form",
    };
  }
}

export async function createComment(data: {
  postId: number;
  author: string;
  authorEmail: string;
  content: string;
}): Promise<{
  success: boolean;
  comment?: {
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
  message?: string;
}> {
  try {
    const result = await wpClient.request<{
      createComment: {
        success: boolean;
        comment?: {
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
      };
    }>(CREATE_COMMENT, {
      postId: data.postId,
      author: data.author,
      authorEmail: data.authorEmail,
      content: data.content,
    });

    return result.createComment;
  } catch (error) {
    console.error("Error creating comment:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to submit comment",
    };
  }
}

