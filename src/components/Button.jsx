import React from "react";
import styles from "./css/Button.module.css"
import Loader from "./Loader";
function Button({ text, onClick, loading }) {
  return <button className={styles.btn} onClick={onClick}>{
   loading? <Loader width={20} color="#fff" secondColor="#ccc" />: text
  }</button>;
}

export default Button;
