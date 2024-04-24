import React, { useContext } from "react";
import styles from "../css/Form.module.css";
import Button from "../Button";
function Form({ onSubmit = ()=> {}, title, children, style, setFormActive = ()=> {}, btnConfirmText = "Agregar" }) {
  return (
    <div className={styles.formContainer}>
      <form onSubmit={onSubmit} style={style}>
        <h2>{title}</h2>
        <div className={styles.inputContainer}>{children}</div>
        <div className={styles.btnContainer}>
          <Button text={btnConfirmText} />
          <Button text="Cancelar" onClick={() => setFormActive(false)} />
        </div>
      </form>
    </div>
  );
}

export default Form;
