'use client'

import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_AUTHORS } from '../graphql/queries'
import AuthorCard from '../../components/AuthorCard'
import Loader from '../../components/Loader'
import Link from 'next/link'

export default function Authors() {
    const [name, setName] = useState('')
    const [born_date_range, setBornDateRange] = useState([null, null])
    const [currentPage, setCurrentPage] = useState(1)

    const { data, loading, error } = useQuery(GET_AUTHORS, {
        variables: {
            filter: {
                name,
                born_date_range: born_date_range[0] && born_date_range[1] ? {start: born_date_range[0], end: born_date_range[1]} : null
            },
            page: currentPage
        },
        fetchPolicy: 'network-only',
        nextFetchPolicy: 'cache-first'
    })

    const handleNextPage = () => {
        if (data.authors.pageInfo.hasNextPage) {
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
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Filter Authors</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Search by name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Born After</label>
                        <input
                            id="startDate"
                            type="date"
                            value={born_date_range[0] || ''}
                            onChange={(e) => setBornDateRange([e.target.value, born_date_range[1]])}
                            className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Born Before</label>
                        <input
                            id="endDate"
                            type="date"
                            value={born_date_range[1] || ''}
                            onChange={(e) => setBornDateRange([born_date_range[0], e.target.value])}
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
                        {data.authors.edges.map((author) => (
                            <AuthorCard key={author.id} author={author} />
                        ))}
                        <Link href="/admin/add-author">
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
            {data && data.authors.pageInfo && (
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
                        disabled={!data.authors.pageInfo.hasNextPage}
                        className="px-4 py-2 bg-blue-500 dark:bg-blue-700 text-white rounded-md disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:text-gray-500 dark:disabled:text-gray-400"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}
