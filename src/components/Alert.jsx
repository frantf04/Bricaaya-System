import React from 'react'
import styles from './css/Alert.module.css'
const Alert = ({ text = "Alert", type = "success" }) => {
  return (
    <div className={styles.Alert} style={{ background: type === 'success' ? '#d7e9d7' : type === 'error' ? '#f00' : null, color: type !== 'success' ? '#fff' :  null }}>
      {text}
      {type === 'success' ?
        <i className='fas fa-check-circle'></i>
        :
        <i className='fas fa-times-circle'></i>
      }
    </div>
  )
}

export default Alert