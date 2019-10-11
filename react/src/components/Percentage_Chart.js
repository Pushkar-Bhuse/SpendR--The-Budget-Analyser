import  React, { Component } from "react"
import { Radar } from "react-chartjs-2"

class Percentage_Chart extends Component {
    constructor(props) {
      super();
      var object = props.distribution_of_liabilities_user
      var labels=[], values=[]
      for(var key in object){
        labels.push(object[key].liability)
        values.push(object[key].amount)
      }
      // console.log(object)
      this.state = {
        RadarData:{
          labels : labels,
          datasets : [{
            label:"Expenditures This Month",
            backgroundColor:"rgba(0, 255, 188, 0.29)",
            data:values
          }]
        }
      };
    }

    render() {
      return (
        <Radar
          data={this.state.RadarData}
          width={100}
          height={100}
        />

      );
    }
}

export default Percentage_Chart;