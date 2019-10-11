import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';
import AddTransactionModal from '../components/AddTransactionModal'
import BaseRouter from '../BaseRouter'

const { Header, Content, Footer } = Layout;

class CustomLayout extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
             selected_keys : ["2"]
        }
    }

    change_selected_keys = (val) => {
        console.log("Selected Key made 1")
        this.setState({
            selected_keys : [val]
        })
    }

    componentDidMount = () => {
        console.log(this.props.history)
    }

    submitAddForm = () => {
        console.log(this.props.history)
        this.props.history.push("/dashboard/")
        window.location.reload()
    }

    onlogout = () => {
        this.props.logout()
        this.setState({
            selected_keys : ["2"]
        })
        this.props.history.push("/login/")
    }


    render() {
        return (
            <Layout className="layout">
                <Header>
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectedKeys={this.state.selected_keys}
                    style={{ lineHeight: '64px' }}
                >

                {
                    this.props.isAuthenticated ?

                    <Menu.Item key="2" onClick = { this.onlogout }>
                        Logout
                    </Menu.Item>

                    :

                    <Menu.Item key="2">
                        <Link to="/login/">Login</Link>
                    </Menu.Item>
                }

                    <Menu.Item key="1">
                        <Link to="/dashboard/">Dashboard</Link>
                    </Menu.Item>

                    <Menu.Item key="3">
                        <Link to="/goals/">Goals</Link>
                    </Menu.Item>

                </Menu>
                </Header>
                <Content style={{ padding: '0 50px' }}>
                    <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                        {/* {this.props.children} */}
                        <BaseRouter { ...this.props } loadDashboardData = {this.props.loadDashboardData} change_selected_keys = {this.change_selected_keys}/>
                    </div>
                </Content>
                {
                    this.props.isAuthenticated ?
                    <AddTransactionModal onSubmit = {this.submitAddForm}/>:
                    ""
                }

                <Footer>
                    Created by Supernova Devs
                </Footer>
            </Layout>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(actions.logout())
    }
}

export default withRouter(connect(null, mapDispatchToProps)(CustomLayout));