import { gql } from '@apollo/client'


export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">WEEK 1 ASSIGNMENT</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <ul className="list-disc list-inside">
            <li>Browse and search for books</li>
            <li>Add new books and edit/delete existing books</li>
            <li>View detailed book information</li>
            <li>Leave and read book reviews</li>
            <li>Explore author profiles</li>
            <li>Add new authors and edit/delete existing authors</li>
            <li>Dark mode support</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">About This Project</h2>
          <p className="mb-4">
            This project 
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Project Links</h2>
          <ul className="list-disc list-inside">
            <li>
              <a href="https://github.com/yourusername/fe-week1-assignment" className="text-blue-600 dark:text-blue-400 hover:underline">
                Frontend Repository
              </a>
            </li>
            <li>
              <a href="https://github.com/yourusername/be-week1-assignment" className="text-blue-600 dark:text-blue-400 hover:underline">
                Backend Repository
              </a>
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Deployment Information</h2>
          <ul className="list-disc list-inside">
            <li>Frontend: Deployed on Vercel</li>
            <li>Backend: Deployed on Heroku</li>
            <li>PostgreSQL Database: Hosted on Heroku</li>
            <li>MongoDB Database: Hosted on MongoDB Atlas</li>
          </ul>
        </section>

      </div>
    </div>
  )
}
