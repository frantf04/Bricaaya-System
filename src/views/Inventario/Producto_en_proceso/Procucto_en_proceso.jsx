import React, { useState, useEffect } from "react";
import Table from "../../../components/Table";
import Alert from "../../../components/Alert";
import axios  from "axios";
import { getCookieValue } from "../../../utils";

function ProcessedProduct() {
  // const [formActive, setFormActive] = useState(false);
  const [refresh, setRefresh] = useState(false);
  // const {refresh, setRefresh} = useContext(Context)

  const [error, setError] = useState(false);
  const [processedProduct, setProcessedProduct] = useState([]);

  const token = getCookieValue('token')

  useEffect(() => {
    if (token) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/dashboard/processedproduct`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setProcessedProduct(response.data);
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
    stock: "Stock",
    totalInQuanty: 'Entrada total de producto',
    createdAt: "Fecha de registro",
    updatedAt: "Ultima Modificación",
  };
  return (
    <>
      <Table condition={['_id', "createdAt", "totalInQuanty"]} columns={columnHeadersMapping} columnHeadersMapping={columnHeadersMapping} title="Productos Procesados" btn={false} data={processedProduct}/>
      {error && <Alert text={error} type="error"/>}
    </>
  );
}

export default ProcessedProduct;
