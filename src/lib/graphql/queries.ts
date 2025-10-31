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
        databaseId
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
        commentCount
        comments(first: 100) {
          nodes {
            id
            databaseId
            content
            date
            author {
              node {
                name
                email
              }
            }
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
      databaseId
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
      commentCount
      comments(first: 100) {
        nodes {
          id
          databaseId
          content
          date
          author {
            node {
              name
              email
            }
          }
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
      databaseId
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
      commentCount
      comments(first: 100) {
        nodes {
          id
          databaseId
          content
          date
          author {
            node {
              name
              email
            }
          }
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
  query GetAllPages($first: Int!, $after: String) {
    pages(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
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
  query GetAllPosts($first: Int!, $after: String) {
    posts(first: $first, after: $after) {
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

export const GET_CATEGORY_POSTS_FOR_RSS = `
  query GetCategoryPostsForRSS($categorySlug: String!, $first: Int!) {
    posts(first: $first, where: {categoryName: $categorySlug}) {
      nodes {
        id
        title
        slug
        uri
        date
        content
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
          }
        }
      }
    }
  }
`;

export const SUBMIT_CONTACT_FORM = `
  mutation SubmitContactForm($name: String!, $email: String!, $subject: String!, $message: String!) {
    submitContactForm(input: {
      name: $name
      email: $email
      subject: $subject
      message: $message
    }) {
      success
      submissionId
      message
    }
  }
`;

export const CREATE_COMMENT = `
  mutation CreateComment($postId: Int!, $author: String!, $authorEmail: String!, $content: String!) {
    createComment(input: {
      commentOn: $postId
      author: $author
      authorEmail: $authorEmail
      content: $content
    }) {
      success
      comment {
        id
        databaseId
        content
        date
        author {
          node {
            name
            email
          }
        }
      }
    }
  }
`;

