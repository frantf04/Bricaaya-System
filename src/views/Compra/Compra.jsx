import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import Form from "../../components/Form/Form";
import Input from "../../components/Form/Input";
import Table from "../../components/Table";
import Alert from "../../components/Alert";
import { Context } from "../../App";
import { Link } from "react-router-dom";
import { getCookieValue } from "../../utils";
import Swal from "sweetalert2";
import Select from 'react-select'
import moment from "moment";
import withReactContent from "sweetalert2-react-content";
export const PurchaseContext = createContext();


function Compra() {
  const [purchase, setPurchase] = useState([{}]);
  const [rawMaterial, setRawMaterial] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [formActive, setFormActive] = useState(false);
  const { refresh, setRefresh } = useContext(Context);
  const [error, setError] = useState(false);
  const [queryCheck, setQueryCheck] = useState(false);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [formData, setFormData] = useState({
    code: "",
    category: "",
    name: "",
    supplierName: "",
    invoiceNumber: "",
    price: "",
    amount: "",
  });

  const token = getCookieValue("token");

  useEffect(() => {
    if (token) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/dashboard/purchase`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setPurchase(response.data);
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
        .get(`${process.env.REACT_APP_API_URL}/api/dashboard/rawmaterial`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setRawMaterial(response.data);
          setFormData({
            code: "",
            category: "",
            name: "",
            supplierName: "",
            invoiceNumber: "",
            price: "",
            amount: "",
          });
        })
        .catch((error) => {
          console.error("Error de autenticación", error);
          document.location.href =
            "http://" + document.location.host + "/login";
        });

      axios
        .get(`${process.env.REACT_APP_API_URL}/api/dashboard/supplier`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setSupplier(response.data);
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

  const handdleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const newPurchase = (e) => {
    e.preventDefault();
    try {
      if (!token)
        return (document.location.href =
          "http://" + document.location.host + "/login");
      const data = formData;
      axios
        .post(`${process.env.REACT_APP_API_URL}/api/register/purchase`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setRefresh(!refresh);
          setFormActive(false);
          withReactContent(Swal).fire({
            title: "Compra exitosa",
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
              status === 400 ? "Faltan campos requeridos" : message
            }.`,
            icon: "error",
            confirmButtonColor: "#2169f6",
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  const filterByDate = purchase?.filter((obj, index) => {
    const fechaFormateada = moment.utc(obj.createdAt).subtract(4, 'hours').format('YYYY-MM-DDThh:mm:ss.SSSZ')
    return moment(fechaFormateada).isSameOrAfter(`${fechaInicio}T00:00:00.000Z`) && moment(fechaFormateada).isSameOrBefore(`${fechaFin}T23:59:59.000Z`)
  })
  const columnHeadersMapping = {
    code: "Codigo",
    name: "Nombre",
    invoiceNumber: "# Factura",
    price: "Precio",
    amount: "Cantidad",
    supplierName: "Proveedor",
    createdAt: "Fecha de Registro",
  };
  return (
    <>
      <Table
        date={true}
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        setFechaInicio={setFechaInicio}
        setFechaFin={setFechaFin}
        title="Historial de compras"
        columnHeadersMapping={columnHeadersMapping}
        condition={["_id", "category", "updatedAt"]}
        data={(fechaInicio || fechaFin) === ""? purchase: filterByDate}
        onClick={() => setFormActive(true)}
        btnText="Nueva compra"
        columns={columnHeadersMapping}
      />
      {formActive && (
        <Form
          title="Nueva Compra"
          onSubmit={newPurchase}
          setFormActive={setFormActive}
          btnConfirmText="Agregar compra"
        >
          <label htmlFor="code">
            Categoria<i style={{ color: "red" }}>*</i>
          </label>
          <Select name="category" onChange={(target)=> handdleChange('category', target.value)} options={
            [
              {label: 'Materia Prima', value: 'rawmaterial'},
              {label: 'Maquinaria', value: 'machinery'},
              {label: 'Embalaje y Etiquetado', value: 'supplies'},
              {label: 'Otros', value: 'others'}
            ]
          } styles={{
            container: (baseStyle) => ({
              ...baseStyle,
              width: '100%'

            })
          }}/>
          {formData.category === "rawmaterial" ? (
            <>
              <label htmlFor="code">
                Codigo<i style={{ color: "red" }}>*</i>
              </label>
              <Select required name="code" id="code" onChange={(target) => handdleChange("code", target.value)}
                options={rawMaterial.map((product, index) => {
                return {label: `${product.code} - ${product.name}`, value: product.code}
              })} styles={{
                container: (baseStyle) => ({
                  ...baseStyle,
                  width: '100%'
    
                })
              }}/>
            </>
          ) : (
            <>
              <label>
                Codigo<i style={{ color: "red" }}>*</i>
              </label>
              <Input
                required={true}
                placeholder="Codigo"
                name="code"
                value={formData.code}
                onChange={({target})=> handdleChange('code', target.value)}
              />
              <label>
                Nombre <i style={{ color: "red" }}>*</i>
              </label>
              <Input
                required={true}
                placeholder="Nombre"
                name="name"
                onChange={({target})=>handdleChange('name', target.value)}
              />
            </>
          )}
          <label htmlFor="supplier">
            Suplidor<i style={{ color: "red" }}>*</i>{" "}
            <Link to="/proveedores" style={{ color: "#2169f6" }}>
              Agregar nuevo
            </Link>
          </label>
          <Select required name="supplierName" id="supplier" onChange={(target) => handdleChange('supplierName', target.value)}
            options={supplier?.map((item, index) => {
              return {label: item.name, value: item.name}
            })}
            styles={{
              container: (baseStyle) => ({
                ...baseStyle,
                width: '100%'
  
              })
            }}
          />
          
          <label>Factura</label>
          <Input
            placeholder="Numero de Factura"
            onChange={({target})=> handdleChange('invoiceNumber', target.value)}
            name="invoiceNumber"
          />
          <label>
            Precio<i style={{ color: "red" }}>*</i>
          </label>
          <Input
            required={true}
            placeholder="Precio"
            type="number"
            onChange={({target})=> handdleChange('price', target.value)}
            name="price"
          />
          <label>
            Cantidad<i style={{ color: "red" }}>*</i>
          </label>
          <Input
            required={true}
            placeholder="Cantidad"
            type="number"
            onChange={({target})=>  handdleChange('amount', target.value)}
            name="amount"
          />
        </Form>
      )}
      {error && <Alert type="error" text={error} />}
      {queryCheck && <Alert text={queryCheck} />}
    </>
  );
}

export default Compra;
