import React from 'react'
import '../css/Input.css'
function InputCheck({text="text", onChange, name, radius}) {
  return (
    <span className='check'>
      <label htmlFor="">{text}</label>
      <input name={name} type={radius? "radio": "checkbox"} onChange={onChange}/>
    </span>
  )
}


export default InputCheck