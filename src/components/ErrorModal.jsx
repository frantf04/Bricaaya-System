import React from 'react'
import styles from './css/ErrorModal.module.css'

function ErrorModal({ title = "title", detail = "detail", cause = "cause",btnCancelDisplay = false, btnConfirmDisplay = false, funcConfirm, funcCancel}) {
  return (
    <>
      <div className={styles.gameRunning}>
        <span>
          <div className={styles.title}>{title}</div>
          <div className={styles.line}></div>
          <div className={styles.detail}>
            {detail}
            <br />
            {cause}
          </div>
          <div className={styles.btnContainer} style={{display:btnCancelDisplay? 'flex': 'grid', justifyContent:btnCancelDisplay? 'space-between': 'none', }}>
            <div onClick={funcCancel} style={{display: btnCancelDisplay?'block': 'none'}} className={styles.btnCancel}>NO</div>
            <div onClick={funcConfirm} style={{display: btnConfirmDisplay?'block': 'none'}} className={styles.btnConfirm}>OK</div>
          </div>
        </span>
      </div>
    </>
  )
}

export default ErrorModal
