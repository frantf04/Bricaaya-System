import React, { useState, useEffect } from "react";
import Table from "../../../components/Table";
import Alert from "../../../components/Alert";
import axios  from "axios";
import { getCookieValue } from "../../../utils";

function Embalaje() {
  const [formActive, setFormActive] = useState(false);
  const [refresh, setRefresh] = useState(false);
  // const {refresh, setRefresh} = useContext(Context)
  
  const [error, setError] = useState(false);
  const [supplies, setSupplies] = useState([]);

  const token = getCookieValue('token')

  useEffect(() => {
    if (token) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/dashboard/supplies`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setSupplies(response.data);
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

  return (
    <>
      <Table title="Embalaje y Etiquetado" btn={false} data={supplies}/>
      {error && <Alert text={error} type="error"/>}
    </>
  );
}

export default Embalaje;
