import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import { getCookieValue } from "../../utils";
import axios from "axios";
import Form from "../../components/Form/Form";
import Input from "../../components/Form/Input";
import Select from "react-select";
function Users() {
  const token = getCookieValue("token");
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [user, setUser] = useState({});
  const [newUser, setNewUser] = useState({});
  const [isActive, setIsactive] = useState(false);
  const [newUserFormIsActive, setNewUserFormIsActive] = useState(false);

  useEffect(() => {
    try {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/dashboard/users`, {
          headers: {
            Authorization: `Bearer ${token} `,
          },
        })
        .then((res) => {
          if (res.data.length === 0) return;
          setUsers(res?.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }, [token, refresh]);

  const handdleChange = (e, name) => {
    const value = e.target ? e.target.value : e.value; // Verifica si es un evento de input o un valor seleccionado de React-Select
    setUser((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log(name, value);
  };

  const handdleNewUserChange = (e, name) => {
    const value = e.target ? e.target.value : e.value; // Verifica si es un evento de input o un valor seleccionado de React-Select
    setNewUser((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log(name, value);
  };

  const edit = (e) => {
    e.preventDefault()
    try {
      const data = {
        ...user,
      };
      if (token) {
        axios
          .post(`${process.env.REACT_APP_API_URL}/api/edit/user`, data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setIsactive(false)
            setRefresh(!refresh)
          });
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };
  const createNewUser = (e) => {
    e.preventDefault()
    try {
      const data = {
        ...newUser,
      };
      if (token) {
        axios
          .post(`${process.env.REACT_APP_API_URL}/api/register/user`, data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setNewUserFormIsActive(false)
            setRefresh(!refresh)
          });
      } else {
        
      }
    } catch (error) {
      console.log(error);
    }
  }
  const showUser = (id) => {
    const userFound = users.find((user) => user._id === id);
    setUser(userFound);
    console.log(userFound);
  };

  const columnHeadersMapping = {
    name: "Nombre",
    user: "Usuario",
    type: "Permiso",
    status: "Estado",
    createdAt: "Fecha de Registro",
    updatedAt: "Ultima modificación",
  };

  return (
    <>
      <Table
        title="Usuarios"
        data={users}
        action={true}
        btnText="Nuevo usuario"
        onClick={()=> setNewUserFormIsActive(true)}
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
                onClick={(e) => {
                  if (!e.target.classList.contains("fas")) {
                    const id = e.target.parentNode.parentNode.id;
                    showUser(id);
                    setIsactive(true);
                  }
                }}
              >
                Editar <i className="fas fa-edit"></i>
              </span>
            </td>
          </>
        }
        columnHeadersMapping={columnHeadersMapping}
        columns={columnHeadersMapping}
      />

      {isActive && (
        <Form onSubmit={edit} title={"Editar usuario"} setFormActive={setIsactive}>
          <label htmlFor="">Nombre</label>
          <Input
            onChange={(e) => handdleChange(e, "name")}
            value={user?.name}
          />
          <label htmlFor="">Usuario</label>
          <Input
            onChange={(e) => handdleChange(e, "user")}
            value={user?.user}
          />
          <label htmlFor="">Contraseña</label>
          <Input placeholder="Ingrese una nueva contraseña"
            onChange={(e) => handdleChange(e, "pass")}
            
          />
          <label htmlFor="">Estado</label>
          <Select
            onChange={(e) => handdleChange(e, "status")}
            value={{ label: user?.status, value: user?.status }}
            styles={{
              container: (baseStyles) => ({
                ...baseStyles,
                width: "100%",
              }),
            }}
            options={[
              { label: "Bloqueado", value: "blocked" },
              { label: "Activo", value: "active" },
            ]}
          />
          <label htmlFor="">Permiso</label>
          <Select
            onChange={(e) => handdleChange(e, "type")}
            value={{ label: user?.type, value: user?.type }}
            styles={{
              container: (baseStyles) => ({
                ...baseStyles,
                width: "100%",
              }),
            }}
            options={[
              { label: "Admin", value: "admin" },
              { label: "Superadmin", value: "superAdmin" },
            ]}
          />
        </Form>
      )}

      {/* -------------------------------------------------------------------------- */
      /*                                new user form                               */
      /* -------------------------------------------------------------------------- */}
      {newUserFormIsActive && (
        <Form onSubmit={createNewUser} title={"Crear usuario"} setFormActive={setNewUserFormIsActive}>
          <label htmlFor="">Nombre</label>
          <Input
            required={true}
            onChange={(e) => handdleNewUserChange(e, "name")}
            placeholder="Nombre completo"
          />
          <label htmlFor="">Usuario</label>
          <Input
            required={true}
            onChange={(e) => handdleNewUserChange(e, "user")}
            placeholder="Ingrese un usuario"
          />
          <label htmlFor="">Contraseña</label>
          <Input placeholder="Ingrese una contraseña"
            required={true}
            onChange={(e) => handdleNewUserChange(e, "pass")}
            minLength={4}
            
          />
          
          <label htmlFor="">Permiso</label>
          <Select
            required={true}
            onChange={(e) => handdleNewUserChange(e, "role")}
            styles={{
              container: (baseStyles) => ({
                ...baseStyles,
                width: "100%",
              }),
            }}
            options={[
              { label: "Admin", value: "admin" },
              { label: "Superadmin", value: "superAdmin" },
            ]}
          />
        </Form>
      )}
    </>
  );
}

export default Users;
