import React, { createContext, useContext, useEffect, useState } from "react";
import RowItem from "../../components/RowItem";
import axios from "axios";
import Button from "../../components/Button";
import Form from "../../components/Form/Form";
import Input from "../../components/Form/Input";
import Table from "../../components/Table";
import Alert from "../../components/Alert";
import { Context } from "../../App";
import { Link } from "react-router-dom";
import ErrorModal from "../../components/ErrorModal";
import { getCookieValue } from "../../utils";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
export const PurchaseContext = createContext();

function ProduccionDeshidratar() {
  const MySwal = withReactContent(Swal);
  const [purchase, setPurchase] = useState([{}]);
  const [rawMaterial, setRawMaterial] = useState([]);
  const [finishedProduct, setFinishedProduct] = useState([]);
  const [formActive, setFormActive] = useState(false);
  const [finishedFormActive, setFinishedFormActive] = useState(false);
  const { refresh, setRefresh } = useContext(Context);
  const [taskId, setTaskId] = useState("");
  const [error, setError] = useState(false);
  const [cancelModalActive, setCancelModalActive] = useState(false);
  const [queryCheck, setQueryCheck] = useState(false);
  const [endAmount, setEndAmount] = useState(0);
  const [formData, setFormData] = useState({
    code: "",
    inQuanty: "",
    stage: "dehydrate",
  });

  const token = getCookieValue("token");

  useEffect(() => {
    if (token) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/tasks/?type=dehydrate`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setPurchase(response.data.data);
        })
        .catch((error) => {
          console.error("Error de autenticación", error);
          document.location.href =
            "http://" + document.location.host + "/login";
        });
      /* -------------------------------------------------------------------------- */
      /*                                      -                                     */
      /* -------------------------------------------------------------------------- */
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/rawmaterials`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setRawMaterial(response.data.data);
          setFormData({
            code: "",
            inQuanty: "",
            stage: "dehydrate",
          });
        })
        .catch((error) => {
          console.error("Error de autenticación", error);
          document.location.href =
            "http://" + document.location.host + "/login";
        });

    } else {
      document.location.href = "http://" + document.location.host + "/login";
    }
  }, [token, refresh]);

  const handdleChange = ({ target }) => {
    const name = target.name;
    const value = target.value;

    // Actualizamos el estado solo para el input que ha cambiado
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const newTask = (e) => {
    e.preventDefault();
    try {
      if (!token)
        return (document.location.href =
          "http://" + document.location.host + "/login");
      const data = formData;
      axios
        .post(`${process.env.REACT_APP_API_URL}/api/tasks`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setRefresh(!refresh);
          setFormActive(false);
            withReactContent(Swal).fire({
              title: "Nuevo proceso iniciado!",
              icon: "success",
              timer: 1500,
              showConfirmButton: false
            });
          //  
        })
        .catch((err) => {
          const statusCode = err?.response?.status;
          const message = err?.response?.data?.message;
          withReactContent(Swal).fire({
            title:
              statusCode === 409
                ? `Material insuficiente quedan ${err.response.data.stock} en stock.`
                : statusCode === 400
                ? "Faltan campos requeridos!"
                : message,
            icon: "error",
            confirmButtonColor: "#2169f6",
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  const endTask = (id, outQuanty) => {
    try {
      if (!token)
        return (document.location.href =
          "http://" + document.location.host + "/login");
      const data = {
        outQuanty
      };
      axios
        .patch(`${process.env.REACT_APP_API_URL}/api/tasks/finish/${id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setRefresh(!refresh);
          withReactContent(Swal).fire({
            title: `Proceso marcado como terminado!`,
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
            confirmButtonColor: "#2169f6",
          });
        })
        .catch((err) => {
          withReactContent(Swal).fire({
            title: err.response.data.message,
            icon: "error",
            confirmButtonColor: "#2169f6",
          });
        });
    } catch (error) {
      console.log(error);
    }
  };
  const cancelTask = (id) => {
    try {
      if (!token)
        return (document.location.href =
          "http://" + document.location.host + "/login");
      axios
        .delete(`${process.env.REACT_APP_API_URL}/api/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setRefresh(!refresh);
          setCancelModalActive(false);
          withReactContent(Swal).fire({
            title: `Se ha cancelado el proceso!`,
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
            confirmButtonColor: "#2169f6",
          });
        })
        .catch((err) => {
          withReactContent(Swal).fire({
            title: `${err.response.data.message}`,
            icon: "error",
            confirmButtonColor: "#2169f6",
          });
        });
    } catch (error) {
      console.log(error);
    }
  };
  const columnHeadersMapping = {
    code: "Codigo",
    name: "Nombre",
    type: "proceso",
    price: "Precio",
    amount: "Cantidad",
    inQuanty: "Entrada",
    outQuanty: "Cantidad Resultante",
    status: "Estado",
    reduction_percentage: "Reducción %",
    createdAt: "Fecha de Registro",
  };
  return (
    <>
      <Table
        title="Producción (Deshidratar)"
        columnHeadersMapping={columnHeadersMapping}
        condition={["_id", "category", "updatedAt"]}
        data={purchase}
        onClick={() => setFormActive(true)}
        btnText="Nuevo Proceso"
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
                  background: "#F00",
                  padding: "0.5rem",
                  height: "100%",
                  margin: "0 0.5rem",
                  borderRadius: "6px",
                  borderRight: "1px solid #fff",
                }}
                onClick={({ target }) => {
                  const id = target.parentNode.parentNode.id;
                  if (
                    target.parentNode.parentNode.children[6].innerText.trim() !==
                    "Terminado"
                  ) {
                    withReactContent(Swal).fire({
                      title: "Cancelar Proceso.",
                      text: "Está seguro de cancelar este proceso?",
                      footer: "Esta acción no se puede deshacer.",
                      icon: "question",
                      showCloseButton: true,
                      confirmButtonText: "Confirmar",
                      confirmButtonColor: "#2169f6",
                      preConfirm: () => cancelTask(id),
                    });
                  } else {
                    withReactContent(Swal).fire({
                      title: "Este proceso ya está terminado!",
                      icon: "error",
                      confirmButtonColor: "#2169f6",
                    });
                  }
                }}
              >
                Cancelar
              </span>
              <span
                style={{
                  // background: "#00bb00",
                  background: "#2169f6",
                  padding: "0.5rem",
                  borderRadius: "6px",
                }}
                onClick={(e) => {
                  const id = e.target.parentNode.parentNode.id;
                  if (
                    e.target.parentNode.parentNode.children[6].innerText.trim() !==
                    "Terminado"
                  ) {
             
                    withReactContent(Swal).fire({
                      title: "Cantidad resultante!",
                      icon: "info",
                      input: 'number',
                      inputPlaceholder: "Agregar cantidad final",
                      inputAttributes: {
                        "step": 'any'
                      },
                      confirmButtonColor: "#2169f6",
                      confirmButtonText: 'Continuar',
                      showCloseButton: true,
                      preDeny: ()=> {setFinishedFormActive(false)},
                      preConfirm: () => endTask(id, Swal.getInput()?.value)
                    });
                  } else {
                    withReactContent(Swal).fire({
                      title: "Este proceso ya está terminado.",
                      icon: "error",
                      confirmButtonColor: "#2169f6",
                    });
                  }
                }}
              >
                Terminar
              </span>
            </td>
          </>
        }
      />
      {formActive && (
        <Form
          title="Nuevo Proceso"
          onSubmit={newTask}
          setFormActive={setFormActive}
          btnConfirmText="Iniciar proceso"
        >
          <label htmlFor="code">
            producto a deshidratar<i style={{ color: "red" }}>*</i>
          </label>
          <select name="code" id="code" onChange={handdleChange}>
            <option value=""></option>
            {rawMaterial.map((product, index) => {
              return (
                <option key={index} value={product.code}>
                  {product.code} - {product.name}
                </option>
              );
            })}
          </select>
          <label>
            Cantidad<i style={{ color: "red" }}>*</i>
          </label>
          <Input
            required={true}
            placeholder="Cantidad"
            type="number"
            onChange={handdleChange}
            name="inQuanty"
          />
        </Form>
      )}
    
    </>
  );
}

export default ProduccionDeshidratar;
