import PropTypes from 'prop-types'
import { useState } from 'react'

const Message = ({ message, backgroundColor = 'bg-black' }) => {
  const [dismissible, setDismissible] = useState(true)
  if (!message) return <></>
  return (
    <div
      className={`flex flex-between items-center px-4 ${backgroundColor} ${
        dismissible ? '' : 'hidden'
      }`}
    >
      <p className={`mt-2 text-sm text-center rounded text-white mb-3 p-2 flex-1`}>
        {message}
      </p>
      <i
        className='fa-sharp fa-solid fa-xmark text-white'
        onClick={() => setDismissible(false)}
      ></i>
    </div>
  )
}

Message.propTypes = {
  message: PropTypes.string,
  backgroundColor: PropTypes.string,
}
export default Message
