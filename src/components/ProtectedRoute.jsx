import axios from "axios";
import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Context } from "../App";
import { getCookieValue } from "../utils";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
function ProtectedRoute() {
  const { refresh, setLoader, setData } = useContext(Context);
  const MySwal = withReactContent(Swal);

  const token = getCookieValue('token')
  useEffect(() => {
    if (token) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/dashboard/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setData(response.data)
          setLoader(false);
        })
        .catch((error) => {
          const TokenExpired = (error?.response?.data?.error?.name === "TokenExpiredError")
          if (TokenExpired) {
            MySwal.fire({
              title: <p>Sesión caducada</p>,
              text: "La sesión ha caducado pulse reingresar para iniciar sesión nuevamente.",
              confirmButtonText: "Reingresar",
              preConfirm: () => {
                document.location.reload()
                setLoader(true);
              },
              allowOutsideClick: false,
            });
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            return
          }
          console.log(error);
          document.location.href = "http://" + document.location.host + "/login";
          document.cookie ="token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        });
    } else {
      setLoader(true);
      document.location.href = "http://" + document.location.host + "/login";
      document.cookie ="token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  }, [token, refresh]);

  return <Outlet />;
}

export default ProtectedRoute;
