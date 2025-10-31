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

