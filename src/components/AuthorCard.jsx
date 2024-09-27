import React from 'react'
import Link from 'next/link'
export default function AuthorCard({ author }) {
  return (
    <div className="bg-blue-100 dark:bg-gray-800 shadow-md rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
        <img src={author.profile_image_uri} alt={author.name} className="w-full h-48 object-contain" 
          onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbczgCenD6-k568-z0guns8--Pg2tlwFBtpQ&s';
          }}
        />
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">{author.name}</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">Born: {new Date(Number(author.born_date)).toLocaleDateString('en-GB')}</p>
            <p className="text-gray-700 dark:text-gray-200 text-sm line-clamp-3">{author.books.length === 1 ? `${author.books.length} book` : `${author.books.length} books`}</p>
        </div>
        <div className="p-4 mt-auto">
            <Link href={`/authors/${author.id}`}>
                <span className="w-full inline-block text-center bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300">
                    View Details
                </span>
            </Link>
        </div>
    </div>
  )
}
