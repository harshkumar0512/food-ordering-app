import React, {Component} from 'react';
import Home from '../screens/home/Home';
import Profile from "../screens/profile/Profile"
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Checkout from "./checkout/Checkout";
import Details from "./details/Details";

class Controller extends Component {

    constructor() {
        super();
        this.baseUrl = "http://localhost:8080/api/";
    }

    render() {
        return (
            <Router>
                <div className="main-container">
                    <Route exact path='/' render={(props) => <Home {...props} baseUrl={this.baseUrl}/>}/>
                    <Route exact path='/profile' render={(props) => <Profile {...props} />}/>
                    <Route exact path="/checkout" render={(props) => <Checkout {...props} baseUrl={this.baseUrl} />} />
                    <Route exact path='/restaurant/:restaurantId'
                           render={(props) => <Details {...props} baseUrl={this.baseUrl} />} />
                </div>
            </Router>
        )
    }
}

export default Controller;
