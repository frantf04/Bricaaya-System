import React, { useContext, useEffect, useState } from "react";
import Table from "../../components/Table";
import axios from "axios";
import Form from "../../components/Form/Form";
import Input from "../../components/Form/Input";
import { getCookieValue } from "../../utils";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Select from 'react-select'
import {Context} from '../../App'

function Proveedor() {
  const {sendingData, setSendingData}= useContext(Context)
  const [suppliers, setSuppliers] = useState([]);
  const [supplier, setSupplier] = useState({});
  const [newSupplier, setNewSupplier] = useState({});
  const token = getCookieValue('token')
  const [formActive, setFormActive] = useState(false);
  const [isActive, setIsactive] = useState(false);
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
      if (!token) return document.location.href = `http://${document.location.host}/login`;
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/suppliers`, {
          headers: {
            Authorization: `Bearer ${token} `,
          },
        })
        .then((res) => {
          if (res.data.length === 0) return;
          setSuppliers(res?.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }, [token, refresh]);


  const handdleChange = (e, name) => {
    const value = e.target ? e.target.value : e.value; // Verifica si es un evento de input o un valor seleccionado de React-Select
    setSupplier((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log(name, value);
  };

  const handdleChangeNewSupplier = ({target}) => {
    const name = target.name
    const value = target.value

        // Actualizamos el estado solo para el input que ha cambiado
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const createNewSupplier = (e) => {
    e.preventDefault()
    try {
      if (!token) return (document.location.href = "http://" + document.location.host + "/login");
      if (!sendingData) {
        setSendingData(true)
        const data = formData
        axios
          .post(`${process.env.REACT_APP_API_URL}/api/suppliers`, data, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then((res) => {
            setRefresh(!refresh)
            setFormActive(false)
            withReactContent(Swal).fire({
              title: "Suplidor agregado!",
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            })
            setSendingData(false)
          })
          .catch((err) => {
            setSendingData(false)
            const status = err.response?.status
            const message = err.response?.data?.message
            const missing_fields = (status === 400 && err.response?.data?.errorType === "missing-fields")
            withReactContent(Swal).fire({
              title: `${missing_fields?'Faltan campos requeridos': message}.`,
              icon: 'error',
              confirmButtonColor: "#2169f6"
            })
            console.log(err);
          });
      }

    } catch (error) {
      console.log(error);
    }
  };
  const showSupplier = (id) => {
    const supplierFound = suppliers.find((supplier) => supplier._id === id);
    setSupplier(supplierFound);
    console.log(supplierFound);
  };
  const edit = (e) => {
    e.preventDefault()
    try {
      const data = {
        ...supplier,
      };
      if (token) {
        axios
          .patch(`${process.env.REACT_APP_API_URL}/api/suppliers/${data._id}`, data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setIsactive(false)
            setRefresh(!refresh)
          });
      } else {
      }
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
        title="Proveedores"
        condition={["_id", "updatedAt"]}
        columnHeadersMapping={columnHeadersMapping}
        data={suppliers}
        columns={columnHeadersMapping}
        action={true}
        actionElements={
          <>
            <td
              className="col"
              style={{
                color: "#fff",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  background: "#2169f6",
                  padding: "0.5rem",
                  borderRadius: "6px",
                }}
                onClick={(e) => {
                  if (!e.target.classList.contains("fas")) {
                    const id = e.target.parentNode.parentNode.id;
                    showSupplier(id);
                    setIsactive(true);
                  }
                }}
              >
                Editar <i className="fas fa-edit"></i>
              </span>
            </td>
          </>
        }
      />
      {formActive && <Form loading={sendingData} onSubmit={createNewSupplier} title="Agregar Proveedor" setFormActive={setFormActive}>
        <Input required={true} onChange={handdleChangeNewSupplier} name="name" placeholder="Nombre" />
        <Input required={true} onChange={handdleChangeNewSupplier} name="phone" placeholder="Telefono" />
        <Input onChange={handdleChangeNewSupplier} name="mail" placeholder="Correo electronico" />
        <Input onChange={handdleChangeNewSupplier} name="address" placeholder="Direccion" />
        <textarea onChange={handdleChangeNewSupplier}
          name="comment"
          cols="30"
          rows="10"
          style={{ width: "100%", maxWidth: "100%", maxHeight: "150px", padding: '.5rem', outline: 'none', borderRadius: '6px'}}
          placeholder="Agrega un comentario..."
        ></textarea>
      </Form>}
      {isActive && (
        <Form onSubmit={edit} title={"Editar usuario"} setFormActive={setIsactive}>
          <label htmlFor="">Nombre</label>
          <Input
            required={true}
            onChange={(e) => handdleChange(e, "name")}
            value={supplier?.name}
          />
          <label htmlFor="">Telefono</label>
          <Input
            required={true}
            onChange={(e) => handdleChange(e, "phone")}
            value={supplier?.phone}
          />
          <label htmlFor="">Correo</label>
          <Input
            onChange={(e) => handdleChange(e, "mail")}
            value={supplier?.mail}
          />
  
          <label htmlFor="">address</label>
          <Input onChange={(e) => handdleChange(e, "address")}
            value={supplier?.address}
          />
          <label htmlFor="">Comentario</label>

          <textarea onChange={(e)=> handdleChange(e, "comment")}
          name="comment"
          cols="30"
          rows="10"
          style={{ width: "100%", maxWidth: "100%", maxHeight: "150px", padding: '.5rem', outline: 'none', borderRadius: '6px'}}
            placeholder="Agrega un comentario..."
            value={supplier.comment}
        ></textarea>
        </Form>
      )}
    </>
  );
}

export default Proveedor;
