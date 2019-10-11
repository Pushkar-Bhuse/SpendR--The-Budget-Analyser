import React from 'react';
import './App.css';
import "tabler-react/dist/Tabler.css";
import { Card } from "tabler-react";
import Navbar from "./components/Navbar"
import { Affix, Button, Layout, Menu, Icon, Row, Col} from 'antd';
import { connect } from 'react-redux';
import Dashboard from "./components/Dashboard"
import axios from "axios"
import { BrowserRouter as Router } from "react-router-dom"
import BaseRouter from "./BaseRouter"
import CustomLayout from "./containers/CustomLayout"
import * as actions from "./store/actions/auth"
const { Header, Sider, Content} = Layout;



class App extends React.Component {

  state = {
    collapsed: false,
    bottom:20
  };


  componentDidMount() {
    // console.log("App.js")
    this.props.onTryAutoSignup();
  }



  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render(){
    return (
      <div>
        <Router>
          <CustomLayout {...this.props} loadDashboardData = {this.loadDashboardData} />
        </Router>
      </div>
    );
  }

}

const mapStateToProps = state => {
  return {
    isAuthenticated : state.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup : () => dispatch(actions.authCheckState())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
