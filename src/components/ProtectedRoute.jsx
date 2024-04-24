import axios from "axios";
import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Context } from "../App";
import { getCookieValue } from "../utils";
function ProtectedRoute() {
  const {refresh,setLoader, setData} = useContext(Context);
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
          // if (error?.response?.data?.error.name === "TokenExpiredError");
          setLoader(true);
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
