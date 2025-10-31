export const GET_MENU_BY_NAME = `
  query GetMenuByName($name: ID!) {
    menu(id: $name, idType: NAME) {
      menuItems(first: 100, where: {parentDatabaseId: 0}) {
        nodes {
          id
          label
          url
          path
          childItems(first: 100) {
            nodes {
              id
              label
              url
              path
            }
          }
        }
      }
    }
  }
`;

export const GET_PAGE_BY_URI = `
  query GetPageByUri($uri: String!) {
    nodeByUri(uri: $uri) {
      ... on Page {
        id
        title
        content
        slug
        uri
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
      }
    }
  }
`;

export const GET_POST_BY_URI = `
  query GetPostByUri($uri: String!) {
    nodeByUri(uri: $uri) {
      ... on Post {
        id
        title
        content
        slug
        uri
        date
        excerpt
        author {
          node {
            name
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
      }
    }
  }
`;

export const GET_POST_BY_SLUG = `
  query GetPostBySlug($slug: String!) {
    postBy(slug: $slug) {
      id
      title
      content
      slug
      uri
      date
      excerpt
      author {
        node {
          name
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
      featuredImage {
        node {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
    }
  }
`;

export const GET_POST_BY_SLUG_ID = `
  query GetPostBySlugId($slug: String!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      content
      slug
      uri
      date
      excerpt
      author {
        node {
          name
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
      featuredImage {
        node {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
    }
  }
`;

export const GET_ALL_PAGES = `
  query GetAllPages {
    pages {
      nodes {
        id
        title
        slug
        uri
      }
    }
  }
`;

export const GET_ALL_POSTS = `
  query GetAllPosts {
    posts {
      nodes {
        id
        title
        slug
        uri
        date
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
      }
    }
  }
`;

export const GET_SITE_INFO = `
  query GetSiteInfo {
    generalSettings {
      url
      title
      description
    }
  }
`;

export const GET_MEDIA_BY_ID = `
  query GetMediaById($id: ID!) {
    mediaItem(id: $id, idType: DATABASE_ID) {
      sourceUrl
      altText
      mediaDetails {
        width
        height
      }
    }
  }
`;

export const GET_SOCIAL_LINKS = `
  query GetSocialLinks {
    socialLinks {
      iconId
      iconUrl
      isEnabled
      platform
      sortOrder
      url
      handle
      id
    }
  }
`;

export const GET_SLIDER_IMAGES = `
  query GetSliderImages {
    imageSlider(id: 1) {
      images {
        imageUrl
      }
    }
  }
`;

export const GET_CALL_TO_ACTION = `
  query GetCallToAction {
    callToAction(id: 1) {
      id
      ctaButtonText
      ctaButtonUrl
      description
      heading
      linkText
      linkUrl
      phoneNumber
      phoneNumberLink
      isEnabled
      ctaButtonPageId
      linkPageId
      sortOrder
    }
  }
`;

export const GET_LATEST_TIPS_AND_TRICKS = `
  query GetLatestTipsAndTricks {
    posts(first: 4, where: {categoryName: "tips-tricks"}) {
      nodes {
        id
        title
        slug
        uri
        date
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
      }
    }
  }
`;

export const GET_POSTS_BY_CATEGORY = `
  query GetPostsByCategory($categorySlug: String!, $first: Int!, $after: String) {
    posts(first: $first, after: $after, where: {categoryName: $categorySlug}) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        title
        slug
        uri
        date
        excerpt
        author {
          node {
            name
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        commentCount
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
      }
    }
  }
`;

