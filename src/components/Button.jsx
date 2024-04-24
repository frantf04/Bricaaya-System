import React from "react";
import styles from "./css/Button.module.css"
function Button({ text, onClick }) {
  return <button className={styles.btn} onClick={onClick}>{text}</button>;
}

export default Button;
