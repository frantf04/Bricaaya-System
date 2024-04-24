import React from 'react'

function Input({required, type, placeholder, onChange, value, name, step="any", min, minLength}) {
  return (
    <input min={min} minLength={minLength} step={step} required={required} type={type} placeholder={placeholder} onChange={onChange} value={value} name={name} />
  )
}

export default Input