import './Button.css'

function Button({ onClick, id, sign, disabled }) {
  return (
    <button className="square" onClick={onClick} id={id} disabled={disabled}>
      {sign}
    </button>
  )
}

export default Button
