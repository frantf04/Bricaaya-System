import React from 'react'
import styles from './css/Loader.module.css'
function Loader({text, width = 80, color = "#4fa94d", secondColor = "#4fa94db3"}) {
  return (
    <div className={styles.loader} style={{borderColor: secondColor ,width: `${width}px`, height: `${width}px`}}>
        {text}
      <span style={{ borderRightColor: color }}>
      </span>
    </div>
  )
}



export default Loader