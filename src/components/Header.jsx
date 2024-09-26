import React from 'react'
import MenuItem from './MenuItem'
import { AiFillHome } from 'react-icons/ai'
import { BsFillBookFill } from 'react-icons/bs'
import { FaUserPen } from "react-icons/fa6";
import DarkModeSwitch from './DarkModeSwitch'

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className='flex gap-6'>
            <MenuItem title="Home" address="/" Icon={AiFillHome} />
            <MenuItem title="Books" address="/books" Icon={BsFillBookFill} />
            <MenuItem title="Authors" address="/authors" Icon={FaUserPen} />
        </div>
        <div>
            <DarkModeSwitch /> 
        </div>
      </div>
    </header>
  )
}
