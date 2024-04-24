import React, { useContext } from "react";
import Link from "./Link/Link";
import styles from "../css/Menu.module.css";
import { Context } from "../../App";
import { useNavigate } from "react-router-dom";
function Menu() {
  const { data, setChangePassActive } = useContext(Context);

  const navigate = useNavigate();

  const SignOut = () => {
    document.location.href = "http://" + document.location.host + "/login";
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  const handleClick = () => {
    setChangePassActive(true);
    navigate(`/${document.location.href.split("/")[3]}`);
  };

  return (
    <div className={styles.menu}>
      <span>{data?.name}</span>
      <Link icon={<i className="fas fa-home"></i>} url="/" text="Dashboard" />
      <Link icon={<i className="fas fa-store"></i>} text="Compra" child={true}>
        <Link
          icon={<i className="fas fa-history"></i>}
          url="/compra"
          text="Historial"
        />
        <Link
          icon={<i className="fas fa-users"></i>}
          url="/proveedores"
          text="Proveedores"
        />
      </Link>
      <Link
        icon={<i className="fas fa-list"></i>}
        text="Inventario"
        child={true}
      >
        <Link
          icon={<i className="fas fa-truck"></i>}
          url="/materia_prima"
          text="Materia Prima"
        />
        <Link
          icon={<i className="fas fa-tractor"></i>}
          url="/maquinaria"
          text="Maquinaria y Equipo"
        />
        <Link
          icon={<i className="fas fa-box"></i>}
          url="/supplies"
          text="Embalaje y Etiquetado"
        />
        <Link
          icon={<i className="fas fa-cogs"></i>}
          url="/product_in_process"
          text="Productos Procesados"
        />
        <Link
          icon={<i className="fas fa-check-double"></i>}
          url="/product_finaliced"
          text="Productos Terminado"
        />
        <Link
          icon={<i className="fas fa-plus-circle"></i>}
          url="/other"
          text="Otros"
        />
      </Link>

      <Link
        child={true}
        icon={<i className="fas fa-user-cog"></i>}
        text="Producción"
      >
        <Link icon={<i className="fab fa-openid"></i>} url="/produccion/deshidratar" text="Deshidratar" />
        <Link icon={<i className="fas fa-wine-bottle"></i>}url="/produccion/envasar" text="Envasar" />
      </Link>
      <Link
        icon={<i className="fas fa-money-bill"></i>}
        child={true}
        text="Ventas"
      >
        <Link icon={<i className="fas fa-history"></i>} url="/ventas" text="Historial" />
        <Link icon={<i className="fas fa-users"></i>} url="/clientes" text="Clientes" />

      </Link>
      <Link
        icon={<i className="far fa-chart-bar"></i>}
        url="/estadistica "
        text="Estadística"
      />
      <Link icon={<i className="fas fa-cog"></i>} text="Ajustes" child={true}>
        {data?.type === "superAdmin" && (
          <>
            <Link
              icon={<i className="fas fa-file"></i>}
              url="/logs"
              text="logs"
            />
            <Link
              icon={<i className="fas fa-users"></i>}
              url="/users"
              text="Usuarios"
            />
          </>
        )}
        <Link
          icon={<i className="fas fa-edit"></i>}
          url={`/${document.location.href.split("/")[3]}`}
          text="Cambiar contraseña"
          onClick={handleClick}
        />
      </Link>

      <Link
        onClick={SignOut}
        icon={<i className="fas fa-sign-out-alt"></i>}
        url="/login "
        text="Cerrar Sesión"
      />
    </div>
  );
}

export default Menu;
