import React, { useContext, useEffect, useState } from "react";
import Card from "../../components/Card";
import styles from "./Home.module.css";
import GraficosVentas from "../../components/GraficosVentas";
import { Context } from "../../App";

function Home() {
  const {log} = console
  const { data } = useContext(Context);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  useEffect(() => {
    const fechaActual = new Date(); // obtener fecha actual
    const primerDiaDelMes = "1"
    const diaActual = fechaActual.getDate()
    const mesActual = fechaActual.getMonth() + 1
    const añoActual = fechaActual.getFullYear()
    setFechaInicio(`${añoActual}-${mesActual}-${primerDiaDelMes}`)
    setFechaFin(`${añoActual}-${mesActual}-${diaActual}`)
   
  }, []);

  return (
    <div className={styles.home}>
      <h1>Dashboard</h1>
      <div className={styles.card_container}>
        <Card>
          <h3>Materia Prima</h3>
          <p>
            {data?.raw_material?.toLocaleString("es-DO", {
              style: "currency",
              currency: "DOP",
            })}
          </p>
        </Card>
        <Card>
          <h3>Productos Procesados</h3>
          <p>
            {data?.product_on_process?.toLocaleString("es-DO", {
              style: "currency",
              currency: "DOP",
            })}
          </p>
        </Card>
        <Card>
          <h3>Productos Terminados</h3>
          {data.finished_product?.map((product) => {
            return (
              <p key={product.name} className={styles.line}>
                <b>{product.name.toLowerCase()}</b>:{" "}
                {product.money.toLocaleString("es-DO", {
                  style: "currency",
                  currency: "DOP",
                })}
              </p>
            );
          })}
          {data.finished_product && (
            <p className={styles.line}>
              <b>Total:</b>{" "}
              {data.finished_product
                .reduce((total, product) => total + product.money, 0)
                .toLocaleString("es-DO", {
                  style: "currency",
                  currency: "DOP",
                })}
            </p>
          )}
        </Card>
      </div>
      <h2>Graficos (ventas del mes)</h2>
      <GraficosVentas fechaInicio={fechaInicio} fechaFin={fechaFin} />
    </div>
  );
}

export default Home;
