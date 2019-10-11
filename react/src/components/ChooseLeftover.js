import React, { Component } from 'react'
import { Select, Checkbox } from 'antd';


class ChooseLeftover extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
           selectedItems:[],
           allowSubmit: false,
           difference: props.difference,
           alter_savings: false,
           selectedLiability:[],
           saving_index: null
    }
    console.log(props.unchangedItems)
  }


  onCheckboxChange = (e) => {
    // console.log(e.target)
    // var temp = this.state.selectedItems
    if(e.target.checked){
      // temp.push(this.props.unchangedItems.saving)
      this.setState({
        alter_savings: e.target.checked,
        // selectedItems: temp,
        // saving_index: (temp.length-1)
      }, () => this.checkData())
    }
    else{
      // temp.splice(this.state.saving_index, 1)
      this.setState({
        alter_savings: e.target.checked,
        // selectedItems: temp,
        // saving_index: null
      },() => this.checkData())
    }

  }

  handleChange = selectedList => {
    // var selectedList = this.state.selectedItems
    // selectedList = selectedList.map(a => a.liability.id)
    // selectedList.push(newList[newList.length - 1])
    // console.log(newList)

    var selectedItems = []
    var selectedLiability = []
    for(var i in selectedList){
        for(var j in this.props.unchangedItems.expenditure){
            if(this.props.unchangedItems.expenditure[j].liability.id === selectedList[i]){
                selectedItems.push(this.props.unchangedItems.expenditure[j].goal)
                selectedLiability.push(this.props.unchangedItems.expenditure[j])
            }
        }
    }

    this.setState({
      selectedItems: selectedItems,
      selectedLiability: selectedLiability
    }, () => this.checkData())

  };

  checkData = () => {
    var total_available

    if(this.state.difference<0){
        total_available = this.state.selectedItems.map(a => 100-a).reduce((b,c)=>b+c,0)
    }
    else{
        console.log(this.state.selectedItems)
        total_available = this.state.selectedItems.reduce((b,c)=>b+c,0)
    }

    if(this.state.alter_savings){
      if(this.state.difference < 0){
        total_available += 100 - this.props.unchangedItems.saving
      }
      else{
        total_available += this.props.unchangedItems.saving
      }

    }

    console.log(total_available)

    if(total_available >= Math.abs(this.state.difference)){

        this.setState({
            allowSubmit:true,
        },() => {this.props.sendSelectedList(this.state.selectedLiability,this.state.allowSubmit, this.state.alter_savings)})
    }
    else{
        this.setState({
            allowSubmit:false,
        }, () => {this.props.sendSelectedList(this.state.selectedLiability,this.state.allowSubmit, this.state.alter_savings)})
    }
  }



  render() {
    var selectedList=[];
    for(var i in this.state.selectedLiability){
        selectedList.push(this.state.selectedLiability[i].liability.id)
    }
    // console.log(selectedList)

    var selectedLiability = []
    for(var key in this.state.selectedLiability){
      selectedLiability.push(this.state.selectedLiability[key].liability.name)
    }

    // console.log(selectedList)
    const filteredOptions = this.props.unchangedItems.expenditure.filter(o => !selectedList.includes(o.id)).map(a => a.liability)
    // console.log(filteredOptions)
    return (
      <React.Fragment>
        <Select
          mode="multiple"
          placeholder="Inserted are removed"
          // value={selectedLiability }
          onChange={this.handleChange}
          style={{ width: '100%' }}
        >
          {filteredOptions.map(item =>(
            <Select.Option key={item.id} value={item.id}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
        <Checkbox onChange={this.onCheckboxChange}>Allow Alterations in Savings</Checkbox>
      </React.Fragment>
    );
  }
}

export default ChooseLeftover