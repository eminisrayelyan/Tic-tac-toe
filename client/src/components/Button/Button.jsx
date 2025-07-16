import { useState } from 'react'
import './Button.css'


function Button({ onClick, id }) {
  const [count, setCount] = useState(0)

  return (
    <button className='square' onClick={onClick} id={id}></button>
  )
}

export default Button
