const Alert = ({ children }) => {
  return (
    <div
      className='bg-opacity-40 bg-red-500 border-l-4 border-red-700 text-red-700 p-7 text-xl'
      role='alert'
    >
      {children}
    </div>
  )
}

export default Alert
