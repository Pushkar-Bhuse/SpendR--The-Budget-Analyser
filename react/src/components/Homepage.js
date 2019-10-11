import Navbar from "./Navbar"
import { Layout, Menu, Icon } from 'antd';
import React from "react"
import TotalExpenditureTrend from "./TotalExpenditureTrend"
const { Header, Sider, Content } = Layout;

class Homepage extends React.Component {


  render() {
    return (
      <Layout>
        <Navbar collapsed = {this.state.collapsed}/>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: '#fff',
              minHeight: 280,
            }}>

          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default Homepage
