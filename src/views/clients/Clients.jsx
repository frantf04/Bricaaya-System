import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import axios from "axios";
import Form from "../../components/Form/Form";
import Input from "../../components/Form/Input";
import { getCookieValue } from "../../utils";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function Cliente() {
  
  const [clients, setClients] = useState([]);
  const token = getCookieValue('token')
  const [formActive, setFormActive] = useState(false);
  const [refresh, setRefresh] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    mail: "",
    address: "",
    comment: ""
  })

  useEffect(() => {
    try {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/dashboard/clients`, {
          headers: {
            Authorization: `Bearer ${token} `,
          },
        })
        .then((res) => {
          if (res.data.length === 0) return;
          setClients(res?.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }, [token, refresh]);

  const handdleChange = ({target}) => {
    const name = target.name
    const value = target.value

        // Actualizamos el estado solo para el input que ha cambiado
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const newClient = (e) => {
    e.preventDefault()
    try {
      if (!token)
        return (document.location.href =
          "http://" + document.location.host + "/login");
      const data = formData
      axios
        .post(`${process.env.REACT_APP_API_URL}/api/register/client`, data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((res) => {
          setRefresh(!refresh)
          setFormActive(false)
          withReactContent(Swal).fire({
            title: "Cliente resgistrado!",
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          })
        })
        .catch((err) => {
          const status = err.response?.status
          const message = err.response?.data?.message
          withReactContent(Swal).fire({
            
            title: `Error (${status}): ${status===400?'Faltan campos requeridos': message}.`,
            icon: 'error',
            confirmButtonColor: "#2169f6"
          })
          
        });
    } catch (error) {
      console.log(error);
    }
  };

  const columnHeadersMapping = {
    name: "Nombre",
    phone: "Telefono",
    mail: "Correo",
    address: "dirección",
    comment: "comentario",
    createdAt: "Fecha de registro",
  };

  return (
    <>
      <Table onClick={()=> setFormActive(true)}
        btnText="Nuevo"
        title="Clientes"
        condition={["_id", "updatedAt"]}
        columnHeadersMapping={columnHeadersMapping}
        data={clients}
        columns={columnHeadersMapping}
      />
      {formActive && <Form onSubmit={newClient} title="Agregar cliente" setFormActive={setFormActive}>
        <Input required={true} onChange={handdleChange} name="name" placeholder="Nombre" />
        <Input required={true} onChange={handdleChange} name="phone" placeholder="Telefono" />
        <Input onChange={handdleChange} name="mail" placeholder="Correo electronico" />
        <Input onChange={handdleChange} name="address" placeholder="Direccion" />
        <textarea onChange={handdleChange}
          name="comment"
          cols="30"
          rows="10"
          style={{ width: "100%", maxWidth: "100%", maxHeight: "150px", padding: '.5rem', outline: 'none', borderRadius: '6px'}}
          placeholder="Agrega un comentario..."
        ></textarea>
      </Form>}
    </>
  );
}

export default Cliente;
