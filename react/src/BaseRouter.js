import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Link, Route } from "react-router-dom"
import Dashboard from "./components/Dashboard"
import Login from "./containers/Login"
import Signup from "./containers/Signup"
import Goals from "./components/Goals"

export class BaseRouter extends Component {

    change_selected_keys = (val) => {
        this.props.change_selected_keys(val)
    }

    render() {
        // console.log(this.props.isAuthenticated)
        console.log("in router")
        return (
            <div>
                <Route path="/login/" component ={() => <Login isAuthenticated = {this.props.isAuthenticated} change_selected_keys = {this.change_selected_keys}/>} />{" "}
                <Route path="/signup/" component={() => <Signup isAuthenticated = {this.props.isAuthenticated} />} />{" "}
                <Route path="/dashboard/" component={() => <Dashboard isAuthenticated = {this.props.isAuthenticated} loadDashboardData = { this.loadDashboardData } change_selected_keys = {this.change_selected_keys}/>} />{" "}
                <Route path="/goals/" component={() => <Goals isAuthenticated = {this.props.isAuthenticated} />} /> {" "}
            </div>
        )
    }
}

export default BaseRouter
