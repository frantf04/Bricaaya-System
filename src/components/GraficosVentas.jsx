import React, { useEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import styles from "./css/Graficos.module.css";
import { getCookieValue } from "../utils";
import axios from "axios";

function GraficosVentas({ style, fechaInicio, fechaFin }) {
  const [data, setData] = useState([]);
  const token = getCookieValue("token");

  useEffect(() => {
    if (token) {
      if(fechaInicio === "" || fechaFin === "") return
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/api/dashboard/graficos`,
          { fechaInicio, fechaFin },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.error("Error de autenticación", error);
          document.location.href =
            "http://" + document.location.host + "/login";
        });
    } else {
      document.location.href = "http://" + document.location.host + "/login";
    }
  }, [fechaInicio, fechaFin, token]);

  useEffect(() => {
    if (data.length > 0) {
      const maxPropsIndex = data.reduce((maxIndex, currentObj, currentIndex) => {
        const propsCount = Object.keys(currentObj).length;
        return propsCount > Object.keys(data[maxIndex]).length ? currentIndex : maxIndex;
      }, 0);


      // Linear Chart
      let barsRoot = am5.Root.new("lineal");
      barsRoot.setThemes([am5themes_Animated.new(barsRoot)]);
      let barsChart = barsRoot.container.children.push(
        am5xy.XYChart.new(barsRoot, {
          panY: false,
          layout: barsRoot.verticalLayout,
        })
      );
      let yAxis = barsChart.yAxes.push(
        am5xy.ValueAxis.new(barsRoot, {
          renderer: am5xy.AxisRendererY.new(barsRoot, {}),
        })
      );
      let xAxis = barsChart.xAxes.push(
        am5xy.CategoryAxis.new(barsRoot, {
          renderer: am5xy.AxisRendererX.new(barsRoot, {}),
          categoryField: "date",
        })
      );
      xAxis.data.setAll(data);
      Object.keys(data[maxPropsIndex]).forEach((key) => {
        if (key !== "date") {
          let serie = barsChart.series.push(
            am5xy.ColumnSeries.new(barsRoot, {
              name: key,
              xAxis: xAxis,
              yAxis: yAxis,
              valueYField: key,
              categoryXField: "date",
              noRisers: true,
            })
          );
          serie.data.setAll(data);
          serie.columns.template.setAll({
            tooltipText: `{name}, {categoryX}: {valueY} DOP`,
            tooltipY: am5.percent(10),
          });
        }
      });
      let legend = barsChart.children.push(am5.Legend.new(barsRoot, {}));
      legend.data.setAll(barsChart.series.values);
      barsChart.set(
        "scrollbarX",
        am5.Scrollbar.new(barsRoot, { orientation: "horizontal" })
      );
      barsChart.set(
        "cursor",
        am5xy.XYCursor.new(barsRoot, {
          behavior: "zoomX",
        })
      );

      // Pie Chart
      let pieData = [];
      Object.keys(data[maxPropsIndex]).forEach((key) => {
        if (key !== "date") {
          let totalProp = data.reduce((acc, obj) => {
            return acc + (obj[key] || 0);
          }, 0);
          pieData.push({
            category: key,
            value: totalProp,
          });
        }
      });
      let rootPie = am5.Root.new("pie");
      let chartPie = rootPie.container.children.push(
        am5percent.PieChart.new(rootPie, {
          layout: rootPie.verticalLayout,
        })
      );
      rootPie.setThemes([am5themes_Animated.new(rootPie)]);
      let seriesPie = chartPie.series.push(
        am5percent.PieSeries.new(rootPie, {
          name: "category",
          valueField: "value",
          categoryField: "category",
        })
      );
      seriesPie.data.setAll(pieData);
      let legendPie = chartPie.children.push(
        am5.Legend.new(rootPie, {
          centerX: am5.percent(50),
          x: am5.percent(50),
          layout: rootPie.horizontalLayout,
        })
      );
      legendPie.data.setAll(seriesPie.dataItems);

      return () => {
        rootPie.dispose();
        barsRoot.dispose();
      };
    }
  }, [data]);

  return (
    <>
      <div style={style} id="chartdiv" className={styles.container}>
        <div id="lineal" className={styles.pie}></div>
        <div id="pie" className={styles.pie}></div>
      </div>
    </>
  );
}

export default GraficosVentas;
