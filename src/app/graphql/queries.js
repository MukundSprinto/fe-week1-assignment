import { gql } from '@apollo/client'

export const GET_AUTHORS = gql`
    query GetAuthors($filter: AuthorFilter, $page: Int! = 1, $pageSize: Int! = 5) {
        authors(filter: $filter, page: $page, pageSize: $pageSize) {
         edges {
                id
                name
                biography
                born_date
                profile_image_uri
                books {
                    title
                }
                created_at
                updated_at
            }
            pageInfo {
                hasNextPage
                totalCount
            }
        }
    }
`;

export const GET_BOOKS = gql`
    query GetBooks($filter: BookFilter, $page: Int! = 1, $pageSize: Int! = 5) {
        books(filter: $filter, page: $page, pageSize: $pageSize) {
            edges {
                id
                title
                published_date
                author_id
                author {
                    name
                }
                cover_image_uri
                created_at
                updated_at
            }
            pageInfo {
                hasNextPage
                totalCount
            }
        }
    }
`;

export const CREATE_BOOK = gql`
    mutation CreateBook($title: String!, $publishedDate: String!, $authorId: Int!, $coverImageUri: String!) {
        createBook (
            title: $title
            published_date: $publishedDate
            author_id: $authorId
            cover_image_uri: $coverImageUri
        ) {
            id
            title
            published_date
            author_id
            cover_image_uri
            created_at
            updated_at
        }
    }
`;

export const CREATE_AUTHOR = gql`
    mutation CreateAuthor($name: String!, $biography: String!, $bornDate: String!, $profileImageUri: String!) {
        createAuthor (
            name: $name
            biography: $biography
            born_date: $bornDate
            profile_image_uri: $profileImageUri
        ) {
            id
            name
            biography
            born_date 
            profile_image_uri
            created_at
            updated_at
        }
    }
`;
