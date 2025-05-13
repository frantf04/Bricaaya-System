"use client"

import { useState } from "react"
import axios from "axios"
import "../../css/login.css"
import cookie from "js-cookie"

// Alert component included in the same file to avoid import issues
const Alert = ({ type, text }) => {
  return (
    <div className={`alert alert-${type}`}>
      <p>{text}</p>
    </div>
  )
}

function Login({ idioma }) {
  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleUserChange = ({ target }) => {
    setUser(target.value)
    target.classList.remove("error-border")
  }

  const handlePassChange = ({ target }) => {
    setPass(target.value)
    target.classList.remove("error-border")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (user === "" || pass === "") {
        setError("Por favor, complete todos los campos")
        setTimeout(() => {
          setError(null)
        }, 3000)
        return
      }

      setLoading(true)

      await axios
        .post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
          user,
          pass,
        })
        .then((res) => {
          const token = res.data.token
          cookie.set("token", token, {
            secure: true,
            sameSite: "lax",
            expires: new Date(new Date().getTime() + 25 * 60 * 1000),
          })
          document.location.replace("/")
        })
        .catch((err) => {
          if (err?.response?.status === 404 || err?.response?.status === 401) {
            e.target.elements["user"].classList.add("error-border")
            e.target.elements["pass"].classList.add("error-border")
            setError("Credenciales incorrectas")
            setTimeout(() => {
              setError(null)
            }, 3000)
          } else {
            if (!err.response) {
              setError(err?.message + ": No se pudo establecer conexión con el servidor")
              setTimeout(() => {
                setError(null)
              }, 3000)
              return
            }
            setError(err?.response?.data?.message)
            setTimeout(() => {
              setError(null)
            }, 3000)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <>
      {error ? <Alert type="error" text={error} /> : null}
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>INVENTARIO BRICAAYA</h1>
            <p>Sistema de gestión de inventario</p>
          </div>

          <div className="login-body">
            <h2>Iniciar Sesión</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="user">Usuario</label>
                <div className="input-container">
                  <i className="icon user-icon"></i>
                  <input
                    type="text"
                    id="user"
                    name="user"
                    value={user}
                    onChange={handleUserChange}
                    placeholder="Ingrese su nombre de usuario"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="pass">Contraseña</label>
                <div className="input-container">
                  <i className="icon password-icon"></i>
                  <input
                    type="password"
                    id="pass"
                    name="pass"
                    value={pass}
                    onChange={handlePassChange}
                    placeholder="Ingrese su contraseña"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? "Procesando..." : "Iniciar Sesión"}
              </button>
            </form>

            <div className="login-footer">
              <p>© {new Date().getFullYear()} BRICAAYA. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
