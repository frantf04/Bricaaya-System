import React from 'react'
import GraficosVentas from '../../components/GraficosVentas'
import Filter from '../../components/Filter'
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";


function dev() {
  withReactContent(Swal).fire({
    title: "Coming soon!",
    text: 'Este apartado esta en desarrollo!',
    // showConfirmButton: false,
    allowOutsideClick: false
  })
}

function Estadistica() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
      <h1>Coming soon</h1>
      <p>Este apartado esta en desarrollo!</p>
      {/* {dev()} */}
      {/* <GraficosVentas style={{height: "80%", flexWrap: "wrap"}}/> */}
    </div>
  )
}

export default Estadistica