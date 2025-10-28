import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from 'react';

import Login from './login'
import Keno_old from './components/keno/caja'
import Keno from './components/keno/cajakeno'
import RptTicketKeno from './components/keno/rpt_ticket'
import Galgos from './components/galgos/caja'
import Gallos from './components/gallos/cajagallos.jsx'
import Ruleta from './components/ruleta/cajaruleta.jsx'
import PrivateRoute from './privateroute.jsx'
import Notfound from './notfound'
import { userSignal, tokenSignal } from './shared/userSignal.jsx';
import { urlApiSignal } from "./shared/urlApiSignal.jsx"
import './app.css';

function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    

    
    useEffect(() => {
        
        
        
        const token = localStorage.getItem('token');
        if (token) {
            
            

            fetch(urlApiSignal.value+'/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((res) => res.json())
            .then((response)  => {
                if (response && response.name) {
                    let userlocal = {
                                name:response.name,                             
                                parametros_keno: { 
                                                pagos: response.pagos,
                                                apuesta_minima: response.apuesta_minima,
                                                apuesta_maxima: response.apuesta_maxima,
                                                font: response.font,
                                            }
                                };
                    userSignal.value = userlocal;
                    tokenSignal.value = token;
                    localStorage.setItem('user', JSON.stringify(userlocal));
                    setLoading(false);
                    if (location.pathname === "/login" || location.pathname === "/") {
                        navigate("keno", { replace: true });
                    }
                    
                } else {
                    userSignal.value = {};
                    tokenSignal.value = '';
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    setLoading(false);
                    navigate("/login", { replace: true });
                }
            })
            .catch((error) => {
                 userSignal.value = {};
                tokenSignal.value = '';
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                setLoading(false);
                navigate("/login", { replace: true });
            });
        }
        else{
            
            userSignal.value = {};
            tokenSignal.value = '';
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setLoading(false);
            if (location.pathname !== "/login") {
                navigate("/login", { replace: true });
            }
            
        }
    }, []);



    if (loading) return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            background:"#000000"
        }}>
            <div className="spinner"></div>
        </div>
        );

    return ( 
            <Routes>
                <Route path="/" element={ < Login /> } />
                <Route path="/login" element={ < Login /> } />
                <Route path="/Rptkeno/:id" element={ <PrivateRoute>< RptTicketKeno /></PrivateRoute> } />
                <Route path="/keno" element={<PrivateRoute><Keno /></PrivateRoute>} />
                <Route path="/galgos" element={ <PrivateRoute>< Galgos/></PrivateRoute>} />
                <Route path="/gallos" element={ <PrivateRoute>< Gallos/></PrivateRoute>} />
                <Route path="/ruleta" element={ <PrivateRoute>< Ruleta/></PrivateRoute>} />                        
                <Route path="*" element={ <Notfound/> } /> 
            </Routes>
            );
}
export default App
