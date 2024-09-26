'use client'

import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_AUTHOR } from '../../graphql/queries'

export default function AddAuthor() {
  const [name, setName] = useState('')
  const [biography, setBiography] = useState('')
  const [bornDate, setBornDate] = useState('')
  const [profileImageUri, setProfileImageUri] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [createAuthor, { loading: createAuthorLoading }] = useMutation(CREATE_AUTHOR)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    try {
      await createAuthor({
        variables: { name, biography, bornDate, profileImageUri }
      })

      // Clear input fields on successful response
      setName('')
      setBiography('')
      setBornDate('')
      setProfileImageUri('')

      alert('Author added successfully!')
    } catch (error) {
      console.error('Error adding author:', error)
      setErrorMessage('Failed to add author. Please try again.')
    }
  }

  return (
    <div className="container mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Add a New Author</h1>
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="biography" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Biography</label>
          <textarea
            id="biography"
            value={biography}
            onChange={(e) => setBiography(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="4"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="bornDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Born Date</label>
          <input
            type="date"
            id="bornDate"
            value={bornDate}
            onChange={(e) => setBornDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="profileImageUri" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Image URL</label>
          <input
            type="url"
            id="profileImageUri"
            value={profileImageUri}
            onChange={(e) => setProfileImageUri(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={createAuthorLoading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-300"
        >
          {createAuthorLoading ? 'Adding Author...' : 'Add Author'}
        </button>
      </form>
    </div>
  )
}
