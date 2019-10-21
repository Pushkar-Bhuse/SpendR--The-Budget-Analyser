import { Carousel, Icon } from 'antd'
// import '../IndividualExpenditure.css'
import React, { Component } from 'react'
import { BarChart } from './BarChart';
import "./IndividualExpenditure.css"


class IndividualExpenditure extends Component {

    render() {
        var dict = this.props.bar_chart_data_user
        var liability_map = this.props.liability_map
        var return_arr = []
        var allZero = false
        for(var key in dict){
            allZero = dict[key].map((val) => val.amount).every(item => item === 0)
            if(!allZero){
                return_arr.push(
                    <div>
                        <BarChart data = {dict[key].map((val) => val.amount).reverse()} liability = { liability_map[key] }/>
                    </div>)
            }

        }

        return (
            <div>
            {
                return_arr.length === 0 ?
                <h1>No money Spent</h1> :
                    <Carousel autoplay>
                        { return_arr }
                    </Carousel>
            }
            </div>
        )
    }
}

export default IndividualExpenditure


