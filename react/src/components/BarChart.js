import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2'

export class BarChart extends Component {

    constructor(props) {
        super(props)
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var current_month = new Date().getMonth() + 12



        this.state = {
             data:{
                fontColor:"rgb(255,255,255)",
                labels: [monthNames[current_month%12],monthNames[(current_month - 1)%12],monthNames[(current_month - 2)%12],monthNames[(current_month - 3)%12],monthNames[(current_month - 4)%12]].reverse(),
                datasets:[{
                    label: props.liability,
                    data:props.data
                }]
             }
        }
    }


    render() {
        var scales = {
            xAxes: [{gridLines: { color: "#FFFFFF" }}],
            yAxes: [{gridLines: { color: "#FFFFFF" },
                    ticks: {
                        suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                        // OR //
                        beginAtZero: true   // minimum value will be 0.
                    }}]
            }
        return (
            <Bar
                data={this.state.data}
                height={100}
                // options={{
                //     scales: {
                //       yAxes: [{
                //         gridLines: { color: "#FFFFFF" }
                //        }],
                //        xAxes: [{
                //            gridLines: { color: "#FFFFFF" }
                //         }],
                //       },

                //   }}
            />
        )
    }
}

export default BarChart
