import { gql } from '@apollo/client'

export const GET_BOOKS = gql`
    query GetBooks($filter: BookFilter, $page: Int! = 1, $pageSize: Int! = 5) {
        books(filter: $filter, page: $page, pageSize: $pageSize) {
            edges {
                id
                title
                description
                published_date
                author_id
                author {
                    id
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
    mutation CreateBook($title: String!, $description: String!, $publishedDate: String!, $authorId: Int!, $coverImageUri: String!) {
        createBook (
            title: $title
            description: $description
            published_date: $publishedDate
            author_id: $authorId
            cover_image_uri: $coverImageUri
        ) {
            id
            title
            description
            published_date
            author_id
            cover_image_uri
            created_at
            updated_at
        }
    }
`;

export const UPDATE_BOOK = gql`
    mutation UpdateBook($id: Int!, $title: String, $description: String, $publishedDate: String, $authorId: Int, $coverImageUri: String) {
        updateBook(
            id: $id,
            title: $title,
            description: $description,
            published_date: $publishedDate,
            author_id: $authorId,
            cover_image_uri: $coverImageUri
        ) {
            id
            title
            description
            published_date
            author_id
            cover_image_uri
        }
    }
`;

export const DELETE_BOOK = gql`
    mutation DeleteBook($id: Int!) {
        deleteBook(
            id: $id,
        ) {
            id
        }
    }
`;

export const GET_BOOK_REVIEW = gql`
    query GetBooks($bookId: Int!) {
        bookReviews(book_id: $bookId) {
            id
            book_id
            user_name
            review
            rating
        }
    }
`;

export const CREATE_BOOK_REVIEW = gql`
    mutation CreateBookReview($bookId: Int!, $userName: String!, $review: String!, $rating: Int!) {
        createBookReview(
            book_id: $bookId
            user_name: $userName
            review: $review
            rating: $rating
        ) {
            id
            book_id
            user_name
            review
            rating
        }
    }
`;

export const DELETE_BOOK_REVIEW = gql`
    mutation DeleteBookReview($id: ID!) {
        deleteBookReview(
            id: $id
        ) {
            id
            book_id
            user_name
            review
            rating
        }
    }
`;

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

export const UPDATE_AUTHOR = gql`
    mutation UpdateAuthor($id: Int!, $name: String, $biography: String, $bornDate: String, $profileImageUri: String) {
        updateAuthor (
            id: $id
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

export const DELETE_AUTHOR = gql`
    mutation DeleteAuthor($id: Int!) {
        deleteAuthor(
            id: $id
        ) {
            id
        }
    }
`;

export const GET_AUTHOR_DETAILS = gql`
    query GetAuthorDetails($authorId: Int!) {
        authorDetails(author_id: $authorId) {
            author_id
            phone
            address
            email
            website
        }
    }
`;

export const ADD_AUTHOR_DETAILS = gql`
    mutation AddAuthorDetails($authorId: Int!, $phone: Float!, $address: String!, $email: String!, $website: String!) {
        createAuthorDetail(
            author_id: $authorId
            phone: $phone
            address: $address
            email: $email
            website: $website
        ) {
            author_id
            phone
            address
            email
            website
        }
    }
`;

export const UPDATE_AUTHOR_DETAILS = gql`
    mutation UpdateAuthorDetails($authorId: Int!, $phone: Float, $address: String, $email: String, $website: String) {
        updateAuthorDetail(
            author_id: $authorId
            phone: $phone
            address: $address
            email: $email
            website: $website
        ) {
            author_id
            phone
            address
            email
            website
        }
    }
`;
