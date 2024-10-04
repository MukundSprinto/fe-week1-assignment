import Link from 'next/link'
import React from 'react'

export default function MenuItem({title, address, Icon}) {
  return (
    <Link href={address} className='hover:text-amber-600'>
      <Icon className='text-2xl' />
      <p className='uppercase text-sm'>{title}</p>
    </Link>
  )
}
