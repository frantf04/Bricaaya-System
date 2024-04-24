import React, { useState, useEffect } from "react";
import Table from "../../../components/Table";
import Alert from "../../../components/Alert";
import axios  from "axios";
import { getCookieValue } from "../../../utils";

function Maquinarias() {
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState(false);
  const [machinery, setMachinery] = useState([]);

  const token = getCookieValue('token')

  useEffect(() => {
    if (token) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/dashboard/machinery`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setMachinery(response.data);
        })
        .catch((error) => {
          console.error("Error de autenticación", error);
          document.location.href =
            "http://" + document.location.host + "/login";
        });
      /* -------------------------------------------------------------------------- */
      /*                                      -                                     */
      /* -------------------------------------------------------------------------- */
     
    } else {
      document.location.href = "http://" + document.location.host + "/login";
    }
  }, [token, refresh]);
  const columnHeadersMapping = {
    code: "Codigo",
    name: "Nombre",
    cost: "Costo",
    stock: "Cantidad",
    createdAt: "Fecha de registro",
    updatedAt: "Ultima Modificación",
  };
  return (
    <>
      <Table columns={columnHeadersMapping} columnHeadersMapping={columnHeadersMapping} title="Maquinarias y Equipos" btn={false} data={machinery}/>
      {error && <Alert text={error} type="error"/>}
    </>
  );
}

export default Maquinarias;
