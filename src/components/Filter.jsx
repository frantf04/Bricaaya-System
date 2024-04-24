import React, { useContext, useEffect, useState } from "react";
import styles from "./css/Filter.module.css"; // Importando estilos del módulo CSS
import { TableContext } from "./Table";
import Select from "react-select";
import moment from "moment";

function Filter({ date, fechaInicio, fechaFin, setFechaInicio, setFechaFin }) {
  const { data, setDataFilter, columns } = useContext(TableContext);
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [up, setUp] = useState(true);

  useEffect(() => {
    const filter = data?.filter((d) => {
      return Object.keys(d).some((key) => {
        // Verifica si la propiedad existe en el objeto y si el valor incluye el término de búsqueda
        return (
          d[key] &&
          d[key].toString().toLowerCase().includes(searchValue.toLowerCase())
        );
      });
    });

    if (sortBy !== "") {
      filter.sort((a, b) => {
        if(!a[sortBy] || !b[sortBy]) return
        if (typeof a[sortBy] === "number" && typeof b[sortBy] === "number") {
          return up ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy];
        } else {
          return up
            ? a[sortBy].localeCompare(b[sortBy])
            : b[sortBy].localeCompare(a[sortBy]);
        }
      });
    }

    setDataFilter(filter);
  }, [data, searchValue, sortBy, up]);

  const setDate = (date) => {
    const dia = new Date().getDate();
    const mes = new Date().getMonth() + 1; // Los meses en JavaScript van de 0 a 11, así que sumamos 1 para obtener el mes correcto.
    const año = new Date().getFullYear();
    const diaFormateado = dia < 10 ? `0${dia}` : dia;
    const mesFormateado = mes < 10 ? `0${mes}` : mes;
    const today = `${año}-${mesFormateado}-${diaFormateado}`;
    const yesterday = `${año}-${mesFormateado}-${diaFormateado - 1}`;
    const inicioDelMes = `${año}-${mesFormateado}-01`;

    switch (date) {
      case "today":
        setFechaInicio(today);
        setFechaFin(today);

        break;
      case "yesterday":
        setFechaInicio(yesterday);
        setFechaFin(yesterday);
        break;
      case "month":
        setFechaInicio(inicioDelMes);
        setFechaFin(today);
        break;
      case "always":
        setFechaInicio("");
        setFechaFin("");
        break;

      default:
        break;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.selectContainer}>
        <span style={{ cursor: "pointer" }} onClick={() => setUp(!up)}>
          {up ? (
            <i className="fas fa-sort-amount-up"></i>
          ) : (
            <i className="fas fa-sort-amount-down"></i>
          )}
        </span>
        <Select
          placeholder="Ordenar por"
          styles={{
            container: (baseStyles) => ({
              ...baseStyles,
              zIndex: "100",
              minWidth: "150px",
              display: "flex",
              justifyContent: "center",
              gap: "5px",
              alignItems: "center",
            }),
            control: (baseStyles) => ({
              ...baseStyles,
              border: "1px solid #ccc",
              width: "100%",
              borderRadius: "6px",
            }),
          }}
          onChange={(target) => setSortBy(target.value)}
          options={Object.keys(columns).map((key) => {
            return { label: columns[key], value: key };
          })}
        />
      </div>
      {date && (
        <div className={styles.dateContainer}>
          <div className={styles.tiltle}>
            Cualquier fecha <i className="fas fa-angle-down"></i>
          </div>
          <div className={styles.box}>
            <div className={styles.date}>
              <div className={styles.row}>
                <span>Desde</span>
                <input
                  value={fechaInicio}
                  type="date"
                  onChange={({ target }) => setFechaInicio(target.value)}
                />
              </div>
              <div className={styles.row}>
                <span>Hasta</span>
                <input
                  value={fechaFin}
                  type="date"
                  onChange={({ target }) => setFechaFin(target.value)}
                />
              </div>
            </div>
            <div className={styles.optionContainer}>
              <div onClick={() => setDate("today")}>Hoy</div>
              <div onClick={() => setDate("yesterday")}>Ayer</div>
              <div onClick={() => setDate("month")}>Este Mes</div>
              <div onClick={() => setDate("always")}>Desde siempre</div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.search}>
        <input
          onChange={({ target }) => setSearchValue(target.value)}
          type="search"
          placeholder="Buscar por referencia"
        />
        <span>
          <i className="fas fa-search"></i>
        </span>
      </div>
    </div>
  );
}

export default Filter;
