'use client'

import React, { useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { GET_AUTHORS, CREATE_BOOK } from '../../graphql/queries'
import Loader from '../../../components/Loader'

export default function AddBook() {
  const [title, setTitle] = useState('')
  const [publishedDate, setPublishedDate] = useState('')
  const [authorId, setAuthorId] = useState('')
  const [coverImageUri, setCoverImageUri] = useState('')
  const [authorsLoaded, setAuthorsLoaded] = useState(false)

  const [getAuthors, { data: authorsData, loading: authorsLoading, error: authorsError }] = useLazyQuery(GET_AUTHORS)
  const [createBook, { loading: createBookLoading }] = useMutation(CREATE_BOOK)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createBook({
        variables: { title, publishedDate, authorId: Number(authorId), coverImageUri }
      })

      alert('Book added successfully!')

      // Clear the input fields
      setTitle('')
      setPublishedDate('')
      setAuthorId('')
      setCoverImageUri('')
    } catch (error) {
      console.error('Error adding book:', error)
    }
  }

  const handleAuthorDropdownOpen = () => {
    if (!authorsLoaded) {
      getAuthors()
      setAuthorsLoaded(true)
    }
  }

  return (
    <div className="container mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Add a New Book</h1>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="publishedDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Published Date</label>
          <input
            type="date"
            id="publishedDate"
            value={publishedDate}
            onChange={(e) => setPublishedDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Author</label>
          <select
            id="author"
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            onClick={handleAuthorDropdownOpen}
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
        <div className="mb-4">
          <label htmlFor="coverImageUri" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cover Image URL</label>
          <input
            type="url"
            id="coverImageUri"
            value={coverImageUri}
            onChange={(e) => setCoverImageUri(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={createBookLoading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-300"
        >
          {createBookLoading ? 'Adding Book...' : 'Add Book'}
        </button>
      </form>
    </div>
  )
}
