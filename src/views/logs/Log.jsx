import React, { useEffect, useState, useContext } from "react";
// import { Context } from "../../App";
import Table from "../../components/Table";
import { getCookieValue } from "../../utils";
import axios from "axios";

function Log() {
  // const { data } = useContext(Context);
  const token = getCookieValue("token");
  const [logsData, setLogs] = useState([]);

  const columnHeadersMapping = {
    userName: "userName",
    userRole: "userRole",
    ipAddress: "ipAddress",
    action: "action",
    description: "description",
    createdAt: "createdAt",
  };

  useEffect(() => {
    try {
      if (token) {
        axios
          .get(`${process.env.REACT_APP_API_URL}/api/dashboard/logs`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setLogs(res.data);
          })
          .catch((err) => {
            console.error("Error de autenticación", err);
            document.location.href = "http://" + document.location.host + "/login";
          });
      } else {
        document.location.href = "http://" + document.location.host + "/login";
      }
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  return (
    <>
      <Table
        title="Registro de actividades"
        columnHeadersMapping={columnHeadersMapping}
        columns={columnHeadersMapping}
        
        data={logsData}
        btn={false}
        condition={["_id", 'updatedAt']}
      />
    </>
  );
}

export default Log;
