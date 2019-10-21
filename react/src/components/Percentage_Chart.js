import  React, { Component } from "react"
import { Radar } from "react-chartjs-2"

class Percentage_Chart extends Component {
    constructor(props) {
      super();
      var object = props.distribution_of_liabilities_user, last_month = props.distribution_of_liabilities_last_month
      var labels=[], last_month_values = [], values=[]
      for(var key in object){
        labels.push(object[key].liability)
        values.push(object[key].amount)
      }
      for(var key in last_month){
        last_month_values.push(last_month[key].amount)
      }
      this.state = {
        RadarData:{
          labels : labels,
          datasets : [{
            label:"This Month",
            backgroundColor:"rgba(97, 218, 251, 0.5)",
            data:values
          },
          {
            label:"Last Month",
            backgroundColor:"rgba(2, 39, 105, 0.5)",
            data:last_month_values
          }]
        }
      };
    }



    render() {
      const options = {
        legend: {
          position: 'top'
        },
          ticks: {
            beginAtZero: true
          }
        }
        console.log(this.props.distribution_of_liabilities_last_month)
      return (
        <Radar
          options = {options}
          data={this.state.RadarData}
          width={100}
          height={100}
        />

      );
    }
}

export default Percentage_Chart;