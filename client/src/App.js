import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Home from './components/screens/Home'
import Signin from './components/screens/Signin'
import Profile from './components/screens/Profile'
import Signup from './components/screens/Signup'

function App() {
    return (
        <BrowserRouter>
            <Navbar/>
            <Route exact path="/">
                <Home/>
            </Route>
            <Route path="/signin">
                <Signin/>
            </Route>
            <Route path="/signup">
                <Signup/>
            </Route>
            <Route path="/profile">
                <Profile/>
            </Route>
        </BrowserRouter>
    );
}

export default App;
