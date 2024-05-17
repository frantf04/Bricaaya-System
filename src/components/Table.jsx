import React, { createContext, useState } from "react";
import Button from "./Button";
import Filter from "./Filter";
import styles from "./css/Table.module.css";
import moment from "moment";
export const TableContext = createContext();
function Table({
  date,
  data = [],
  btnText = "text",
  title = "Title",
  columns = [],
  onClick,
  condition = ["_id"],
  columnHeadersMapping = {},
  btn = true,
  action = false,
  actionElements,
  children,
  fechaInicio,
  fechaFin,
  setFechaInicio,
  setFechaFin,
}) {
  const [dataFilter, setDataFilter] = useState([]);
  const colorsCondition = (product, key) => {
    return {
      green: {
        condition:
          product[key].includes("created") ||
          product[key].includes("added") ||
          product[key].includes("finished") ||
          product[key].includes("made") ||
          product[key].includes("active") ||
          product[key].includes("pagada"),
        background: "#d7f4e8",
        color: "#0a5c3a",
        className: styles.col,
      },
      red: {
        condition:
          product[key].includes("cancel") || product[key].includes("blocked"),
        background: "rgb(255, 226, 224)",
        color: "rgb(204, 62, 51)",

        className: styles.col, // You can define different styles if needed
      },
      orange: {
        condition:
          typeof product[key] === "string" && product[key].includes("started"),
        background: "rgba(200,100,0,.5)",
        color: "rgba(200,100,0,1)",
        className: styles.col, // You can define different styles if needed
      },
    };
  };

  return (
    <TableContext.Provider
      value={{ columnHeadersMapping, columns, data, setDataFilter }}
    >
      <div className={styles.container}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: ".5rem 1rem",
            alignItems: "center",
          }}
        >
          <h1>{title}</h1>
          {btn && <Button text={btnText} onClick={onClick} />}
        </header>
        <Filter
          date={date}
          fechaInicio={fechaInicio}
          fechaFin={fechaFin}
          setFechaInicio={setFechaInicio}
          setFechaFin={setFechaFin}
        />
        {children}
        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                {dataFilter[0] ? (
                  Object.keys(dataFilter[0]).map((header, index) => {
                    if (condition.includes(header)) return null;
                    return (
                      <th key={index} className={styles.col}>
                        {columnHeadersMapping[header] || header}
                      </th>
                    );
                  })
                ) : (
                  <td style={{ textAlign: "center", padding: ".5rem 1rem" }}>
                    No se encontraron datos
                  </td>
                )}
                {action && <th className={styles.col}>{(data.length > 0)? "Acción": null}</th>}
              </tr>
            </thead>
            <tbody>
              {dataFilter.map((product, i) => {
                return (
                  <tr key={i} id={product?._id}>
                    {Object.keys(product).map((key, i) => {
                      if (condition.includes(key)) return null;
                      if (product[key] === "processing")
                        return (
                          <td key={i} className={styles.col}>
                            procesando{" "}
                            <i
                              style={{ color: "orange" }}
                              className={`${styles.spinner} fas fa-spinner`}
                            ></i>
                          </td>
                        );
                      if (product[key] === "finished")
                        return (
                          <td key={i} className={styles.col}>
                            {" "}
                            Terminado{" "}
                            <i
                              style={{ color: "#00bb00" }}
                              className="fas fa-check"
                            ></i>
                          </td>
                        );
                      if (key === "name") {
                        return (
                          <td key={i} className={styles.col}>
                            {product[key].toUpperCase()}
                          </td>
                        );
                      }
                      if (key === "description") {
                        return (
                          <td
                            key={i}
                            className={styles.col}
                            style={{ fontSize: "1rem" }}
                          >
                            {product[key]}
                          </td>
                        );
                      }
                      if (key === "action" || key === "status") {
                        const conditionObject = colorsCondition(product, key);
                        return (
                          <td
                            key={i}
                            className={
                              conditionObject.green.condition
                                ? conditionObject.green.className
                                : conditionObject.red.condition
                                ? conditionObject.red.className
                                : conditionObject.orange.className
                            }
                          >
                            <span
                              style={{
                                fontSize: "1rem",
                                fontWeight: "500",
                                background: conditionObject.green.condition
                                  ? conditionObject.green.background
                                  : conditionObject.red.condition
                                  ? conditionObject.red.background
                                  : conditionObject.orange.background,
                                padding: "2px 3px",
                                borderRadius: "6px",
                                color: conditionObject.green.condition
                                  ? conditionObject.green.color
                                  : conditionObject.red.condition
                                  ? conditionObject.red.color
                                  : conditionObject.orange.color,
                              }}
                            >
                              {product[key]}
                            </span>
                          </td>
                        );
                      }
                      if (key === "createdAt" || key === "updatedAt") {
                        const fechaUTC = new Date(product[key]);
                        return (
                          <td key={i} className={styles.col}>
                            {moment(fechaUTC).format("DD MMM YYYY, hh:mm:ss A")}
                          </td>
                        );
                      }
                      if ((typeof product[key] === "number") && (key !== 'amount' && key !== 'stock' && key !== 'lotNumber' && !key.toLowerCase().includes('quanty'))) {
                        return (
                          <td key={i} className={styles.col}>
                            {product[key].toLocaleString("es-DO", {
                              style: "currency",
                              currency: "DOP",
                            })}
                          </td>
                        );
                      }
                      if (key === "amount" || key === "stock") {
                        return (
                          <td key={i} className={styles.col}>
                            {product[key]}
                          </td>
                        );
                      }
                      return (
                        <td key={i} className={styles.col}>
                          {product[key]}
                        </td>
                      );
                    })}
                    {action && <>{actionElements}</>}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </TableContext.Provider>
  );
}

export default Table;
