import Link from 'next/link'
import React from 'react'
import { IoMdArrowRoundBack } from 'react-icons/io'

const Button = ({ children, type }) => {
  return (
    <button
      className=' bg-indigo-600 rounded p-2 text-white font-semibold '
      type={type}
    >
      {children}
    </button>
  )
}

const ButtonLink = ({ children, href }) => {
  return (
    <button
      className='duration-200 mt-10 bg-white rounded border border-indigo-600 p-2 text-indigo-600 font-semibold hover:bg-indigo-600 hover:text-white '
      type='button'
    >
      <Link href={href}>
        <div className='flex items-center'>
          <IoMdArrowRoundBack alt='voltar' />
          {children}
        </div>
      </Link>
    </button>
  )
}
Button.Link = ButtonLink
export default Button
