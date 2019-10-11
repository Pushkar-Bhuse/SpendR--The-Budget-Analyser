import React, { Component } from 'react'
import '../App.css';
import "tabler-react/dist/Tabler.css";
import { Card } from "tabler-react";
import Navbar from "./Navbar"
import { Layout, Spin, Row, Col, Icon} from 'antd';
import Percentage_Chart from './Percentage_Chart';
import TotalExpenditureTrend from "./TotalExpenditureTrend"
import IndividualExpenditure from "./IndividualExpenditure"
import TimelineDisplay from "./TimelineDisplay"

import axios from "axios"

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;


export class Dashboard extends Component {

    constructor(props) {
        super(props)

            this.state={
                collapsed: false,
                bottom:20 };
            // expenditure_data = {this.state.data.Expenditure_User} income_data = {this.state.data.Income_User}
        }


    componentDidMount(){
        console.log("Dashboard")
        if(this.props.isAuthenticated){
            axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
            axios.defaults.xsrfCookieName = "csrftoken";
            axios.defaults.headers = {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem('token')}`,
            };
            axios.get(`http://localhost:8000/api/dashboard/`)
            .then(res => {
                const data = res.data;
                this.setState({ data });
            })
        }
    }


    toggle = () => {
        this.setState({
          collapsed: !this.state.collapsed,
        });
    };

    render() {
        // console.log(this.state)
        return (
            <div>
                {
                    this.props.isAuthenticated ?

                    (this.state.data === undefined || this.state.data === null ?

                        <Spin indicator={antIcon} />
                    :
                    <div>
                        <Card>
                            <Card.Header>
                            <Card.Title>Income vs Expenditure Trend</Card.Title>
                            </Card.Header>
                            <Card.Body>
                            <TotalExpenditureTrend expenditure_data = {this.state.data.Expenditure_User} income_data = {this.state.data.Income_User}/>
                            </Card.Body>
                        </Card>

                        <Card>
                            <Card.Header>
                            <Card.Title>Liability Expenditure Trend</Card.Title>
                            </Card.Header>
                            <Card.Body>
                            <IndividualExpenditure bar_chart_data_user = { this.state.data.BarChartDataUser } liability_map = { this.state.data.LiabilityMap } />
                            </Card.Body>
                        </Card>


                        <Row gutter={16}>
                        <Col span = {12}>
                            <Card>
                            <Card.Header>
                                <Card.Title>Distribution of Liabilities This Month</Card.Title>
                            </Card.Header>
                            <Card.Body>
                            <Percentage_Chart distribution_of_liabilities_user = { this.state.data.DistributionOfLiabilitiesUser } liability_map = { this.state.data.LiabilityMap }/>
                            </Card.Body>
                            </Card>
                        </Col>
                        <Col span = {12}>
                            <Card>
                            <Card.Header>
                                <Card.Title>Expenditure Timeline</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <TimelineDisplay timeline_user = { this.state.data.TimelineUser }/>
                            </Card.Body>
                            </Card>
                        </Col>
                        </Row>
                    </div>)
                    :
                    <p>Not Logged in console </p>
                }

            </div>
        )
    }
}

export default Dashboard
