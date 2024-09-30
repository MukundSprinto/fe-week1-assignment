'use client'
import {ThemeProvider} from 'next-themes'
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client'

export default function Providers({children}) {
  const client = new ApolloClient({
    uri: "https://week-1-assignment-ep4t.onrender.com/graphql/",
    cache: new InMemoryCache(),
  });
  
  return (
    <div>
      <ThemeProvider defaultTheme='system' enableSystem={true} attribute='class'>
        <div className='text-gray-700 dark:text-gray-200 dark:bg-gray-700 min-h-screen select-none transition-colors duration-300'>
          <ApolloProvider client={client}>
            {children}
          </ApolloProvider>
        </div>
      </ThemeProvider>
    </div>
  )
}
