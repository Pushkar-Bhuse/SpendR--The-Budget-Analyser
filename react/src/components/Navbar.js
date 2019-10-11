import React, { Component } from 'react'
import { Layout, Menu, Icon } from 'antd';
import { BrowserRouter as Router, Switch, Link, Route } from "react-router-dom"
const { Header, Sider, Content } = Layout;

class Navbar extends Component {
    render() {
        return (
            <Sider trigger={null} collapsible collapsed={this.props.collapsed}>
                <div className="logo" />
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1">
                    <Icon type="user" />
                        <Link to="/">Dashboard</Link>
                    </Menu.Item>
                    <Menu.Item key="2">
                    <Icon type="video-camera" />
                        <Link to="/logout">Logout</Link>
                    </Menu.Item>
                    <Menu.Item key="3">
                    <Icon type="upload" />
                        <Link to="/">Profile</Link>
                    </Menu.Item>
                </Menu>
            </Sider>
        )
    }
}

export default Navbar
