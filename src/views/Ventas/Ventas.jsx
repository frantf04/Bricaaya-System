import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import Form from "../../components/Form/Form";
import Input from "../../components/Form/Input";
import Table from "../../components/Table";
import { Context } from "../../App";
import { Link } from "react-router-dom";
import { getCookieValue } from "../../utils";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import "../../css/Venta.css";
import logo from "../../assets/img/logo_bricaaya.png";
import moment from "moment";
import Button from "../../components/Button";
export const PurchaseContext = createContext();
const animatedComponents = makeAnimated();
function Venta() {
  const [sales, setSales] = useState([{}]);
  const [finishedProducts, setFinishedProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [formActive, setFormActive] = useState(false);
  const { refresh, setRefresh } = useContext(Context);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [client, setClient] = useState("");
  const [status, setStatus] = useState("");
  const [payMethod, setPayMethod] = useState("");
  const [bill, setBill] = useState([]);
  const [showbill, setShowBill] = useState(false);
  const [showAbonarForm, setShowAbonarForm] = useState(false);
  const [deudas, setDeudas] = useState(false);

  const token = getCookieValue("token");

  useEffect(() => {
    if (token) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/dashboard/sales`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setSales(response.data);
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
        .get(`${process.env.REACT_APP_API_URL}/api/dashboard/finishedproduct`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setFinishedProducts(response.data);
        })
        .catch((error) => {
          console.error("Error de autenticación", error);
          document.location.href =
            "http://" + document.location.host + "/login";
        });

      axios
        .get(`${process.env.REACT_APP_API_URL}/api/dashboard/clients`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setClients(response.data);
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

  const createBill = (id) => {
    const billfoundIndex = sales?.findIndex((bill) => bill._id == id);
    if (billfoundIndex < 0) return;
    setBill(sales[billfoundIndex]);
    setShowBill(true);
  };

  const handleInputProductsChange = (index, value, code, name, price) => {
    setSelectedProducts((prevInputValues) => {
      const newInputValues = [...prevInputValues];
      newInputValues[index] = {
        ...newInputValues[index],
        code,
        name,
        quanty: value,
        price,
      };
      return newInputValues;
    });
  };

  const newSale = (e) => {
    e.preventDefault();

    try {
      if (products.length === 0) {
        setSelectedProducts([]);
        withReactContent(Swal).fire({
          title: `Faltan campos requeridos.`,
          icon: "error",
          confirmButtonColor: "#2169f6",
        });
        return;
      }
      if (!token)
        return (document.location.href =
          "http://" + document.location.host + "/login");
      const data = {
        clientName: client,
        payMethod: payMethod !== "" ? payMethod : "deuda",
        products: selectedProducts,
        status,
      };
      axios
        .post(`${process.env.REACT_APP_API_URL}/api/register/sale`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setRefresh(!refresh);
          setFormActive(false);
          setClient("");
          setPayMethod("");
          setProducts([]);
          setSelectedProducts([]);
          withReactContent(Swal).fire({
            title:
              status === "pagada" ? "Venta registrada!" : "Deuda registrada",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        })
        .catch((err) => {
          const statusCode = err?.response?.status;
          const message = err?.response?.data?.message;
          const el = err.response?.data?.productosFaltante?.map(
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
              statusCode === 409
                ? "Material insuficiente,falta lo siguiente:"
                : statusCode === 400
                ? "Faltan campos requeridos!"
                : message,
            html: <ol>{el}</ol>,
            scrollbarPadding: "1px",
            icon: "error",
            confirmButtonColor: "#2169f6",
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  const pay = (e) => {
    try {
      const amount = e.target?.elements['amount'].value
      const paymethod = e.target?.elements['paymethod'].value
      const data = {
        id: bill._id,
        amount,
        payMethod: paymethod
      }
      if (token) {
        axios.post(`${process.env.REACT_APP_API_URL}/api/edit/pay`, data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).then(res => {
          setShowAbonarForm(false)
          setRefresh(!refresh)
          withReactContent(Swal).fire({
            title: "Se registró el pago.",
            timer: 1500,
            showConfirmButton: false,
            icon: 'success'
          })
        }).catch(err => {
          withReactContent(Swal).fire({
            title: `${err.response?.data?.message}`,
            icon: 'error'
          })
        })
      }
    } catch (error) {
      
    }
  }
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "print",
    pageStyle: `
     margin: 0;
    `,
  });
  const productsOption = finishedProducts.map((product, index) => {
    return { value: product.code, label: product.name, price: product.price };
  });
  const clientsOption = clients.map((client, index) => {
    return { value: client.name, label: client.name };
  });

  const columnHeadersMappingIncome = {
    _id: "ID de factura",
    clientName: "Cliente",
    status: "Estado",
    total: "Valor",
    payMethod: "Medio de pago",
    createdAt: "Fecha de Registro",
  };
  const columnHeadersMappingDebt = {
    _id: "ID de factura",
    clientName: "Cliente",
    status: "Estado",
    total: "Valor",
    debt: "por cobrar",
    payMethod: "Medio de pago",
    createdAt: "Fecha de Registro",
  };

  const Deudas = sales?.filter((sale) => sale.payMethod === "deuda");
  const Ingresos = sales?.filter((sale) => {
    return sale.payMethod !== "deuda";
  });
  Ingresos.map((el) => delete el.debt);

  return (
    <>
      <Table
        title="Historial de ventas"
        columnHeadersMapping={deudas? columnHeadersMappingDebt: columnHeadersMappingIncome}
        condition={["category", "updatedAt", "products"]}
        data={deudas ? Deudas : Ingresos}
        onClick={() => {
          setClient("");
          setPayMethod("");
          setProducts([]);
          setSelectedProducts([]);
          setFormActive(true);
        }}
        btnText="Nueva venta"
        columns={deudas? columnHeadersMappingDebt: columnHeadersMappingIncome}
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
                  background: "#2169f6",
                  padding: "0.5rem",
                  borderRadius: "6px",
                }}
                onClick={async (e) => {
                  const id = e.target.parentNode.parentNode.id;
                  createBill(id);
                }}
              >
                Detalle
              </span>
            </td>
          </>
        }
      >
        <div className="changeDataControls">
          <span
            className="active"
            onClick={(e) => {
              const parent = e.target.parentNode;
              if (parent.contains(e.target)) {
                if (parent && parent.children && parent.children.length > 0) {
                  Array.from(parent.children).forEach((el) => {
                    el.classList.remove("active");
                  });
                }
                e.target.classList.add("active");
                setDeudas(false);
              }
            }}
          >
            Ingresos ({" "}
            {Ingresos.reduce((total, value) => {
              return (total += value.total);
            }, 0).toLocaleString("es-DO", {
              style: "currency",
              currency: "DOP",
            })}{" "}
            )
          </span>

          <span
            onClick={(e) => {
              e.stopPropagation();
              const parent = e.target.parentNode;
              if (parent && parent.children && parent.children.length > 0) {
                Array.from(parent.children).forEach((el) => {
                  el.classList.remove("active");
                });
              }
              e.target.classList.add("active");
              setDeudas(true);
            }}
          >
            Deudas ({" "}
            {Deudas.reduce((total, value) => {
              return (total += value.total);
            }, 0).toLocaleString("es-DO", {
              style: "currency",
              currency: "DOP",
            })}{" "}
            )
          </span>
        </div>
      </Table>
      {formActive && (
        <Form
          style={{ overflow: "visible" }}
          title="Nueva Venta"
          onSubmit={newSale}
          setFormActive={setFormActive}
          btnConfirmText="Registrar venta"
        >
          <>
            <label htmlFor="code">
              Productos a vender<i style={{ color: "red" }}>*</i>
            </label>
            <Select
              required
              onChange={(value) => {
                setProducts(value);
              }}
              placeholder="Selecciona los productos"
              components={animatedComponents}
              options={productsOption}
              styles={{
                container: (baseStyles) => ({
                  ...baseStyles,
                  width: "100%",
                }),
              }}
              isMulti
            />
          </>

          <div className="recipeContainer" style={styles.recipeContainer}>
            {products?.map((obj, index) => (
              <div key={index} className="row" style={styles.row}>
                <label style={{ fontSize: "12px" }} htmlFor="">
                  {obj.label}
                </label>
                <Input
                  min={1}
                  required={true}
                  value={selectedProducts[index]?.quanty || ""}
                  onChange={(e) =>
                    handleInputProductsChange(
                      index,
                      Number(e.target.value),
                      obj?.value,
                      obj?.label,
                      Number(obj?.price)
                    )
                  }
                  placeholder="Unidad"
                  type="number"
                />
              </div>
            ))}
          </div>
          <label htmlFor="client">
            cliente<i style={{ color: "red" }}>*</i>{" "}
            <Link to="/clientes" style={{ color: "#2169f6" }}>
              Agregar nuevo
            </Link>
          </label>
          <Select
            required
            options={clientsOption}
            placeholder="Selecciona el cliente"
            onChange={(target) => setClient(target.value)}
            styles={{
              container: (baseStyles) => ({
                ...baseStyles,
                width: "100%",
              }),
            }}
          />
          <label htmlFor="">
            Estado<i style={{ color: "red" }}>*</i>
          </label>
          <Select
            required
            options={[
              { label: "Pagada", value: "pagada" },
              { label: "A credito", value: "pendiente" },
            ]}
            placeholder="Selecciona el estado"
            onChange={(target) => setStatus(target.value)}
            styles={{
              container: (baseStyles) => ({
                ...baseStyles,
                width: "100%",
              }),
            }}
          />

          {status === "pagada" && (
            <>
              <label htmlFor="">
                Metodo de pago<i style={{ color: "red" }}>*</i>
              </label>
              <Select
                required
                placeholder="Indica el tipo de pago"
                styles={{
                  container: (baseStyles) => ({
                    ...baseStyles,
                    width: "100%",
                  }),
                }}
                options={[
                  { label: "Tarjeta", value: "tarjeta" },
                  { label: "Transferencia", value: "transferencia" },
                  { label: "Efectivo", value: "Efectivo" },
                  { label: "Otro", value: "otro" },
                ]}
                onChange={(value) => setPayMethod(value.value)}
              />
            </>
          )}
        </Form>
      )}
      {showbill && (
        <div className="billContainer">
          <div className="bill" ref={componentRef}>
            <div className="header"></div>
            <div className="row company">
              <span>Bricaaya</span>
            </div>
            <div className="row">
              <div className="clientName">
                <b>Cliente</b> <br /> {bill?.clientName}{" "}
              </div>
              <div className="id">
                <b>
                  ID de Factura <br />
                </b>{" "}
                <span>{bill._id}</span>
              </div>
            </div>

            <div className="row">
              <b>Fecha:</b>
              <div className="date">
                {moment(
                  new Date(bill.createdAt).setHours(
                    new Date(bill.createdAt).getHours() - 4
                  )
                ).format("DD/MM/YYYY")}
              </div>
            </div>
            <div className="row">
              <b>Medio de pago</b>

              <span>{bill.payMethod}</span>
            </div>
            <div className="row">
              <b>Estado:</b>
              <div className="">{bill.status}</div>
            </div>
            <div className="row th">
              <span>Descripción</span>
              <span className="quanty">cantidad</span>
              <span className="price">Precio unitario</span>
              <span className="value">valor</span>
            </div>
            <div className="productsDetails">
              {bill.products.map((product, index) => {
                return (
                  <div key={index} className="row">
                    <span>{product.name}</span>
                    <span className="quanty">{product.quanty}</span>
                    <span className="price">
                      {product.price.toLocaleString("es-DO", {
                        style: "currency",
                        currency: "DOP",
                      })}
                    </span>
                    <span className="value">
                      {(product.price * product.quanty).toLocaleString(
                        "es-DO",
                        {
                          style: "currency",
                          currency: "DOP",
                        }
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="row th total">
              <span>Total</span>
              <span>
                {bill.total.toLocaleString("es-DO", {
                  style: "currency",
                  currency: "DOP",
                })}
              </span>
            </div>
          </div>
          <div className="controlContainer">
            <div>
              {bill.payMethod === "deuda" && (
                <Button
                  text="Abonar"
                  onClick={() => {
                    setShowBill(false);
                    setShowAbonarForm(true);
                  }}
                />
              )}
            </div>
            <div>
              <Button text="Cancelar" onClick={() => setShowBill(false)} />
              <Button text="Comprobante" onClick={handlePrint} />
            </div>
          </div>
        </div>
      )}
      {showAbonarForm && (
        <Form
          style={{ overflow: "visible" }}
          title="Abonar a la deuda"
          setFormActive={setShowAbonarForm}
          onSubmit={(e) => {
            e.preventDefault();
            pay(e)
          }}
        >
          <Input
            type="number"
            name="amount"
            placeholder="Cantidad a abonar"
            required={true}
          />

          <label htmlFor="">
            Metodo de pago<i style={{ color: "red" }}>*</i>
          </label>
          <Select
            name="paymethod"
            required
            placeholder="Indica el medio de pago"
            styles={{
              container: (baseStyles) => ({
                ...baseStyles,
                width: "100%",
              }),
            }}
            options={[
              { label: "Tarjeta", value: "tarjeta" },
              { label: "Transferencia", value: "transferencia" },
              { label: "Efectivo", value: "Efectivo" },
              { label: "Otro", value: "otro" },
            ]}
            onChange={(value) => setPayMethod(value.value)}
          />
        </Form>
      )}
    </>
  );
}
const styles = {
  recipeContainer: {
    width: "100%",
    display: "flex",
    gap: "5px",
    flexWrap: "wrap",
  },
  row: {
    width: "calc((100% - 15px ) / 3)",
    display: "flex",
    gap: "5px",
    flexDirection: "column",
  },
};
export default Venta;
