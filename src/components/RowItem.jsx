import React from "react";
import styles from './css/RowItem.module.css'
function RowItem(props) {
  return <div className={styles.row}>{props.children}</div>;
}

export default RowItem;
