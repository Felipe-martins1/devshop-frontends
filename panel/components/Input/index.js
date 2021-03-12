import React, { useEffect } from 'react'
const Input = ({
  type,
  placeholder = '',
  label = '',
  value,
  onChange,
  name,
  helpText = null,
  errorMessage = ''
}) => {
  useEffect(() => {
    if (errorMessage) {
      document
        .getElementById('id-' + name)
        .classList.remove('border-gray-200', 'focus:border-gray-500')
      document
        .getElementById('id-' + name)
        .classList.add('border-red-400', 'focus:border-red-400')
    } else {
      document
        .getElementById('id-' + name)
        .classList.remove('border-red-400', 'focus:border-red-400')
      document
        .getElementById('id-' + name)
        .classList.add('border-gray-200', 'focus:border-gray-500')
    }
  }, [errorMessage])
  return (
    <div className='w-full px-3'>
      <label
        className='mt-4 block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
        htmlFor={'id-' + name}
      >
        {label}
      </label>
      <input
        className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
        id={'id-' + name}
        type={type}
        placeholder={placeholder}
        name={name}
        onChange={onChange}
        value={value}
      />
      {errorMessage && (
        <p className='text-red-500 text-xs italic'> {errorMessage}</p>
      )}
      {helpText && <p className='text-gray-600 text-xs italic'>{helpText}</p>}
    </div>
  )
}

export default Input
