import React from 'react';
import { useEffect, useState} from "react";
import Footer from '../footer';
import Header from './header';
import Ganadores from './ganadores';
import Exactas from './exactas';
import Reversibles from './reversibles';
import Trifectas from './trifectas';
import Jugadas from './jugadas';
import Contador from './contador';
import Tickets from './tickets';
import Viewticket from './viewticket';
import Pagarticket from './pagarticket';
import PrintableArea from '../printableArea.jsx';
import Procesando from "../Procesando.jsx";
import Resumenventa from './resumenventa.jsx'
import MontoApuesta from '../montoApuesta.jsx';
import { evento } from "./js/script.js";
import { use } from 'react';
import { userSignal } from "../../shared/userSignal.jsx"
import { urlApiSignal }  from "../../shared/urlApiSignal.jsx"
import { carreraSignal } from "../../shared/carreraSignal";

import  "./caja.css";

function Caja() {
       
    document.title = "Galgos - Caja";
    

    const [ user, setUser ] = useState(userSignal.value);
    const [ urlApi, setUrlApi ] = useState(urlApiSignal.value);
    const [ carrera, setCarrera ] = useState(carreraSignal.value);
    const [ print, setPrint ] = useState([]);
    const [actualizarTickets, setActualizarTickets] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [jugadas, setJugadas] = useState([]);
    const [pagos, setPagos] = useState([100,500,1000,5000,10000]);
    const [procesando, setProcesando] = useState(false);
    const [idticket, setIdticket] = useState(0);
    const [idticketPagar, setIdticketPagar] = useState(0);
    const[monto, setMonto] = useState("");

    


    const checkUser = () => {
        const usuario = localStorage.getItem("user");
        if (!usuario) {
            window.location.href = "/login";
        }
    };

    const primervalor = ()=>{
        // Cuando el componente se monta, asigna el primer valor de pagos al input monto
        const montoInput = document.getElementById("monto");
        if (montoInput && pagos.length > 0) {
            montoInput.value = pagos[0];
        }
    }



    


    useEffect(() => {
        evento(setCarrera);
        primervalor();
        const jugadasGuardadas = localStorage.getItem("jugadasGalgos");
        if (jugadasGuardadas) {
            setJugadas(JSON.parse(jugadasGuardadas));
        }
    } , []);


    
    


    useEffect(() => {
        localStorage.setItem("jugadasGalgos", JSON.stringify(jugadas));
    }, [jugadas]);

    

    
    const agregarJugada = (codJugada, opcion, logro) => {
        checkUser();
        const montoInput = document.getElementById("monto").value;
    
        // Validar que el monto sea un número positivo
        if (!montoInput || isNaN(montoInput) || Number(montoInput) <= 0) {
            
            swal("Por favor","Ingrese un monto válido mayor a 0.","error");
            return;
        }
        
        
        const monto = Number(montoInput);
        const codigo = codJugada;
    
        // Verificar si la jugada ya existe
        const jugadaExistente = jugadas.find((jugada) => jugada.codigo === codigo);
    
        if (jugadaExistente) {
            // Si la jugada ya existe, sumar el monto
            const jugadasActualizadas = jugadas.map((jugada) =>
                jugada.codigo === codigo
                    ? { ...jugada, monto: jugada.monto + monto }
                    : jugada
            );
            setJugadas(jugadasActualizadas);
        } else {
            // Si no existe, agregar una nueva jugada
            const nuevaJugada = {
                codigo: codigo, // Generar un código único
                logro : logro,                
                monto: monto,
            };
            setJugadas([...jugadas, nuevaJugada]);
        }
    };





    const Procesar = ()=>{
        if (jugadas.length == 0){
            swal("Disculpe","No hay jugadas para procesar", "error")
            //enfocarNum();
        }
        else{
    
            //setBtnPrint(false)
            //let userLocal = JSON.parse(localStorage.getItem("user"));
            let token = "Bearer " + localStorage.getItem("token");
            setProcesando(true);
            
            fetch(urlApi+'/galgos/ticket', {
                method: "POST", // or 'PUT'
                body: JSON.stringify(jugadas), // data can be `string` or {object}!
                headers: {
                  "Accept":"application/json",
                  "Content-Type": "application/json",
                  "Authorization": token
                },
              })
                .then((res) => res.json())                
                .finally(()=> { 
                                setProcesando(false);
                                setActualizarTickets(true);
                        })
                .then((response) => {
                        if (response.success){
                            setPrint(response.ticketPrint);
                            
                            setJugadas([]);
                        }
                        else {
                            
                            swal("Disculpeme",response.message, "error");
                        }
                } )
                .catch((error) => console.log(error));
    
        }
      }
        const consultarTicket = (idticket) => {
            setIdticket(idticket)
        };

        
      

      const anularTicket = (id)=>{
    
                            swal({
                                title: "Seguro desea anular ??",
                                text: '', 
                                icon: "warning",
                                buttons: true,
                                dangerMode: true,
                            })
                            .then((willDelete) => {
                                            if (willDelete) {
                                                setProcesando(true);
                                                let token = "Bearer " + localStorage.getItem("token");                

                                                fetch(urlApi+'/galgos/ticket/'+id, {
                                                    method: "DELETE", // or 'PUT'            
                                                    headers: {
                                                    "Accept":"application/json",
                                                    "Content-Type": "application/json",
                                                    "Authorization": token
                                                    },
                                                }) 
                                                    .then((res) => res.json())
                                                    .catch((error) => console.error("Error:", error))
                                                    .finally(()=>{
                                                                setProcesando(false)
                                                                setActualizarTickets(true);
                                                                })
                                                    .then((response) => {

                                                            if (response.success == true){                        
                                                                //actualizarSaldo();                                                                
                                                            }
                                                            else{
                                                                swal("Error",response.message, "error")
                                                            }
                                                    } );
                                            } 
                                    });
                        }

                        
        const RepetirTicket = (id)=>{
                    //ModalRepetir(); 
                    setProcesando(true);
                    let token = "Bearer " + localStorage.getItem("token");
                    fetch(urlApi+'/galgos/repetirTicket/'+id, {
                                method: "GET", // or 'PUT'            
                                headers: {
                                "Accept":"application/json",
                                "Content-Type": "application/json",
                                "Authorization": token
                                },
                            })
                        .then((res) => res.json())        
                        .finally(()=> {
                                            setProcesando(false);
                                            setActualizarTickets(true);
                                        })    
                        .then((response) => {
                            if (response.success){                                
                                //console.log(response.data)
                                setPrint(response.data);
                            }
                            else {             
                                console.log(response)                                                   
                                swal("Disculpe",response.message, "error");                                                                
                            }
                        } )
                        .catch((error) => errorConexion());
            }
      
  return (
    <>

    <Procesando visible={procesando} />
    <Header />

    
    <div className="principal">

      <div className="row">
            <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                <div className="card">
                    <div className="card-header">Opciones</div>


                    <div className="card-body bodyjugadas">

                        <MontoApuesta monto={monto} setMonto={setMonto}/>                

                        <div className="tab-content mt-3">
                            <div className="tab-pane fade show active" id="ganadores">
                                <h3>Ganadores </h3>
                                <Ganadores carrera={carrera} agregarJugada={agregarJugada}/>
                            </div>
                            <div className="tab-pane fade" id="exactas">
                                <h3>Exactas</h3>
                                <Exactas carrera={carrera} agregarJugada={agregarJugada}/>
                                
                            </div>
                            <div className="tab-pane fade" id="reversibles">
                                <h3>Reversibles</h3>   
                                <Reversibles carrera={carrera} agregarJugada={agregarJugada}/>                             
                            </div>
                            <div className="tab-pane fade" id="trifectas">
                                <h3>Trifectas</h3>
                                <Trifectas carrera={carrera} agregarJugada={agregarJugada}/>                             
                            </div>
                        </div>
                    </div>

                    <div className="card-footer">
                        <ul className="nav nav-pills nav-fill" id="myTabs">
                            <li className="nav-item">
                                <a className="nav-link active" data-bs-toggle="tab" href="#ganadores">Ganadores</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" data-bs-toggle="tab" href="#exactas">Exactas</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" data-bs-toggle="tab" href="#reversibles">Reversibles</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" data-bs-toggle="tab" href="#trifectas">Trifectas</a>
                            </li>                            
                        </ul>
                    </div>
                </div>
            </div>            

            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                <div className="card">
                  <div className="card-header text-center"><Contador carrera={carrera} setCarrera = {setCarrera} setJugadas={setJugadas}/></div>
                  <div className="card-body segundos-sorteo p-0 text-center"></div>
                </div> 
                <div className="card">
                    <div className="card-body div_jugadas" >      
                                
                        <Jugadas jugadas={ jugadas} setJugadas = {setJugadas} />
                    </div>

                    <div className="card-footer d-flex justify-content-between">                                                                           
                        <button type="button" id="btn_imprimir" onClick={ Procesar }  className='btn btn-success col-lg-6'><i className="fa-solid fa-print"></i> Imprimir</button>                  
                    </div>
                </div>
            </div>
        </div>
        <Tickets 
            actualizar={actualizarTickets} 
            consultarTicket = { consultarTicket }
            anularTicket={anularTicket}            
            setIdticketPagar={setIdticketPagar}
            RepetirTicket = { RepetirTicket }

        />
    </div>

    <Viewticket idticket={idticket} setIdticket={setIdticket} setProcesando={setProcesando}/>
    <Pagarticket idticket={idticketPagar} setIdticket={setIdticketPagar} setProcesando={setProcesando} setActualizarTickets={setActualizarTickets}/>
    <PrintableArea print={print} setPrint={setPrint}/>
    <Resumenventa setPrint={setPrint} />
    <Footer/>
    </>
  );
}
export default Caja;