import { useState } from 'react'
import './Button.css'


function Button({ onClick, id, sign }) {

  return (
    <button className='square' onClick={onClick} id={id}>{sign}</button>
  )
}

export default Button
