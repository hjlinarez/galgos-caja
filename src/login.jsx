import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import  "./login.css";
import logo_keskplay from './img/logo_keskplay.png';
import { userSignal, tokenSignal } from "./shared/userSignal.jsx"
import { urlApiSignal } from "./shared/urlApiSignal.jsx"

function login() {
 
  const navigate = useNavigate();
  //const [user, setUser] = useState({})
  let  urlApi = urlApiSignal.value;
  
  

  const validarlogin = () => {
        

        var data = { login: document.getElementById('login').value, password: document.getElementById('password').value };

        fetch(urlApi+'/login', {
        method: "POST", // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: {
            "Accept":"application/json",
            "Content-Type": "application/json",

        },
        })
        .then((res) => res.json())
        
        .then((response) => {
            
            if (response.success){
                

              let userlocal = {
                                "name":response.data.user.name,                             
                                "parametros_keno": { 
                                                "pagos": response.data.user.pagos,
                                                "apuesta_minima": response.data.user.apuesta_minima,
                                                "apuesta_maxima": response.data.user.apuesta_maxima,
                                                "font": response.data.user.font,
                                            }
                                };
                        
                localStorage.setItem('token', response.data.user.jwt);
                //localStorage.setItem('user', JSON.stringify(response.data.user));
                //console.log(response.data.user);
                userSignal.value    = userlocal;
                tokenSignal.value   = localStorage.token;
                navigate("/galgos");
                
                //setUser(local_user);
                
                
                
            }
            else 
            {          
            //swal("Disculpe",response.message,"error");
            setMessage(response.message);
            }
            
            
        } )
        .catch((error) => { swal("Disculpe","Fallo en la conexion","error"); console.error(error);  });

    };



  return (
    
    


            <div style={{
                minHeight: "100vh",
                background: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                
                <form style={{
                  background: "#222",
                  padding: "2rem",
                  borderRadius: "12px",
                  boxShadow: "0 0 16px rgba(0,0,0,0.7)",
                  minWidth: "320px"
                }}>
                  <h2 className="text-white">Caja</h2>
                  <hr />

                  <div className="form-group" style={{ marginBottom: "1rem" }}>
                    <label htmlFor="login" style={{ color: "#fff" }}>Usuario</label>
                    <input type="text" className="form-control" id="login" style={{ background: "#333", color: "#fff", border: "none" }} />
                  </div>
                  <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                    <label htmlFor="password" style={{ color: "#fff" }}>Clave</label>
                    <input type="password" className="form-control" id="password" style={{ background: "#333", color: "#fff", border: "none" }} />
                  </div>
                  <button type="button" onClick={()=>validarlogin()} className="btn btn-success w-100">Ingresar</button>
                </form>
              </div>

        

    
  )
}

export default login