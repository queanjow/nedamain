import React from 'react';
import { useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { UserContext } from './context/UserContext.js';
import 'react-notification-alert/dist/animate.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import '@fullcalendar/common/main.min.css';
import '@fullcalendar/daygrid/main.min.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import 'select2/dist/css/select2.min.css';
import 'quill/dist/quill.core.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'assets/vendor/nucleo/css/nucleo.css';
import 'assets/scss/dasboard-components.scss';
import AdminLayout from 'layouts/Admin.js';
import AuthLayout from 'layouts/Auth.js';
import UserContextProvider from './context/UserContext.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
const user = useContext[UserContext];

root.render(
    <UserContextProvider>
        <BrowserRouter>
            <Switch>
                {!user && <Route
                        path="/admin"
                        render={(props) => <AdminLayout {...props} />}
                    />
                }
                {!user && 
                    <Route
                        path="/auth"
                        render={(props) => <AuthLayout {...props} />}
                    />
                }
                <Redirect from="/" to={ user ? "/":"/auth" } />
            </Switch>
        </BrowserRouter>
    </UserContextProvider>
);
