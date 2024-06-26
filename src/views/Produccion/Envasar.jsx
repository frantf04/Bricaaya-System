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
import { renderToString } from "react-dom/server";
export const PurchaseContext = createContext();

function ProduccionEnvasar() {
  const [tasks, setTask] = useState([{}]);
  const [rawMaterial, setRawMaterial] = useState([]);
  const [finishedProduct, setFinishedProduct] = useState([]);
  const [formActive, setFormActive] = useState(false);
  const [finishedFormActive, setFinishedFormActive] = useState(false);
  const { refresh, setRefresh } = useContext(Context);
  const [taskId, setTaskId] = useState("");
  const [error, setError] = useState(false);
  const [cancelModalActive, setCancelModalActive] = useState(false);
  const [confirmModalActive, setConfirmModalActive] = useState(false);
  const [queryCheck, setQueryCheck] = useState(false);
  const [endAmount, setEndAmount] = useState(0);
  const [formData, setFormData] = useState({
    code: "",
    inQuanty: "",
    stage: "package",
  });

  const token = getCookieValue("token");

  useEffect(() => {
    if (token) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/tasks?type=package`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setTask(response.data.data);
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
        .get(`${process.env.REACT_APP_API_URL}/api/finishedproducts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setFinishedProduct(response.data.data);
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
            showConfirmButton: false,
          });
        })
        .catch((err) => {
          const statusCode = err?.response?.status;
          const message = err?.response?.data?.message;
          const productosFaltante = err.response?.data?.productosFaltante
          const el = productosFaltante?.map(
            (value, index) => {
              return (
                <li key={index}>
                  {value.necessary_amount} de {value.name}
                </li>
              );
            }
          );
          withReactContent(Swal).fire({
            title:
              // statusCode === 409 && productosFaltante?.length > 0 
              statusCode === 409 
                ? "Material insuficiente."
                // : statusCode === 409 && !productosFaltante? "Hay un proceso activo de este producto"
                : statusCode === 400
                ? "Faltan campos requeridos!"
                : message,
            // html: <ol>{el}</ol>,
            // text: "",
            scrollbarPadding: "1px",
            icon: "error",
            confirmButtonColor: "#2169f6",
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  const endTask = (id) => {
    try {
      if (!token)
        return (document.location.href =
          "http://" + document.location.host + "/login");
      const data = {
        outQuanty: endAmount,
      };
      axios
        .patch(`${process.env.REACT_APP_API_URL}/api/tasks/finish/${id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setRefresh(!refresh);
          setConfirmModalActive(false);

          if (!queryCheck) {
            setQueryCheck(res?.data?.message);
            setTimeout(() => {
              setQueryCheck(false);
            }, 2000);
          }
        })
        .catch((err) => {
          if (!error) {
            setError(
              `Error (${err.response.status}): ${err.response?.data?.message}.`
            );
            setTimeout(() => {
              setError(null);
            }, 2000);
          }
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
          if (!queryCheck) {
            setQueryCheck(res?.data?.message);
            setTimeout(() => {
              setQueryCheck(false);
            }, 2000);
          }
        })
        .catch((err) => {
          if (!error) {
            setError(
              `Error (${err.response.status}): ${err.response?.data?.message}.`
            );
            setTimeout(() => {
              setError(null);
            }, 2000);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
  const columnHeadersMapping = {
    lotNumber: "# lote",
    code: "Codigo",
    name: "Nombre",
    type: "proceso",
    price: "Precio",
    inQuanty: "Cantidad",
    status: "Estado",
    total: "Total",
    createdAt: "Fecha de Registro",
  };
  return (
    <>
      <Table
        title="Producción (Envasar)"
        columnHeadersMapping={columnHeadersMapping}
        condition={[
          "_id",
          "category",
          "updatedAt",
          "outQuanty",
          "reduction_percentage",
        ]}
        data={tasks}
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
                    !target.parentNode.parentNode.children[6].innerText
                      .trim()
                      .includes("Terminado")
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
                onClick={async (e) => {
                  const id = e.target.parentNode.parentNode.id;
                  if (
                    !e.target.parentNode.parentNode.children[6].innerText
                      .trim()
                      .includes("Terminado")
                  ) {
                    withReactContent(Swal).fire({
                      title: "Terminar Proceso.",
                      text: "Quieres marcar como terminado este proceso?",
                      preConfirm: () => endTask(id),
                      icon: "question",
                      confirmButtonText: "Confirmar",
                      showCloseButton: true,
                      confirmButtonColor: "#2169f6",
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
            Producto a Envasar<i style={{ color: "red" }}>*</i>
          </label>
          <select name="code" id="code" onChange={handdleChange}>
            <option value=""></option>
            {finishedProduct.map((product, index) => {
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
            step="1"
            onChange={handdleChange}
            name="inQuanty"
          />
        </Form>
      )}
    </>
  );
}

export default ProduccionEnvasar;
