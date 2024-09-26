'use client'

import React, { useState } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { GET_BOOKS, GET_AUTHORS } from '../graphql/queries'
import BookCard from '../../components/BookCard'
import Loader from '../../components/Loader'
import Link from 'next/link'

export default function Books() {
    const [title, setTitle] = useState('')
    const [author_id, setAuthorId] = useState(null)
    const [published_date_range, setPublishedDateRange] = useState([null, null])
    const [authorsLoaded, setAuthorsLoaded] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)

    const [getAuthors, { data: authorsData, loading: authorsLoading, error: authorsError }] = useLazyQuery(GET_AUTHORS)

    const { data, loading, error } = useQuery(GET_BOOKS, {
        variables: {
            filter: {
                title,
                author_id,
                published_date_range: published_date_range[0] && published_date_range[1] ? {start: published_date_range[0], end: published_date_range[1]} : null
            },
            page: currentPage
        }
    })

    const handleAuthorDropdownOpen = () => {
        if (!authorsLoaded) {
          getAuthors()
          setAuthorsLoaded(true)
        }
    }

    const handleNextPage = () => {
        if (data.books.pageInfo.hasNextPage) {
            setCurrentPage(currentPage + 1)
        }
    }

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    return (
        <div className="container mx-auto mt-8 px-4">
            <div className="mb-8 bg-blue-300 dark:bg-gray-800 shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Filter Books</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                        <input
                            id="title"
                            type="text"
                            placeholder="Search by title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>
                    <div>
                        <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Author</label>
                        <select
                            id="author"
                            value={author_id}
                            onChange={(e) => setAuthorId(parseInt(e.target.value))}
                            onClick={handleAuthorDropdownOpen}
                            className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="">Select an author</option>
                            {authorsLoading && (
                                <option disabled>Loading authors...</option>
                            )}
                            {authorsError && (
                                <option disabled>Error loading authors: {authorsError.message}</option>
                            )}
                            {authorsData && authorsData.authors.edges.map((author) => (
                                <option key={author.id} value={author.id}>{author.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                        <input
                            id="startDate"
                            type="date"
                            value={published_date_range[0] || ''}
                            onChange={(e) => setPublishedDateRange([e.target.value, published_date_range[1]])}
                            className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                        <input
                            id="endDate"
                            type="date"
                            value={published_date_range[1] || ''}
                            onChange={(e) => setPublishedDateRange([published_date_range[0], e.target.value])}
                            className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10">
                {loading ? (
                    <div className="col-span-full">
                        <Loader />
                    </div>
                ) : error ? (
                    <div className="col-span-full">
                        <p>Error: {error.message}</p>
                    </div>
                ) : (
                    <>
                        {data.books.edges.map((book) => (
                            <BookCard key={book.id} book={book} isPortrait={true} />
                        ))}
                        <Link href="/admin/add-book">
                            <div className="bg-blue-100 dark:bg-gray-800 shadow-md rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center h-full">
                                <div className="text-6xl text-gray-400 hover:text-indigo-600 transition-colors duration-300">
                                    +
                                </div>
                            </div>
                        </Link>
                    </>
                )}
            </div>
            {/* Pagination controls */}
            {data && data.books.pageInfo && (
                <div className="mt-8 flex justify-center items-center space-x-4">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-blue-500 dark:bg-blue-700 text-white rounded-md disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:text-gray-500 dark:disabled:text-gray-400"
                    >
                        Previous
                    </button>
                    <span className="text-gray-800 dark:text-gray-200">Page {currentPage}</span>
                    <button
                        onClick={handleNextPage}
                        disabled={!data.books.pageInfo.hasNextPage}
                        className="px-4 py-2 bg-blue-500 dark:bg-blue-700 text-white rounded-md disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:text-gray-500 dark:disabled:text-gray-400"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}
