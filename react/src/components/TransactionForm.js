import React from 'react'
import { Form, Icon, Input, Button, InputNumber, Select, DatePicker, Drawer } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import moment from 'moment';
import axios from "axios"
import AddLiability from './AddLiability';

const { MonthPicker, RangePicker } = DatePicker;
const { Option} = Select

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class TransactionForm extends React.Component {

    constructor(props) {
        super(props)
        // console.log(props)
        this.state = {
            data: {},
            visible: false,
            option_list: []
        }
    }

    onChange(value) {
        // console.log(`selected ${value}`);
      }

    onBlur() {
        // console.log('blur');
      }

    onFocus() {
        // console.log('focus');
      }

    onSearch(val) {
        // console.log('search:', val);
      }

  componentDidMount() {
    console.log("Transaction Form")
    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.headers = {
    "Content-Type": "application/json",
    Authorization: `Token ${localStorage.getItem('token')}`,
    };
    axios.get(`http://localhost:8000/api/liability-list/`)
    .then(res => {
        const data = res.data;

        this.setState({ data },() => {
          var option_list = []
          for(var key in this.state.data.LiabilityList){
            option_list.push(<Option value={this.state.data.LiabilityList[key].id}>{this.state.data.LiabilityList[key].name}</Option>)
        }
        this.setState({
          option_list: option_list
        })
        });
    })
    // To disabled submit button at the beginning.
    // this.props.form.validateFields();
  }

  handleSubmit = e => {
    // console.log(this.props.history)
    var on_submit = this.props.onSubmit
    var resetFields = this.props.form.resetFields
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log(values.Date)
        var date = values.Date.format("DD/MM/YYYY")
        console.log(date)
        axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
        axios.defaults.xsrfCookieName = "csrftoken";
        axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem('token')}`,
        };
        axios.post(`http://localhost:8000/api/add_expenditure/`, {
            amount:values.Amount,
            date: date,
            liability: values.Liability
        })
        .then(function (response) {
            on_submit()
            resetFields()
        })
        .catch(function (error) {
            console.log(error);
        });
      }
    });
  };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  addNewLiability = (val) => {
    console.log("New Liability")
    var newlist = this.state.option_list
    newlist.push(<Option value={val.id}>{val.name}</Option>)
    this.setState({
      visible: false,
      option_list: newlist
    })
  }

  render() {
    console.log("In render")
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    // Only show error after a field is touched.
    const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];



    return (
      <React.Fragment>
      <Form layout="vertical" onSubmit={this.handleSubmit}>
        <FormItem label = "Amount">
        {
            getFieldDecorator('Amount', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your password!',
                  }
                ],
              })(<InputNumber
                // defaultValue={0}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                min={0}
                />)
        }
        </FormItem>

        <FormItem label="Liability">
            {
                getFieldDecorator('Liability', {
                    rules: [
                    {
                        required: true,
                        message: 'Please mention the Liability!',
                    }
                    ]})(<Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Select a Liability"
                    optionFilterProp="children"
                    onChange={this.onChange}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    onSearch={this.onSearch}
                    filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    >
                    {this.state.option_list}
                </Select>)
            }
        </FormItem>

        <FormItem label = "Date">
        {
            getFieldDecorator('Date', {
                rules: [
                ],
              })(<DatePicker defaultValue={moment('01/01/2015', dateFormatList[0])} format={dateFormatList} />)
        }
        </FormItem>


        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())} block>
            Add Transaction
          </Button>
        </Form.Item>
        </Form>

        <Button onClick={this.showDrawer} block>Add Liability</Button>
        <Drawer
        title="Basic Drawer"
        placement="bottom"
        closable={false}
        onClose={this.onClose}
        visible={this.state.visible}
        >
          <AddLiability addNewLiability = {this.addNewLiability}/>
        </Drawer>
    </React.Fragment>
    );
  }
}

const NewTransactionForm = Form.create({ name: 'transaction_form' })(TransactionForm);

export default NewTransactionForm