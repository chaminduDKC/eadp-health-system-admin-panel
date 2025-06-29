import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import {ThemeProvider} from "./context/themeContext.jsx";
import keycloak from './utils/keycloak.js'



keycloak.init({ onLoad: 'login-required', checkLoginIframe: false })
    .then((authenticated) => {
        if (authenticated) {
            localStorage.setItem("token", keycloak.token);
            createRoot(document.getElementById('root')).render(
                <StrictMode>
                    <BrowserRouter>
                        <ThemeProvider>
                            <App />
                        </ThemeProvider>
                    </BrowserRouter>
                </StrictMode>
            );
        } else {
            keycloak.login(); // redirect to login if not authenticated
        }

        // Refresh token every 60s if close to expiring
        setInterval(() => {
            keycloak.updateToken(60).then((refreshed) => {
                if (refreshed) {
                    localStorage.setItem("token", keycloak.token);
                }
            }).catch(() => {
                keycloak.login(); // force re-login on failure
            });
        }, 60000);
    })
    .catch(() => {
        console.error("Failed to initialize Keycloak");
    });



// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//       <BrowserRouter>
//       <ThemeProvider>
//         <App />
//       </ThemeProvider>
//       </BrowserRouter>
//
//   </StrictMode>,
// )
