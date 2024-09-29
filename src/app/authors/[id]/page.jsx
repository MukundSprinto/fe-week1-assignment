'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation } from '@apollo/client'
import { GET_AUTHORS, GET_AUTHOR_DETAILS, UPDATE_AUTHOR, UPDATE_AUTHOR_DETAILS, DELETE_AUTHOR } from '../../graphql/queries'
import Link from 'next/link'
import Image from 'next/image'

export default function AuthorDetail({params}) {
    const {id} = params
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [editedAuthor, setEditedAuthor] = useState(null)
    const [isUpdating, setIsUpdating] = useState(false)
    const [profileImage, setProfileImage] = useState(null)

    const [deleteAuthor] = useMutation(DELETE_AUTHOR)

    const { data, loading, error } = useQuery(GET_AUTHORS, {
        variables: {
            filter: {
                id: Number(id)
            },
            page: 1
        }
    })

    const { data: authorDetailsData, loading: authorDetailsLoading, error: authorDetailsError } = useQuery(GET_AUTHOR_DETAILS, {
        variables: {
            authorId: Number(id)
        }
    })

    const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
        refetchQueries: [
            { query: GET_AUTHORS, variables: { filter: { id: Number(id) }, page: 1 } },
        ]
    })

    const [updateAuthorDetails] = useMutation(UPDATE_AUTHOR_DETAILS, {
        refetchQueries: [
            { query: GET_AUTHOR_DETAILS, variables: { authorId: Number(id) } }
        ]
    })

    function getFormattedDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        return `${month}-${day}-${year}`;
    }

    async function handleDelete() {
        if (window.confirm('Are you sure you want to delete this author?')) {
            try {
                await deleteAuthor({
                    variables: {
                        id: Number(id)
                    }
                })
                router.push('/authors')
            } catch (error) {
                console.error('Error deleting author:', error)
            }
        }
    }

    if (loading || authorDetailsLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>
    if (error || authorDetailsError) return <div className="text-red-500">Error: {error?.message || authorDetailsError?.message}</div>

    if (data && data.authors && Array.isArray(data.authors.edges) && data.authors.edges.length > 0) {
        const author = data.authors.edges[0]
        const authorDetails = authorDetailsData?.authorDetails || {}
        
        const handleEdit = () => {
            setIsEditing(true)
            setEditedAuthor({
                name: author.name,
                biography: author.biography,
                bornDate: author.born_date,
                profileImageUri: author.profile_image_uri,
                ...authorDetails
            })
        }

        const handleUpdate = async () => {
            setIsUpdating(true)
            try {
                const formattedDate = getFormattedDate(new Date(Number(editedAuthor.bornDate)))

                await updateAuthor({
                    variables: {
                        id: Number(id),
                        name: editedAuthor.name,
                        biography: editedAuthor.biography,
                        bornDate: formattedDate,
                        profileImageUri: editedAuthor.profileImageUri,
                    }
                })

                await updateAuthorDetails({
                    variables: {
                        authorId: Number(id),
                        phone: editedAuthor.phone,
                        address: editedAuthor.address,
                        email: editedAuthor.email,
                        website: editedAuthor.website
                    }
                })

                setIsEditing(false)
            } catch (error) {
                console.error('Error updating author:', error)
            } finally {
                setIsUpdating(false)
            }
        }

        const handleCancel = () => {
            setIsEditing(false)
            setEditedAuthor(null)
        }

        const handleInputChange = (e) => {
            const { name, value } = e.target;
            if (name === 'profileImageUri') {
                setProfileImage(value)
            }
            setEditedAuthor(prevAuthor => ({
                ...prevAuthor,
                [name]: name === 'bornDate' ? new Date(value).getTime() : value,
            }));
        }

        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto bg-blue-200 dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                    <div className="md:flex p-8">
                        <div className="md:flex-shrink-0 mr-8">
                            {author.profile_image_uri && (
                                <Image
                                    src={profileImage ? profileImage : author.profile_image_uri}
                                    alt={`Profile of ${author.name}`}
                                    width={300}
                                    height={300}
                                    className="w-full h-auto object-cover md:w-64 lg:w-80 rounded-full"
                                    priority
                                />
                            )}
                        </div>
                        <div className="flex-grow">
                            {isEditing ? (
                                <div className="space-y-6 bg-blue-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                                        <input
                                            id="name"
                                            type="text"
                                            name="name"
                                            value={editedAuthor.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 text-xl font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="profileImageUri" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Profile Image URL</label>
                                        <input
                                            id="profileImageUri"
                                            type="text"
                                            name="profileImageUri"
                                            value={editedAuthor.profileImageUri}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="bornDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Born Date</label>
                                        <input
                                            id="bornDate"
                                            type="date"
                                            name="bornDate"
                                            value={new Date(Number(editedAuthor.bornDate)).toLocaleDateString('en-CA')}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="biography" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Biography</label>
                                        <textarea
                                            id="biography"
                                            name="biography"
                                            value={editedAuthor.biography}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-vertical"
                                            rows={Math.max(3, Math.min(10, editedAuthor.biography.split('\n').length))}
                                            style={{ minHeight: '100px', maxHeight: '300px' }}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                                        <input
                                            id="phone"
                                            type="tel"
                                            name="phone"
                                            value={editedAuthor.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                                        <input
                                            id="address"
                                            type="text"
                                            name="address"
                                            value={editedAuthor.address}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={editedAuthor.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Website</label>
                                        <input
                                            id="website"
                                            type="url"
                                            name="website"
                                            value={editedAuthor.website}
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
                                                    Update Author
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
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                                        <p className="w-full px-4 py-2 text-xl font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                                            {author.name}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Born Date</label>
                                        <p className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                                            {new Date(Number(author.born_date)).toLocaleDateString('en-GB')}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Biography</label>
                                        <p className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                                            {author.biography}
                                        </p>
                                    </div>
                                    {authorDetails.phone && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                                        <p className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                                            {authorDetails.phone}
                                        </p>
                                    </div>
                                    )}
                                    {authorDetails.address && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                                        <p className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                                            {authorDetails.address}
                                        </p>
                                    </div>
                                    )}
                                    {authorDetails.email && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                        <p className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                                            {authorDetails.email}
                                        </p>
                                    </div>
                                    )}
                                    {authorDetails.website && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Website</label>
                                        <p className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                                            {authorDetails.website}
                                        </p>
                                    </div>
                                    )}
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
                </div>
            </div>
        )
    }
}