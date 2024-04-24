import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../css/login.css";
import cookie from "js-cookie";
// import ErrorModal from "./ErrorModal";
import Alert from "../../components/Alert";

function Login({idioma}) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(null);
  const [blocked, setBlocked] = useState(null);

  const handleUserChange = ({ target }) => {
    setUser(target.value);
    target.classList.remove("error-border");

  };

  const handlePassChange = ({ target }) => {
    setPass(target.value);
    target.classList.remove("error-border");

  };

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (user === "" || pass === "") {
        setError("Please, complete all fields");
        setTimeout(() => {
          setError(null);
        }, 3000);
        return;
      }
      await axios
        .post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
          user,
          pass,
        })
        .then((res) => {
          // if (res.statusText != "OK") return setBlocked(true);
          const token = res.data.token;
          cookie.set("token", token, {
            secure: true,
            sameSite: "lax",
            expires: new Date(new Date().getTime() + 25 * 60 * 1000),
          });
          document.location.replace('/');
        })
        .catch((err) => {
          if (err?.response?.status === 404 || err?.response?.status === 401 ) {
            e.target.elements["user"].classList.add("error-border");
            e.target.elements["pass"].classList.add("error-border");
            setError("Incorrect credentials");
            setTimeout(() => {
              setError(null);
            }, 3000);
          } else {
            if (!err.response) {
              setError(err?.message + ": Could not establish connection to server");
              setTimeout(() => {
                setError(null);
              }, 3000);
              return
            
            }
            setError(err?.response?.data?.message);
            setTimeout(() => {
              setError(null);
            }, 3000);
          }
        });
    } catch (error) {
     console.log(error);
    }
  };

  return (
    <>
      {error ? <Alert type="error" text={error} /> : null}
      <div className="login__container">
        <form onSubmit={handleSubmit} className="form__login">
          <div className="form__head">
            <h2>Inventario Bricaaya</h2>
          </div>
          <p>Introduce tus credenciales</p>
          <div className="row">
            <input
              required
              onChange={handleUserChange}
              type="text"
              value={user}
              placeholder="Usuario"
              name="user"
            />
          </div>
          <div className="row">
            <input
              required
              onChange={handlePassChange}
              type="password"
              value={pass}
              placeholder="Contraseña"
              name="pass"
            />
          </div>
          <div className="row">
            <button>Iniciar sesión</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
