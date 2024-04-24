import axios from "axios";
import React, { useEffect, useState } from "react";
import Table from "../../../components/Table";
import Form from "../../../components/Form/Form";
import Input from "../../../components/Form/Input";
import Alert from "../../../components/Alert";
import { getCookieValue } from "../../../utils";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function MateriaPrima() {
  const [rawMaterial, setRawMaterial] = useState([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [formActive, setFormActive] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState(false);
  const [queryCheck, setQueryCheck] = useState(false);
  const token = getCookieValue("token");

  useEffect(() => {
    if (token) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/dashboard/rawmaterial`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setRawMaterial(response.data);
        })
        .catch((error) => {
          console.error("Error de autenticación", error);
          document.location.href = "http://" + document.location.host + "/login";
        });
    } else {
      document.location.href = "http://" + document.location.host + "/login";
    }
  }, [token, refresh]);

  const columnHeadersMapping = {
    code: "Codigo",
    name: "Nombre",
    cost: "Costo",
    stock: "Disponible (LB)",
    total: "Total",
    createdAt: "Fecha de Registro",
    updatedAt: "Ultima Modificación",
  };

  const newRawMaterial = (e) => {
    e.preventDefault();
    try {
      if (!token)
        return (document.location.href =
          "http://" + document.location.host + "/login");
      const data = {
        code,
        name,
      };
      axios
        .post(`${process.env.REACT_APP_API_URL}/api/register/rawmaterial`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setRefresh(!refresh);
          setFormActive(false);
          withReactContent(Swal).fire({
            title: "Producto agregado!",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        })
        .catch((err) => {
          const status = err.response?.status;
          const message = err.response?.data?.message;
          withReactContent(Swal).fire({
            title: `Error (${status}): ${
              status === 400 ? "Faltan campos requeridos":status===409? "Nombre o Codigo ya registrado." : message
            }.`,
            icon: "error",
            confirmButtonColor: "#2169f6",
          });
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Table
        onClick={() => setFormActive(true)}
        data={rawMaterial}
        btnText="Agregar"
        title="Materias Primas"
        columnHeadersMapping={columnHeadersMapping}
        columns={columnHeadersMapping}
      />
      {formActive && (
        <Form
          onSubmit={newRawMaterial}
          title="Nueva Materia Prima"
          setFormActive={setFormActive}
        >
          <Input
            required={true}
            placeholder="Codigo"
            onChange={({ target }) => setCode(target.value)}
          />
          <Input
            required={true}
            placeholder="Nombre"
            onChange={({ target }) => setName(target.value)}
          />
        </Form>
      )}
      {error && <Alert type="error" text={error} />}
      {queryCheck && <Alert text={queryCheck} />}
    </>
  );
}

export default MateriaPrima;
