import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function BookCard({ book, isPortrait }) {

    return (
        <div className="bg-blue-100 dark:bg-gray-800 shadow-md rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <div className={`relative ${isPortrait ? 'h-64' : 'h-48'}`}>
                <Image
                    src={book.cover_image_uri || '/placeholder-cover.jpg'}
                    alt={`Cover for ${book.title}`}
                    layout="fill"
                    objectFit="contain"
                    className={`transition-opacity duration-300 hover:opacity-90 ${isPortrait ? 'object-cover' : 'object-contain'}`}
                />
                {(() => {
                    const oneMonthAgo = new Date();
                    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                    const publishedDate = new Date(Number(book.published_date));
                    if (publishedDate > oneMonthAgo) {
                        return (
                            <div className="absolute top-0 right-0 bg-yellow-400 text-xs font-bold px-2 py-1 m-2 rounded-full">
                                New
                            </div>
                        );
                    }
                    return null;
                })()}
            </div>
            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 truncate">{book.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 truncate">By {book.author.name}</p>
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                    <p>Published: {new Date(Number(book.published_date)).toLocaleDateString()}</p>
                </div>
                <div className="mt-3">
                    <Link href={`/books/${book.id}`}>
                        <span className="w-full inline-block text-center bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300">
                            Open
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    )
}