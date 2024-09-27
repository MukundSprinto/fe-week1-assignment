'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useLazyQuery } from '@apollo/client'
import { GET_BOOKS, GET_BOOK_REVIEW, UPDATE_BOOK, GET_AUTHORS, DELETE_BOOK } from '../../graphql/queries'
import Link from 'next/link'
import Image from 'next/image'

export default function BookDetail({params}) {
    const {id} = params
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [editedBook, setEditedBook] = useState(null)
    const [isUpdating, setIsUpdating] = useState(false)
    const [authorMap, setAuthorMap] = useState({})
    const [coverImage, setCoverImage] = useState(null)
    const [deleteBook] = useMutation(DELETE_BOOK)

    const { data, loading, error } = useQuery(GET_BOOKS, {
        variables: {
            filter: {
                id: Number(id)
            },
            page: 1
        }
    })

    const [updateBook] = useMutation(UPDATE_BOOK)

    const { data: reviewData, loading: reviewLoading, error: reviewError } = useQuery(GET_BOOK_REVIEW, {
        variables: {
            bookId: Number(id)
        }
    })

    const [getAuthors, { data: authorsData, loading: authorsLoading, error: authorsError }] = useLazyQuery(GET_AUTHORS, {
        variables: {
            page: 1,
            pageSize: 100
        }
    })

    function getFormattedDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        return `${month}-${day}-${year}`;
    }

    async function handleDelete() {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await deleteBook({
                    variables: {
                        id: Number(id)
                    }
                })
                router.push('/books')
            } catch (error) {
                console.error('Error deleting book:', error)
            }
        }
    }

    useEffect(() => {
        if (isEditing) {
            getAuthors();
        }
    }, [isEditing, getAuthors]);

    useEffect(() => {
        if (authorsData && authorsData.authors) {
            const newAuthorMap = {};
            authorsData.authors.edges.forEach(author => {
                newAuthorMap[author.id] = author.name;
            });
            setAuthorMap(newAuthorMap);
        }
    }, [authorsData]);

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>
    if (error) return <div className="text-red-500">Error: {error.message}</div>

    if (data && data.books && Array.isArray(data.books.edges) && data.books.edges.length > 0) {
        const book = data.books.edges[0]
        
        const handleEdit = () => {
            setIsEditing(true)
            setEditedBook({
                title: book.title,
                publishedDate: book.published_date,
                coverImageUri: book.cover_image_uri,
                authorId: editedBook ? editedBook.authorId : book.author.id
            })
        }

        const handleUpdate = async () => {
            setIsUpdating(true)
            try {
                const formattedDate = getFormattedDate(new Date(Number(editedBook.publishedDate)))
                const res = await updateBook({
                    variables: {
                        ...editedBook,
                        id: Number(id),
                        publishedDate: formattedDate,
                        authorId: Number(editedBook.authorId),
                    }
                })
                if (res.data && res.data.updateBook) {
                    if (res.data.updateBook.author_id) {
                        res.data.updateBook.authorId = Number(res.data.updateBook.author_id)
                    }
                    setEditedBook(res.data.updateBook)
                }
                setIsEditing(false)
            } catch (error) {
                console.error('Error updating book:', error)
            } finally {
                setIsUpdating(false)
            }
        }

        const handleCancel = () => {
            setIsEditing(false)
            setEditedBook(null)
        }

        
        const handleInputChange = (e) => {
            let { name, value } = e.target;
            if (name === 'authorId') {  
                value = Number(value)
            }
            if (name === 'coverImageUri') {
                setCoverImage(value)
            }
            setEditedBook(prevBook => ({
                ...prevBook,
                [name]: name === 'publishedDate' ? new Date(value).getTime() : value,
            }));
        }


        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto bg-blue-200 dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                    <div className="md:flex p-8">
                        <div className="md:flex-shrink-0 mr-8">
                            {book.cover_image_uri && (
                                <Image
                                    src={coverImage ? coverImage : book.cover_image_uri}
                                    alt={`Cover of ${book.title}`}
                                    width={300}
                                    height={450}
                                    className="w-full h-auto object-cover md:w-64 lg:w-80"
                                    priority
                                />
                            )}
                        </div>
                        <div className="flex-grow">
                            {isEditing ? (
                                <div className="space-y-6 bg-blue-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                                    <div className="space-y-2">
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                                        <input
                                            id="title"
                                            type="text"
                                            name="title"
                                            value={editedBook.title}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 text-xl font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="coverImageUri" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cover Image URL</label>
                                        <input
                                            id="coverImageUri"
                                            type="text"
                                            name="coverImageUri"
                                            value={editedBook.coverImageUri}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="authorId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Author</label>
                                        <select
                                            id="authorId"
                                            name="authorId"
                                            value={editedBook.authorId}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        >
                                            {authorsLoading && <option>Loading authors...</option>}
                                            {authorsError && <option>Error loading authors</option>}
                                            {authorsData && authorsData.authors && authorsData.authors.edges.map(author => {
                                                authorMap[author.id] = author.name;
                                                return (
                                                    <option key={author.id} value={author.id}>
                                                        {author.name}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="publishedDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Published Date</label>
                                        <input
                                            id="publishedDate"
                                            type="date"
                                            name="publishedDate"
                                            value={new Date(Number(editedBook.publishedDate)).toLocaleDateString('en-CA')}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        />
                                    </div>
                                    <div className="flex space-x-4">
                                        {isUpdating ? (
                                            <button
                                                disabled
                                                className="w-full px-6 py-3 text-white bg-gray-400 rounded-lg cursor-not-allowed"
                                            >
                                                Updating...
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={handleUpdate}
                                                    className="flex-1 px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
                                                >
                                                    Update Book
                                                </button>
                                                <button
                                                    onClick={handleCancel}
                                                    className="flex-1 px-6 py-3 text-blue-500 bg-white border border-blue-500 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6 bg-blue-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                                        <p className="w-full px-4 py-2 text-xl font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                                            {book.title}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Author</label>
                                        <p className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                                            {editedBook ? authorMap[editedBook.author_id] : book.author.name}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Published Date</label>
                                        <p className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                                            {new Date(Number(book.published_date)).toLocaleDateString('en-GB')}
                                        </p>
                                    </div>
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={handleEdit}
                                            className="w-full px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="flex-1 px-6 py-3 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 p-8">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Reviews</h2>
                        {reviewLoading && <p className="text-gray-600 dark:text-gray-400 italic">Loading reviews...</p>}
                        {reviewError && <p className="text-red-500 font-semibold">Error loading reviews: {reviewError.message}</p>}
                        {reviewData && reviewData.bookReviews && reviewData.bookReviews.length > 0 ? (
                            <div className="space-y-6">
                                {reviewData.bookReviews.map((review, index) => (
                                    <div key={index} className="bg-blue-100 dark:bg-gray-800 rounded-lg shadow-md p-6 transition duration-300 ease-in-out hover:shadow-lg">
                                        <div className="flex items-center mb-4">
                                            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                {review.user_name ? review.user_name[0].toUpperCase() : 'A'}
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{review.user_name || 'Anonymous'}</h3>
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{review.rating}/5</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 italic">&ldquo;{review.review}&rdquo;</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-700 dark:text-gray-300 italic text-center py-8">No reviews available for this book yet. Be the first to share your thoughts!</p>
                        )}
                    </div>
                    
                    <div className="bg-blue-300 dark:bg-gray-700 px-6 py-4">
                        <Link href="/books" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition duration-150 ease-in-out">
                            ← Back to all books
                        </Link>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center items-center">
                <div className="bg-blue-300 dark:bg-blue-100 shadow-lg rounded-lg p-12 w-3/4 max-w-2xl">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Book Not Found</h2><Link href="/books" className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition duration-150 ease-in-out text-lg">
                        ← Back to all books
                    </Link>
                </div>
            </div>
        )
    }
}
