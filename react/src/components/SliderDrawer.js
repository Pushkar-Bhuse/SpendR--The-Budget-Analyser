import React from 'react';
import axios from 'axios';
import { Drawer, Button, Modal, Spin, Icon} from 'antd';
import SetTarget from "./SetTarget"
import ChooseLeftover from './ChooseLeftover';
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class SliderDrawer extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      visible: false,
      LeftoverDrawer: false ,
      total_liability_spend:[],
      first_list:[],
      saving_goal: 0,
      difference:0,
      selected_items:[],
      allowSubmit:false,
      modal_visible:false,
      alter_savings: false,
      changed_liabilities: [],
      direct_modal: false
    }
  }

  componentDidMount = () => {
    this.setState({
      total_liability_spend: this.props.goal_list,
      first_list: this.props.goal_list,
      saving_goal : this.props.saving_goal
    }, () => console.log(this.state.total_liability_spend))

  }

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  showSuccess = () => {

    this.setState({
      visible: false,
      direct_modal: true,
    }, () => {
      axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
      axios.defaults.xsrfCookieName = "csrftoken";
      axios.defaults.withCredentials = true;
      axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem('token')}`,
      };
      axios.post(`http://localhost:8000/api/update-goals/`, {
          initial_setup: this.state.total_liability_spend,
          selected_liability: [],
          alter_savings: true,
          new_savings: this.state.saving_goal
      })
      .then(function (response) {
        console.log("Heloooooo")
      })
      .catch(function (error) {
          // console.log(error);
      });
    });


  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  showLeftoverDrawer = () => {
    this.setState({
      LeftoverDrawer: true,
    });
  };

  onLeftoverDrawerClose = () => {
    this.setState({
      LeftoverDrawer: false,
    });
  };

  addChangedLiability = (liability, value) => {

  }

  onLeftoverDrawerSuccess = () => {
    var selectedItems = this.state.selected_items
    var difference = this.state.difference
    var i = 0
    var saving_goal = this.state.saving_goal
    // console.log(this.state.alter_savings)
    // console.log(selectedItems)
    // console.log(difference)
    if(difference>0){
      if(this.state.alter_savings){
        while(difference !== 0){
          if(i === selectedItems.length){
            if(saving_goal > 0){
              saving_goal -= 1
              difference -= 1
            }
          }
          else{
            if(selectedItems[i].goal > 0){
              selectedItems[i].goal = selectedItems[i].goal - 1
              difference -= 1
            }
          }
          i = (i+1) % (selectedItems.length+1)
        }
      }
      else{
        while(difference !== 0){
          if(selectedItems[i].goal > 0){
            selectedItems[i].goal = selectedItems[i].goal - 1
            difference -= 1;
          }
          i = (i+1) % (selectedItems.length);
        }
      }
    }
    else{
      if(this.state.alter_savings){
        while(difference !== 0){
          if(i === selectedItems.length){
            if(saving_goal < 100){
              saving_goal += 1
              difference += 1
            }
          }
          else{
            if(selectedItems[i].goal < 100){
              selectedItems[i].goal = selectedItems[i].goal + 1
              difference += 1
            }
          }

          i = (i+1) % (selectedItems.length+1)
        }
      }
      else{
        while(difference !== 0){
          if(selectedItems[i].goal < 100){
            selectedItems[i].goal = selectedItems[i].goal + 1
            difference += 1
          }

          i = (i+1) % selectedItems.length
        }
      }
    }
    // console.log(this.state.alter_savings)
    // console.log(selectedItems)
    // console.log(saving_goal)
    let alter_savings = this.state.alter_savings
    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.withCredentials = true;
    axios.defaults.headers = {
    "Content-Type": "application/json",
    Authorization: `Token ${localStorage.getItem('token')}`,
    };
    axios.post(`http://localhost:8000/api/update-goals/`, {
        initial_setup: this.state.total_liability_spend,
        selected_liability: selectedItems,
        alter_savings: alter_savings,
        new_savings: saving_goal
    })
    .then(function (response) {
        var data = response.data
        this.props.form.resetFields()
        console.log("In here")
    })
    .catch(function (error) {
        // console.log(error);
    });

    this.setState({
      LeftoverDrawer: false,
      modal_visible:true
    });
  };

  TotalLiabilitySpend = (slider_list, is_saving) => {

    if(is_saving){
      this.setState({
        saving_goal: slider_list
      }, () => {this.calculateDifference()})
    }
    else{
      this.setState({
        total_liability_spend:slider_list
      },() => {this.calculateDifference()})
    }


  }

  calculateDifference = () => {
    var diff = this.state.saving_goal
    var final = this.state.total_liability_spend;
    for(var i in final){
        diff += (final[i].goal)
    }
    diff = diff - 100
    console.log(diff)
    this.setState({
      difference: diff
    })
  }

  sendSelectedList = (selected_items, allowSubmit, alter_savings) => {
    this.setState({
      allowSubmit:allowSubmit,
      selected_items:selected_items,
      alter_savings: alter_savings
    })
  }

  showSuggestion = () => {
    this.setState({
      modal_visible: true,
    });
  }

  handleDirectOk = e => {
    this.setState({
      modal_visible: false,
    }, () => window.location.reload());
  }

  handleOk = e => {
    this.setState({
      direct_modal: false,
    }, () => window.location.reload());
  };

  render() {

    let suggestion;
    if(this.state.allowSubmit === true){
      suggestion = <p> Changes Saved Successfully !</p>
    }
    else{
      if(this.state.difference<0){
        suggestion = <p>Seems Like you have more money than you need! Please choose a few more liabilities to distribute your remaining funds</p>
      }
      else{
        suggestion = <p>Oops! Looks like your wallet and your goals don't agree...Please add a few more liabilities to pick up funds from</p>
      }
    }

    let first_drawer = []
    var set_target_dict = {
      saving: this.state.saving_goal,
      expenditure: this.state.total_liability_spend
    }
    first_drawer.push(<SetTarget addChangedLiability={this.addChangedLiability} TotalLiabilitySpend={this.TotalLiabilitySpend} sliderData = {set_target_dict} difference={this.state.difference}/>)
    first_drawer.push(<Button type="primary" onClick={(this.state.difference != 0) ? this.showLeftoverDrawer : this.showSuccess}>
      Submit Request
    </Button>)
    first_drawer.push(<div style = {{ marginBottom:"10px" }}>
                        <p> If the goals you set are not realistic, you will be asked to allow alterations in a few of yor liabilities and savings</p>
                        <p>--------------------------------</p>
                      </div>)

    // else{
    //   first_drawer.push(<Spin indicator={antIcon} />)
    // }
    // console.log(this.state.difference)

    return (
      <div>

        <Button type="primary" onClick={this.showDrawer} style = {{ margin : "10px" }}>
          Alter Goals
        </Button>
        <Drawer
          title="Alter Goals"
          width={520}
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
        >

        <div style = {{ marginBottom:"10px" }}>
          {first_drawer}
        </div>
        <Modal  title="Action Report"
                visible={this.state.direct_modal}
                onOk={this.handleDirectOk}>

                Changes Saved Successfully...That too in one go !!

        </Modal>

          <Drawer
            title=""
            width={320}
            closable={false}
            onClose={this.onLeftoverDrawerClose}
            visible={this.state.LeftoverDrawer}
          >
            <ChooseLeftover unchangedItems = {set_target_dict} difference = {this.state.difference} sendSelectedList = {this.sendSelectedList}/>

            <Button onClick={(this.state.allowSubmit) ? this.onLeftoverDrawerSuccess : this.showSuggestion} type="primary" style={{margin:10}}>
              Submit
            </Button>
            <Button type="primary" onClick={this.onLeftoverDrawerClose}>
            Go back
          </Button>
            <Modal
              title="Action Report"
              visible={this.state.modal_visible}
              onOk={this.handleOk}
            >
            {suggestion}
            </Modal>

          </Drawer>


          <div
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e8e8e8',
              padding: '10px 16px',
              textAlign: 'right',
              left: 0,
              background: '#fff',
              borderRadius: '0 0 4px 4px',
            }}
          >
            <Button
              style={{
                marginRight: 8,
              }}
              onClick={this.onClose}
            >
              Cancel
            </Button>

          </div>
        </Drawer>
      </div>
    );
  }
}

export default SliderDrawer