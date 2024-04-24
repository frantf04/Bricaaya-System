import React, { useState, useEffect, useContext } from "react";
import Table from "../../../components/Table";
import Alert from "../../../components/Alert";
import axios from "axios";
import Form from "../../../components/Form/Form";
import Input from "../../../components/Form/Input";
import { getCookieValue } from "../../../utils";
import { Context } from '../../../App.js' 
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function FinishesProduct() {
  const token = getCookieValue('token')

  const [formActive, setFormActive] = useState(false);
  const [supplies, setSupplies] = useState([]);
  const [rawMaterial, setRawMaterial] = useState([]);
  const [refresh, setRefresh] = useState(false);
  // Estado para almacenar los valores de los inputs
  const [recipe, setRecipe] = useState([]);
  const [_package, set_package] = useState([]);
  const [error, setError] = useState(false);
  const [queryCheck, setQueryCheck] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    price: "",
  });
  const [finishedProduct, setFinishedProduct] = useState([]);
  const {data} = useContext(Context)

  // Función para manejar cambios en los inputs
  const handleInputRecipeChange = (index, value, code, name) => {
    setRecipe((prevInputValues) => {
      const newInputValues = [...prevInputValues];
      newInputValues[index] = {
        ...newInputValues[index],
        code,
        quanty: value,
        name,
      };
      return newInputValues;
    });
  };
  const handleInputPackageChange = (index, value, code, name) => {
    set_package((prevInputValues) => {
      const newInputValues = [...prevInputValues];
      newInputValues[index] = {
        ...newInputValues[index],
        code,
        quanty: value,
        name,
      };
      return newInputValues;
    });
  };

  const handdleChange = ({ target }) => {
    const name = target.name;
    const value = target.value;

    // Actualizamos el estado solo para el input que ha cambiado
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    if (token) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/dashboard/finishedproduct`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setFinishedProduct(response.data);
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
    } else {
      document.location.href = "http://" + document.location.host + "/login";
    }
  }, [token, refresh]);

  const createFinishedProduct = (e) => {
    e.preventDefault();
    try {
      if (!token)
        return (document.location.href =
          "http://" + document.location.host + "/login");
      const data = {
        code: formData.code,
        name: formData.name,
        price: formData.price,
        recipe,
        _package
      };
      axios
        .post(`${process.env.REACT_APP_API_URL}/api/register/finishedproduct`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setRefresh(!refresh);
          setFormActive(false);
          setFormData({
            code: "",
            name: "",
            price: "",
          });
          withReactContent(Swal).fire({
            title: "Elemento agregado!",
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
              status === 400 ? "Faltan campos requeridos":status===409? "Nombre o Codigo ya registrado" : message

            }.`,
            icon: "error",
            confirmButtonColor: "#2169f6",
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  const columnHeadersMapping = {
    code: "Codigo",
    name: "Nombre",
    price: "Precio de Venta",
    stock: "Stock",
    createdAt: "Fecha de registro",
    updatedAt: "Ultima Modificación",
  };
  return (
    <>
      <Table
        btn={data?.type === 'superAdmin'}
        btnText="Agregar"
        onClick={() => setFormActive(true)}
        condition={["_id", "createdAt", "recipe", "necessary_packaging"]}
        columns={columnHeadersMapping}
        columnHeadersMapping={columnHeadersMapping}
        title="Productos Terminados"
        data={finishedProduct}
      />
      {formActive && (
        <Form
          title="Agregar producto"
          setFormActive={setFormActive}
          onSubmit={createFinishedProduct}
        >
          <Input
            required={true}
            onChange={handdleChange}
            placeholder="Codigo"
            name="code"
          />
          <Input
            required={true}
            onChange={handdleChange}
            placeholder="Nombre"
            name="name"
          />
          <Input
            required={true}
            onChange={handdleChange}
            placeholder="Precio de venta"
            type="number"
            name="price"
          />
          <label htmlFor="">RECETA:</label>
          <div className="recipeContainer" style={styles.recipeContainer}>
            {rawMaterial?.map((obj, index) => (
              <div key={index} className="row" style={styles.row}>
                <label style={{ fontSize: "12px" }} htmlFor="">
                  {obj.name}
                </label>
                <Input
                  value={recipe[index]?.quanty || ""}
                  onChange={(e) =>
                    handleInputRecipeChange(
                      index,
                      e.target.value,
                      obj?.code,
                      obj?.name
                    )
                  }
                  placeholder="Cantidad (LB)"
                  type="number"
                />
              </div>
            ))}
          </div>
          <hr />
          <label htmlFor="">EMBALAJE NECESARIO:</label>
          <div style={styles.recipeContainer}>
            {supplies?.map((obj, index) => (
              <div key={index} className="row" style={styles.row}>
                <label style={{ fontSize: "12px" }} htmlFor="">
                  {obj.name}
                </label>
                <Input
                  value={_package[index]?.quanty || ""}
                  onChange={(e) =>
                    handleInputPackageChange(
                      index,
                      e.target.value,
                      obj?.code,
                      obj?.name
                    )
                  }
                  placeholder="Cantidad (LB)"
                  type="number"
                />
              </div>
            ))}
          </div>
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

export default FinishesProduct;
