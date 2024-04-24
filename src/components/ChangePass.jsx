import React, { useContext } from "react";
import Form from "./Form/Form";
import Input from "./Form/Input";
import { Context } from "../App";
import { getCookieValue } from "../utils";
import axios from "axios";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

function ChangePass() {
  const { setChangePassActive } = useContext(Context);
  const token = getCookieValue("token");
  const changePass = (e) => {
    try {
      e.preventDefault();
      const currentPass = e.target.elements["current"];
      const newPass = e.target.elements["new"];
      const confirmNewPass = e.target.elements["confirm"];
      if (newPass.value !== confirmNewPass.value) {
        newPass.style.borderColor = "red";
        confirmNewPass.style.borderColor = "red";
        confirmNewPass.parentNode.children[2].style.display = "inline";
        return;
      }
      const data = {
        currentPass: currentPass.value,
        newPass: newPass.value,
      };
      axios
        .post(`${process.env.REACT_APP_API_URL}/api/edit/newpass`, data, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          e.target.reset();
          setChangePassActive(false);
          withReactContent(Swal).fire({
            title: "Contraseña cambiada!",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        })
        .catch((err) => {
          currentPass.style.borderColor = "red";
          currentPass.parentNode.children[2].style.display = "inline";
         
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Form
      onSubmit={changePass}
      title={"Cambiar contraseña"}
      setFormActive={setChangePassActive}
    >
      <div className="row" style={styles.row}>
        <label>Clave actual</label>
        <Input
          type={"password"}
          required={true}
          name="current"
          placeholder={"Introduzca su clave actual"}
        />
        <span style={styles.row.span}>Contraseña incorrecta</span>
      </div>
      <div className="row" style={styles.row}>
        <label>Clave nueva</label>
        <Input
          type={"password"}
          required={true}
          name="new"
          placeholder={"Introduzca una clave nueva"}
        />
      </div>
      <div className="row" style={styles.row}>
        <label>Confirmar clave nueva</label>
        <Input
          type={"password"}
          required={true}
          name="confirm"
          placeholder={"confirme su clave nueva"}
        />
        <span style={styles.row.span}>Las contraseña no coinciden</span>
      </div>
    </Form>
  );
}

const styles = {
  row: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    span: {
      fontSize: "12px",
      color: "red",
      alignSelf: "flex-end",
      display: "none",
    },
  },
};

export default ChangePass;
