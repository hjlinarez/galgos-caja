import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Footer( ) {

    const navigate = useNavigate();
    const [zoom, setZoom] = useState(localStorage.getItem('zoom') || 1);
    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate("../login"); 
    }
    

    useEffect(()=>{
        let vzoom = localStorage.getItem('zoom');
        vzoom = Math.min(zoom, 2.5);
        vzoom = Math.max(zoom, 0.5); 
        document.body.style.zoom = vzoom;
        localStorage.setItem('zoom', document.body.style.zoom);
        //console.log({ zoom })
        

    },[zoom])

    return (  
             
        <nav className="navbar fixed-bottom navbar-expand-lg bg-body-tertiary ">
        <div className="container-fluid">            
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav w-100 justify-content-between">
                    <li className="nav-item">
                        <button type="button" className="btn btn-sucess" onClick={ ()=> setZoom(Number(zoom) - 0.1) }><i className="fa-solid fa-magnifying-glass-minus"></i></button>
                    </li>
                    <li className="nav-item">
                        <button type="button" className="btn btn-sucess" onClick={ ()=> setZoom(Number(zoom) + 0.1) }><i className="fa-solid fa-magnifying-glass-plus"></i></button>
                    </li>
                    <li className="nav-item d-none ">
                        <a href="/keno" className="btn btn-sucess">Keno</a>                        
                    </li>
                    <li className="nav-item d-none ">
                        <a href="/galgos" className="btn btn-sucess" >Galgos</a>                        
                    </li>
                    <li className="nav-item d-none ">
                        <a href="/Ruleta" className="btn btn-sucess" >Ruleta</a>                        
                    </li>
                    <li className="nav-item d-none">
                        <a href="/Gallos" className="btn btn-sucess" >Gallos</a>                        
                    </li>
                    <li className="nav-item ms-auto">
                        <button type="button" className="btn btn-sucess" onClick={ ()=> logout() }><i className="fa-solid fa-door-open"></i></button>
                    </li>
                </ul>
            </div>
        </div>
        </nav>


    );
}

export default Footer;