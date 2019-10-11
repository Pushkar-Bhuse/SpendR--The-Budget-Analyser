import React from "react"
import { Line } from "react-chartjs-2"


class TotalExpenditureTrend extends React.Component {
    constructor(props) {
      super();
      let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

      let current_month = new Date().getMonth() + 12

      this.state = {
        data:{
          labels: [monthNames[current_month%12],monthNames[(current_month - 1)%12],monthNames[(current_month - 2)%12],monthNames[(current_month - 3)%12],monthNames[(current_month - 4)%12]].reverse(),
          datasets:
          [{
          label: "Monthly Income Trend",
          // backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(6, 0, 107)',
          data: props.income_data.reverse()
          },
          {
          label: "Monthly Expenditure Trend",
          borderColor: "rgb(2, 159, 252)",
          data: props.expenditure_data.reverse()
          }]
      }
      };
    }

    componentDidMount = () => {
      // console.log(this.props)
    }


    render() {
      return (
          < Line
            data={this.state.data}
            height={50}
            // width={700}
          />
      );
    }
  }

export default TotalExpenditureTrend;