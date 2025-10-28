import React, { useState, useEffect, useRef} from 'react';

import { useNavigate } from "react-router-dom";
import { useReactToPrint } from 'react-to-print';

import ModalBootstrap from "./modalbootstrap.jsx";
import swal from 'sweetalert';
import Header from './header.jsx'
import Footer from '../footer.jsx';
import PrintableArea from '../printableArea.jsx';
import Resumenventa from './resumenventa.jsx'
import MontoApuesta from '../montoApuesta.jsx';
import ViewTicket from './viewticket.jsx'
import PagarTicket from './pagarticket.jsx'
import Procesando from "../Procesando.jsx";
import Jugadas from './jugadas.jsx';
import { evento, fechahoy } from "./js/scripts.js";
import Contador from './contador';
import Tickets from './tickets.jsx';



import { userSignal } from "../../shared/userSignal.jsx"
import { urlApiSignal }  from "../../shared/urlApiSignal.jsx"


import './cajakeno.css'

function Cajakeno() {



    let objetoticket = { 
        idticket: '',
        estatus: '',
        fecha_ticket: '',
        apuestatotal: 0,
        totalpremio:0,
        pagado:0,
        pendiente:0,
        resultado_sorteo:'',
        jugadas:[]
    };
    useEffect(() => {
        document.title = "Keno | Kesk Plays";
    }, []);


    
    
  
    
    


    let JugadasInicial = [];

    if (localStorage.getItem("jugadas")) JugadasInicial   = JSON.parse(localStorage.getItem("jugadas"));
    const[monto, setMonto] = useState("");

    const [jugadas, setJugadas] = useState(JugadasInicial)
    const [pagos, setPagos] = useState([]);
    const [procesando, setProcesando] = useState(false);
    const [montoApuesta, setMontoapuesta] = useState("");

    

    
    const [sorteo, setSorteo] = useState([]);
    
    const [ticketPrint, setTicketPrint] = useState([])
    const [ticketPrintNew, SetTicketPrintNew] = useState(null);

    
    const [myticketConsulta, setMyticketConsulta] = useState(undefined);

    const [ print, setPrint ] = useState([]);
    const [myticket, setMyticket] = useState(objetoticket);
    const [myticketPagar, setMyticketPagar] = useState(objetoticket);


    const [ultimasjugadas, setUltimasjugadas] = useState([]); // CANDIDATO A DESAPARECER

    const [numerosorteo, setNumerosorteo] = useState(0);
    const [cerrandoApuestas, setCerrandoApuestas] = useState(false);
    const [segundosmostrar, setSegundosmostrar] = useState('');
    const [idticketPagar, setIdticketpagar] = useState({ 'idticket': 0, 'serial':0, 'pago_pendiente': 0});
    const [serialPago, setSerialpago] = useState('');
    const [idTicketPrint, setIdTicketPrint] = useState(0)

    
    
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
          content: () => componentRef.current,
        });

    

    const [ user, setUser ] = useState(userSignal.value);
    const [ urlApi, setUrlApi ] = useState(urlApiSignal.value);

    

    

    const [ btnPrint, setBtnPrint] = useState(true)
    const [ btnRepeat, setBtnRepeat] = useState(true)
    const [actualizarTickets, setActualizarTickets] = useState(false);

    const handleActualizarTickets = () => {
        setActualizarTickets(prev => !prev); // Cambia el valor para forzar el update
    };


    //RESUMEN DE VENTA
    const [loadingResumenVenta, setLoadingResumenVenta] = useState(true)
    const [data, setData] = useState([]);
    const [rangofecha, setRangofecha] = useState(fechahoy("ESP")+'-'+fechahoy("ESP"))


    const a = [1,2,3,4,5,6,7,8,9,10];
    const [jugada, setJugada] = useState([]);

    



    const SeleccionarTicket = () => {
        
        let idticket =  myticketConsulta ;
        //setMyticket({idticket:idticket});
        ConsultarTicket(idticket);
    }



    const ConsultarTicket = (idticket) => {
      //const urlApi = 'http://localhost:8000/api';
  
      if (localStorage.getItem("token")) {
        
        
        let ticket =   idticket  ;
        if (isNaN(ticket)) {
          swal("Error", "Numero de ticket invalido", "error");
          return;
        }

        setProcesando(true)
  
        let token = "Bearer " + localStorage.getItem("token");
        
        fetch(urlApi + "/keno/ticket/" + ticket, {
          method: "GET", // or 'PUT'
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token,
          },
        })
          .then((res) => res.json())
          
          .then((response) => {
            if (response.message != "Unauthenticated.") {
              if (response.success) {                
                setMyticket(response.data);
                
              } else {
                swal("Los siento!!!", response.message, "error");
              }
            }
          })
          .finally(()=> setProcesando(false))
          .catch((error) => {
            swal("Error", "Indique el numero del ticket", "error");
          })
          ;
      } else {
        //let userLocal = {'name':'', 'token':''};
        //localStorage.setItem('user', JSON.stringify(userLocal));
        //setUser(JSON.parse(userLocal));
        console.log("NO EXISTE AQUI");
      }
    };
  
    

    const ProcesarJugadas=()=>{
        
        
        
        if (jugadas.length == 0){
            swal("Disculpe","No hay jugadas para procesar", "error")
            enfocarNum();
        }
        else{

            setBtnPrint(false)
            setProcesando(true)
            
            let token = "Bearer " + localStorage.getItem("token");
            
            fetch(urlApi+'/keno/ticket', {
                method: "POST", // or 'PUT'
                body: JSON.stringify(jugadas), // data can be `string` or {object}!
                headers: {
                "Accept":"application/json",
                "Content-Type": "application/json",
                "Authorization": token
                },
            })
                .then((res) => res.json())
                .catch((error) => errorConexion())
                .finally(()=> setProcesando(false))
                .then((response) => {
                    
                    if (response.message == 'Unauthenticated.') {
                        setBtnPrint(true);
                    }
                    else {            
                        if (response.status){
                            
                            //swal("Listo",response.message, "success");
                            borrarTodo();
                            //setTicketPrint(response.ticketPrint)
                            handleActualizarTickets();
                            actualizarSaldo();                        
                            setBtnPrint(true);         
                            ultimasJugadas();                       
                            //SetTicketPrintNew('Rptkeno/'+response.idticket);
                            //setIdTicketPrint(response.idticket)
                            setPrint(response.ticketPrint);
                            //pagoInicio();
                        }
                        else {
                            //console.log(response);
                            //FormLogin();
                            swal("Disculpe",response.message, "error");
                            //errorConexion();
                            setBtnPrint(true);
                        }
                    }
                            
                    //swal("Disculpe","Ticket creado ", "success")
                } );

        }
  }


    



    const agregarCol = (col)=>{setJugada([col,col+10,col+20,col+30,col+40,col+50,col+60,col+70])}
    const agregarRow = (row)=>{setJugada([row*10+1,row*10+2,row*10+3,row*10+4,row*10+5,row*10+6,row*10+7,row*10+8,row*10+9,row*10+10])}
    const limpiar = ()=>{ setJugada([])}
    const borrarTodo = ()=>{ setJugadas([])}

    


    useEffect(()=>{
        evento(setSorteo);        
        setPagos(user.parametros_keno.pagos.split(','));        
    },[])

    


    
    


      useEffect(()=>{
          if (ticketPrint.length > 0){ handlePrint(); }
        },[ticketPrint])


    
    

    const buscarRepetidos = (arr)=> {
        let repetidos = [];
        let conjunto = new Set();
        for (let i = 0; i < arr.length; i++) {
            if (conjunto.has(arr[i])) {
                repetidos.push(arr[i]);
            } else {
                conjunto.add(arr[i]);
            }
        }
        
        return repetidos.length;
    }

    

    const RepetirTicket = (id)=>{

        //ModalRepetir(); 
        setBtnPrint(false);
        setBtnRepeat(false);
        setProcesando(true);
        
        let token = "Bearer " + localStorage.getItem("token");
        
        fetch(urlApi+'/keno/repetirTicket/'+id, {
            method: "GET", // or 'PUT'            
            headers: {
              "Accept":"application/json",
              "Content-Type": "application/json",
              "Authorization": token
            },
          })
            .then((res) => res.json())        
            .finally(()=> setProcesando(false))    
            .then((response) => {
                
                if (response.message == 'Unauthenticated.') {
                    
                    FormLogin();
                    setBtnPrint(true);
                }
                else {            
                    if (response.status){
                        
                        //SetTicketPrintNew('ticket/'+response.idticket);                        
                        //pagoInicio();
                        //handleActualizarTickets();
                        handleActualizarTickets();
                        setBtnPrint(true);     
                        setBtnRepeat(true);
                        //console.log(response);
                        setPrint(response.ticketPrint);
                    }
                    else {
                        //console.log(response);
                        //FormLogin();
                        swal("Disculpe",response.message, "error");
                        //errorConexion();
                        setBtnPrint(true);
                        handleActualizarTickets();
                        setBtnRepeat(true);
                    }
                }
                        
                //swal("Disculpe","Ticket creado ", "success")
            } )
            .catch((error) => errorConexion())
            ;

  }


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

        fetch(urlApi+'/keno/ticket/'+id, {
            method: "DELETE", // or 'PUT'            
            headers: {
              "Accept":"application/json",
              "Content-Type": "application/json",
              "Authorization": token
            },
          }) 
            .then((res) => res.json())
            .catch((error) => console.error("Error:", error))
            .finally(()=>setProcesando(false))
            .then((response) => {
                
                if (response.message == 'Unauthenticated.') 
                {
                    return false;
                }
                else {
                    if (response.success == true){                        
                        //$('#staticAnular').modal('hide');
                        //listAnular();
                        //$("#staticAnular").modal('hide');
                        //ultimasJugadas();                        
                        //handleActualizarTickets();
                        setActualizarTickets(true);
                        actualizarSaldo();
                        //listPagar();
                    }
                    else{
                        swal("Error",response.message, "error")
                    }
                        
                }
                    

                

                
            } );


        
        
      } 
    });

  }


  

  



  const pagarTicket = (idticket)=>{
    
    if (localStorage.getItem("token")){
        setProcesando(true);
        setTimeout(() => {
            
            //verificacion de token
            if (localStorage.getItem("token").length == 0) return;
            let token = "Bearer " + localStorage.getItem("token");      
            let url =  urlApi+'/keno/ticket/'+idticket;
            
            
            fetch(url, {
                method: "GET", // or 'PUT'                     
                headers: {
                "Accept":"application/json",
                "Content-Type": "application/json",
                "Authorization": token
                },
            }) 
                .then((res) => res.json())
                .catch((error) => errorConexion())
                .finally(() => setProcesando(false))
                .then((response) => {
                    if (response.message != 'Unauthenticated.') {
                        if (response.success){     
                            if (response.data.pendiente > 0)
                            {
                                /*setSerialpago(response.data.serial);
                                setIdticketpagar({ 
                                                    'idticket': response.data.idticket, 
                                                    'serial': response.data.serial,
                                                    'premio': response.data.totalpremio,
                                                    'jackpot': response.data.premio_jackpot,
                                                    'pago_pendiente': response.data.pendiente
                                                    
                                                });
                                ModalPagar(); */

                                setMyticketPagar(response.data);



                            }
                            else 
                            {
                                swal("Disculpe","No existe saldo pendiente...", "error")
                            }
                        }
                        else {
                            swal("Error",response.message, "error")
                        }
                    }
                } );
        },0);
    }
    
  }



  


    


    const agregarOpcionIndividual = (tecla, valor) =>{


        if (tecla === 'Enter')
        {     


            if (valor === '.') {
                Procesar();
                enfocarNum();
                return ;
            }


            let arr = valor.split('.');            
            let valores = arr.map(Number);  

            if (buscarRepetidos(arr) > 0)
            {
                swal('Disculpe', 'No pueden haber valore repetidos', 'error');
                return;
            }

            if (arr.length > 10)
            {
                swal('Disculpe', 'Cantidad maxima de valores son de 10', 'error');
                return;
            }


            


            const valores_validos = valores.map(valor => {
                if (typeof valor === 'number') {
                    return valor >= 1 && valor <= 80;
                } else {                                     
                    return false; // O podrías lanzar un error si prefieres                    
                }
            });

            

            if (valores_validos.includes(false))
            {
                swal('Disculpe', 'El valor permito es entre 1 y 80', 'error');
            }
            else
            {
                let new_jugadas = [...jugadas]    
                if (montoApuesta == null || montoApuesta <= 0)   
                {        
                    swal("Disculpe","Monto Invalido!","error");
                    enfocarNum();            
                } 
                else{
                if (valores.length > 0){
                    new_jugadas.push({jugada:valores, monto: montoApuesta })
                    setJugadas(new_jugadas)
                    limpiar();
                    }   
                }
                
            }

   
        }   
        
        
    }


    const shuffle = (arr) =>{
        const length = arr.length  
        for (let i = 0; i < length; i++) {
          const rand_index = Math.floor(Math.random() * length)
          const rand = arr[rand_index]
          arr[rand_index] = arr[i]
          arr[i]          = rand
        }
        return arr;
      }


    const azar = (num) =>{
        const opazar = []
        for (var i = 1; i < 81; i++) { opazar.push(i*1); }    
        let new_opazar = shuffle(opazar);      
        setJugada(new_opazar.slice(0,num)) 
      }


      const agregarJugada = () => {
        let new_jugadas = [...jugadas];
        console.log(montoApuesta);
        if (montoApuesta == null || montoApuesta <= 0) {
            swal("Disculpe", "Monto Invalido!", "error");
            enfocarNum();
        } else {
            if (jugada.length > 0) {
                // Buscar si ya existe una jugada igual
                const idx = new_jugadas.findIndex(
                    (item) =>
                        Array.isArray(item.jugada) &&
                        item.jugada.length === jugada.length &&
                        item.jugada.slice().sort((a, b) => a - b).join(',') === jugada.slice().sort((a, b) => a - b).join(',')
                );
                if (idx !== -1) {
                    // Si existe, suma el monto
                    new_jugadas[idx].monto = Number(new_jugadas[idx].monto) + Number(montoApuesta);
                } else {
                    // Si no existe, agrega la jugada
                    new_jugadas.push({ jugada: jugada, monto: montoApuesta });
                }
                setJugadas(new_jugadas);
                limpiar();
            }
        }
    };


      const agregarOpcion = (num)=>{    

        if (jugada.includes(num)){        
            let new_jugada = [...jugada]
            new_jugada.splice(new_jugada.findIndex((element) => element == num),1)
            setJugada(new_jugada)          
        }
        else{
            let new_jugada = [...jugada]
            if (new_jugada.length < 10){
                new_jugada.push(num)    
                setJugada(new_jugada)            
            }else {
                
                swal("Disculpe","El maximo numero de opciones son 10","error");
            }        
        }
        enfocarNum();
    
      }


      const enfocarNum = () => {
        document.querySelector("#opcionindividual").value = '';
        document.querySelector("#opcionindividual").focus();        
        }




    const actualizarSaldo =()=>{
            

        if (localStorage.getItem("token")){
            
            let token = "Bearer " + localStorage.getItem("token");
            
            fetch(urlApi+'/saldouser', {
                method: "POST", // or 'PUT'
                body: JSON.stringify(), // data can be `string` or {object}!
                headers: {
                "Accept":"application/json",
                "Content-Type": "application/json",
                "Authorization": token
                },
            })
                .then((res) => res.json())
                .catch((error) => console.error("Error:", error))
                .then((response) => {
                    
                    if (response.message == 'Unauthenticated.') {
                        //return false;
                    }
                    else {
                        //setUserSaldo({moneda: response.data.idmoneda, monto: response.data.saldo})
                    }
                    
                } );
        
            
        }
        else{
            //setUserSaldo({moneda:'', monto: 0})
        }    
            
    }

    const ultimasJugadas = ()=>{

        if (localStorage.getItem("token")){
                
                if (localStorage.getItem("token").length == 0) return;

                let token = "Bearer " + localStorage.getItem("token");      
                let url =  urlApi+'/keno/ultimostickets';
                
                fetch(url, {
                    method: "GET", // or 'PUT'                     
                    headers: {
                    "Accept":"application/json",
                    "Content-Type": "application/json",
                    "Authorization": token
                    },
                }) 
                    .then((res) => res.json())
                    .catch((error) => errorConexion())
                    .then((response) => {                        
                        if (response.message != 'Unauthenticated.') {                            
                            if (response.success){                                
                                setUltimasjugadas(response.data)    
                            }
                            else {
    
                            }
                        }
                    } );            
        }else{
            setUltimasjugadas([]) 
        }

    }

    


    const columnas = a.map(valor => <button key={'btncol_'+valor} id={'btncol_'+valor} type="button" onClick={()=>agregarCol(valor)}   className="btn col btn-lg btn-primary m-1"><i className="fa-sharp-duotone fa-solid fa-arrow-down"></i></button>);
    const linea1 = a.map(valor => <button key={'btn_'+valor<10?'0'+valor:valor} id={'btn_'+valor<10?'0'+valor:valor} type="button" onClick={()=>agregarOpcion(valor)} className={jugada.includes(parseInt(valor))? "btn col btn-lg btn-success m-1" : "btn col btn-lg btn-default m-1"}> {valor<10?'0'+valor:valor} </button>);
    const linea2 = a.map(valor => <button key={'btn_'+parseInt(10+valor)} id={'btn_'+parseInt(10+valor)} type="button" onClick={()=>agregarOpcion(10+valor)} className={jugada.includes(parseInt(10+valor))? "btn col btn-lg btn-success m-1" : "btn col btn-lg btn-default m-1"}> {10+valor} </button>);
    const linea3 = a.map(valor => <button key={'btn_'+parseInt(20+valor)} id={'btn_'+parseInt(20+valor)} type="button" onClick={()=>agregarOpcion(20+valor)} className={jugada.includes(parseInt(20+valor))? "btn col btn-lg btn-success m-1" : "btn col btn-lg btn-default m-1"}> {20+valor} </button>);
    const linea4 = a.map(valor => <button key={'btn_'+parseInt(30+valor)} id={'btn_'+parseInt(30+valor)} type="button" onClick={()=>agregarOpcion(30+valor)} className={jugada.includes(parseInt(30+valor))? "btn col btn-lg btn-success m-1" : "btn col btn-lg btn-default m-1"}> {30+valor} </button>);
    const linea5 = a.map(valor => <button key={'btn_'+parseInt(40+valor)} id={'btn_'+parseInt(40+valor)} type="button" onClick={()=>agregarOpcion(40+valor)} className={jugada.includes(parseInt(40+valor))? "btn col btn-lg btn-success m-1" : "btn col btn-lg btn-default m-1"}> {40+valor} </button>);
    const linea6 = a.map(valor => <button key={'btn_'+parseInt(50+valor)} id={'btn_'+parseInt(50+valor)} type="button" onClick={()=>agregarOpcion(50+valor)} className={jugada.includes(parseInt(50+valor))? "btn col btn-lg btn-success m-1" : "btn col btn-lg btn-default m-1"}> {50+valor} </button>);
    const linea7 = a.map(valor => <button key={'btn_'+parseInt(60+valor)} id={'btn_'+parseInt(60+valor)} type="button" onClick={()=>agregarOpcion(60+valor)} className={jugada.includes(parseInt(60+valor))? "btn col btn-lg btn-success m-1" : "btn col btn-lg btn-default m-1"}> {60+valor} </button>);
    const linea8 = a.map(valor => <button key={'btn_'+parseInt(70+valor)} id={'btn_'+parseInt(70+valor)} type="button" onClick={()=>agregarOpcion(70+valor)} className={jugada.includes(parseInt(70+valor))? "btn col btn-lg btn-success m-1" : "btn col btn-lg btn-default m-1"}> {70+valor} </button>);


    

    return (  
        <>

        <div ref={ componentRef } className="WMmessage">
            {
                ticketPrint.map((valor, index)=>{
                    return (
                            <p className="lineaticket" key={ index }>{valor.linea}</p>
                    )
                })
            }
       </div>

        <Procesando visible={procesando} />
        

        


            <Header 
                myticketConsulta = {myticketConsulta} 
                setMyticketConsulta = {setMyticketConsulta}
                SeleccionarTicket = {SeleccionarTicket}
            />
            
            
            <div className="body-keno container-fluid">


               
      



      

        <div className="row mt-1">
            <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
            <div className="card">
                <div className="card-header">Opciones</div>
                <div className="car-body div_marcaje ">
                    

                    <div className="row m-2">
                        <div className="col w-100">
                            <MontoApuesta monto={montoApuesta} setMonto={setMontoapuesta}/>                                        
                        </div>
                    </div>
                    
                    <div className="m-3 bg-primary p-0">
                        
                        <div className="linea">{ columnas } <button type="button" className="btn col btn-lg btn-primary m-1 disabled"></button> </div>
                        <div className="linea">{ linea1 } <button type="button" onClick={()=>agregarRow(0)} className="btn col btn-lg btn-primary m-1"><i className="fa-sharp-duotone fa-solid fa-arrow-left"></i></button></div>
                        <div className="linea">{ linea2 } <button type="button" onClick={()=>agregarRow(1)} className="btn col btn-lg btn-primary m-1"><i className="fa-sharp-duotone fa-solid fa-arrow-left"></i></button></div>
                        <div className="linea">{ linea3 } <button type="button" onClick={()=>agregarRow(2)} className="btn col btn-lg btn-primary m-1"><i className="fa-sharp-duotone fa-solid fa-arrow-left"></i></button></div>
                        <div className="linea">{ linea4 } <button type="button" onClick={()=>agregarRow(3)} className="btn col btn-lg btn-primary m-1"><i className="fa-sharp-duotone fa-solid fa-arrow-left"></i></button></div>
                        <div className="linea">{ linea5 } <button type="button" onClick={()=>agregarRow(4)} className="btn col btn-lg btn-primary m-1"><i className="fa-sharp-duotone fa-solid fa-arrow-left"></i></button></div>
                        <div className="linea">{ linea6 } <button type="button" onClick={()=>agregarRow(5)} className="btn col btn-lg btn-primary m-1"><i className="fa-sharp-duotone fa-solid fa-arrow-left"></i></button></div>
                        <div className="linea">{ linea7 } <button type="button" onClick={()=>agregarRow(6)} className="btn col btn-lg btn-primary m-1"><i className="fa-sharp-duotone fa-solid fa-arrow-left"></i></button></div>
                        <div className="linea">{ linea8 } <button type="button" onClick={()=>agregarRow(7)} className="btn col btn-lg btn-primary m-1"><i className="fa-sharp-duotone fa-solid fa-arrow-left"></i></button></div>
                    </div>
                </div>




                <div className="card-footer">

                    

                            <div className="row mb-1">
                                    <div className="col col-lg-8 col-md-8 col-sm-8 col-xs-8">
                                        <div className="btn-group w-100" role="group" aria-label="Basic example">
                                            <button type="button" onClick={()=>azar(1)}   className="btn btn-primary"><span className="badge text-bg-light">1</span></button>
                                            <button type="button" onClick={()=>azar(2)}   className="btn btn-primary"><span className="badge text-bg-light">2</span></button>
                                            <button type="button" onClick={()=>azar(3)}   className="btn btn-primary"><span className="badge text-bg-light">3</span></button>
                                            <button type="button" onClick={()=>azar(4)}   className="btn btn-primary"><span className="badge text-bg-light">4</span></button>
                                            <button type="button" onClick={()=>azar(5)}   className="btn btn-primary"><span className="badge text-bg-light">5</span></button>                                        
                                            <button type="button" onClick={()=>azar(6)}   className="btn btn-primary"><span className="badge text-bg-light">6</span></button>
                                            <button type="button" onClick={()=>azar(7)}   className="btn btn-primary"><span className="badge text-bg-light">7</span></button>
                                            <button type="button" onClick={()=>azar(8)}   className="btn btn-primary"><span className="badge text-bg-light">8</span></button>
                                            <button type="button" onClick={()=>azar(9)}   className="btn btn-primary"><span className="badge text-bg-light">9</span></button>
                                            <button type="button" onClick={()=>azar(10)}  className="btn btn-primary"><span className="badge text-bg-light">10</span></button>
                                            <button type="button" onClick={()=>limpiar()} className="btn btn-danger"><i className="fa-solid fa-xmark"></i></button>
                                        </div>
                                    </div>
                                    <div className="col">
                                        
                                        <input type="text" className="form-control text-center mb-1" id="opcionindividual"  placeholder="Opcion" onKeyUp={ e => agregarOpcionIndividual(e.key, e.target.value)}  />                      
                                        <button className="btn btn-success btn-block" type="button" onClick={()=>agregarJugada()}> <i className="fa-solid fa-plus"></i> </button>

                                    </div>
                                
                            </div>


                            <div className="row">

                                <div className="col">

                                    
                                    
                                        
                                    

                                    

                                </div>

                                <div className="col">                                   
                                    
                                </div>


                            </div>
                            
                </div>






            </div>
            </div>


            
            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                <div className="card mb-1">
                  <div className="card-header text-center"><Contador sorteo={sorteo} setSorteo = {setSorteo} setJugadas={setJugadas}/></div>
                    <div className="card-body div_jugadas" >      
                        <Jugadas jugadas={ jugadas } setJugadas = { setJugadas }/>
                    </div>
                    <div className="card-footer">                                                   
                        
                        <button type="button" onClick={ ProcesarJugadas } className={ btnPrint ? 'btn btn-success col-lg-6' : 'btn  btn-success col-lg-6 disabled' } ><i className="fa-solid fa-print"></i> Imprimir</button>
                    </div>
                </div>
            </div>
        </div>
        <Tickets 
            ConsultarTicket = {ConsultarTicket} 
            anularTicket = {anularTicket} 
            pagarTicket = {pagarTicket} 
            RepetirTicket = {RepetirTicket} 
            btnRepeat = { btnRepeat }
            actualizar={actualizarTickets}
            
        />
        </div>


        <iframe src={ ticketPrintNew } className="ticketPrint" style={{ height:0  }}></iframe>
        
        <ViewTicket myticket={ myticket } setMyticket={ setMyticket }/>

        <PagarTicket 
            myticket={ myticketPagar } 
            setMyticket={ setMyticketPagar } 
            setProcesando = {setProcesando} 
            setActualizarTickets = {setActualizarTickets}
        />

        <Resumenventa setPrint={setPrint} />
        <PrintableArea print={print} setPrint={setPrint}/>
        <Footer />
        </>
    );
}

export default Cajakeno;