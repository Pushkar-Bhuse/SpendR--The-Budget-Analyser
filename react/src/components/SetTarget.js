import React, { Component, createRef } from 'react'
import { Slider, InputNumber, Row, Col } from 'antd';
import { element } from 'prop-types';
import { IndividualSlider } from './IndividualSlider';

export class SetTarget extends Component {


    constructor(props) {
        super(props)

        this.state = {
            expenditure: props.sliderData.expenditure,
            saving: props.sliderData.saving
        }

    }

    ChangeTotal = (liability, value, is_saving) => {
        if(is_saving){
            this.setState({
                saving : value
            }, () => {this.props.TotalLiabilitySpend(value, true)
                // console.log("Set Target")
            })
        }
        else{
            var new_expenditure_list = [...this.state.expenditure]
            for(var i in new_expenditure_list){
                if(new_expenditure_list[i].liability.id === liability.liability.id){
                    new_expenditure_list[i].goal = value
                }
            }
            // console.log(new_expenditure_list)
            this.setState({
                values:new_expenditure_list
            }, () => {this.props.TotalLiabilitySpend(new_expenditure_list, false)
                    // console.log("Set Target")
                })
        }
    }



    render() {
        var sliderList = []
        var savings_dict = {
            liability : "Savings",
            goal : this.props.sliderData.saving
        }
        sliderList.push(
            <Row>
                <IndividualSlider liability = {savings_dict} ChangeTotal = {this.ChangeTotal} difference={this.props.difference}/>
            </Row>
        )
        for(var key in this.props.sliderData.expenditure){
            sliderList.push(
                <Row>
                    <IndividualSlider liability={this.props.sliderData.expenditure[key]} ChangeTotal = {this.ChangeTotal} difference={this.props.difference}/>
                </Row>
            )
        }
    return (
        <div>
        { sliderList }
       </div>
    );
    }
}

export default SetTarget
