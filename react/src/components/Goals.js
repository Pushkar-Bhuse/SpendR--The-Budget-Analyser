import React, { Component } from 'react'
import { Card, Progress, Statistic, Row, Col, Spin, Icon } from "antd"
import SliderDrawer from "./SliderDrawer"
import axios from "axios"

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

export class Goals extends Component {

    constructor(props) {
        super(props)

        this.state = {

        }
    }

    componentDidMount(){
        if(this.props.isAuthenticated){
            // console.log("Goalss")
            axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
            axios.defaults.xsrfCookieName = "csrftoken";
            axios.defaults.headers = {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem('token')}`,
            };
            axios.get(`http://localhost:8000/api/goals/`)
            .then(res => {
                const data = res.data;
                this.setState({ data });
            })
        }
    }

    createProgressBars = () => {
        var progressRender = []
        if(this.state.data.income > 0){
            progressRender.push(
                <Card style={{ width: "100%" }}>
                    <h2> My Savings </h2>
                    <Row>
                        <Col span = {8}>
                            <p> My Goal </p>
                        </Col>
                        <Col span = {24}>
                            <Progress percent={this.state.data.saving_goal} status="active" />
                        </Col>
                    </Row>
                    <Row>
                        <Col span = {8}>
                            <p> Savings This month </p>
                        </Col>
                        <Col span = {24}>
                            <Progress percent={this.state.data.saving_reality} status="active" />
                        </Col>
                    </Row>
                </Card>
            )
            var goal, liability, reality
            var goal_list = this.state.data.goal_list
            for(var key in goal_list){
                goal = goal_list[key].goal
                liability = goal_list[key].liability.name
                reality = (this.state.data.all_expenditures[goal_list[key].liability.id].amount / this.state.data.income)*100

                progressRender.push(
                    <Card style={{ width: "100%" }}>
                        <h2> {liability} </h2>
                        <Row>
                            <Col span = {8}>
                                <p> My Goal </p>
                            </Col>
                            <Col span = {24}>
                                <Progress percent={goal} status="active" />
                            </Col>
                        </Row>
                        <Row>
                            <Col span = {8}>
                                <p> Expenditure This Month </p>
                            </Col>
                            <Col span = {24}>
                                <Progress percent={reality} status="active" />
                            </Col>
                        </Row>
                            {/* // <Col span = {8}>
                            //     <Statistic title="Total Expenditure" value={this.state.data.all_expenditures[goal_list[key].liability.id].amount} />
                            // </Col> */}

                    </Card>
                )
            }
        }
        else{
            progressRender.push(<Card style={{ width: 300 }}>
                                    <h1>Oops! You don not have an income to execute your goals </h1>
                                </Card>)
        }

        return progressRender
    }

    render() {
        return (
            <div>
                {
                   this.state.data ?
                   <div>
                        {this.createProgressBars()}
                        <SliderDrawer goal_list = { this.state.data.goal_list } saving_goal = { this.state.data.saving_goal }/>
                    </div>
                    :
                    <Spin indicator={antIcon} />
                }
            </div>
        )
    }
}

export default Goals
