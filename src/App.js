import "./App.css";
import Menu from "../src/components/Menu/Menu";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./views/Home/Home";
import Compra from "./views/Compra/Compra";
import MateriaPrima from "./views/Inventario/Materia_prima/MateriaPrima";
// import Procucto_en_proceso from "./views/Inventario/Producto_en_proceso/Procucto_en_proceso";
import ProductoTerminado from "./views/Inventario/Producto_terminado/ProductoTerminado";
import { createContext, useEffect, useState } from "react";
import Login from "./views/Login/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Loader from "./components/Loader";
import Proveedor from "./views/Proveedores/Proveedor";
import Cliente from "./views/clients/Clients";
import Maquinarias from "./views/Inventario/Maquinarias/Maquinarias";
import Embalaje from "./views/Inventario/Embalaje/Embalaje";
import Otros from "./views/Inventario/Otros/Otros";
import ProcessedProduct from "./views/Inventario/Producto_en_proceso/Procucto_en_proceso";
import ProduccionDeshidratar from "./views/Produccion/Deshidratar";
import ProduccionEnvasar from "./views/Produccion/Envasar";
import Users from "./views/users/Users";
import Log from "./views/logs/Log";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Venta from "./views/Ventas/Ventas";
import Estadistica from "./views/Estadistica/Estadistica";
import ChangePass from "./components/ChangePass";
export const Context = createContext();

function App() {
  const [loader, setLoader] = useState(true);
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [counter, setCounter] = useState(0);
  const [changePassActive, setChangePassActive] = useState(false);
  const MySwal = withReactContent(Swal);
  const currentLocation = document.location.href.includes("login");
  
  useEffect(() => {
    const currentLocation = document.location.href.includes("login");
    const interval = setInterval(() => {
      setCounter(counter + 1);
    }, 1000 * 60 * 50);
    if (counter >= 1 && !currentLocation) {
      clearInterval(interval);
      MySwal.fire({
        title: <p>Sesión caducada</p>,
        text: "La sesión ha caducado pulse reingresar para iniciar sesión nuevamente.",
        confirmButtonText: "Reingresar",
        preConfirm: () => {document.location.reload()},
        allowOutsideClick: false,
      });
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  }, [counter]);

  return (
    <Context.Provider
      value={{setChangePassActive, loader, setLoader, data, setData, refresh, setRefresh }}
    >
      <div className="App">
        {!loader ? <Menu /> : null}
        {loader && !currentLocation ? (
                    <div
                      style={{
                        width: "100vw",
                        height: "100vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "absolute",
                        background: "#fff",
                        zIndex: 1000,
                      }}
                      className="loader"
                    >
                      <Loader
                        text={"Loading..."}
                        width="200"
                        color="#2d86c2"
                        secondColor="#999"
                      />
                    </div>
        ) : null}
        {changePassActive && <ChangePass/>}
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/compra" element={<Compra />} />
            <Route path="/materia_prima" element={<MateriaPrima />} />
            <Route path="/product_in_process" element={<ProcessedProduct />} />
            <Route path="/materia_prima" element={<MateriaPrima />} />
            <Route path="/proveedores" element={<Proveedor />} />
            <Route path="/clientes" element={<Cliente />} />
            <Route path="/maquinaria" element={<Maquinarias />} />
            <Route path="/supplies" element={<Embalaje />} />
            <Route path="/ventas" element={<Venta />} />
            <Route path="/other" element={<Otros />} />
            <Route path="/estadistica" element={<Estadistica />} />
            <Route
              path="/produccion/deshidratar"
              element={<ProduccionDeshidratar />}
            />
            <Route path="/produccion/envasar" element={<ProduccionEnvasar />} />
            <Route path="/product_finaliced"
              element={<ProductoTerminado />}
            />
            {data.type === "superAdmin" && (
              <>
                <Route path="/logs" element={<Log />} />
                <Route path="/users" element={<Users />} />
              </>
            )}
            <Route path="/*" element={<Navigate to="/" />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Context.Provider>
  );
}

export default App;
