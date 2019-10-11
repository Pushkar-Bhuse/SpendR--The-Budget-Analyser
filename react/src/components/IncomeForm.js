import React from 'react'
import { Form, Icon, Input, Button, InputNumber, Select, DatePicker } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import moment from 'moment';
import axios from "axios"

const { MonthPicker, RangePicker } = DatePicker;
const { Option} = Select

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class IncomeForm extends React.Component {


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


  handleSubmit = e => {

    var on_submit = this.props.onSubmit
    var resetFields = this.props.form.resetFields
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        var date = values.Date.format("DD/MM/YYYY")
        axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
        axios.defaults.xsrfCookieName = "csrftoken";
        axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem('token')}`,
        };
        axios.post(`http://localhost:8000/api/add_income/`, {
            amount:values.Amount,
            date: date,
            source: values.Source
        })
        .then(function (response) {
          // this.props.form.resetFields()
          console.log("Here")
          on_submit()
          resetFields()
            // console.log(response);
        })
        .catch(function (error) {
            // console.log(error);
        });
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    // Only show error after a field is touched.
    const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];

    const option_list = []

    // console.log(this.state.data.LiabilityList)

    return (
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

        <FormItem label="Source">
            {
                getFieldDecorator('Source', {
                    rules: [
                    {
                        required: true,
                        message: 'Please mention the Source!',
                    }
                    ]})(<Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Select a Source of Income"
                    optionFilterProp="children"
                    onChange={this.onChange}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    onSearch={this.onSearch}
                    filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    >
                    <Option value="Salary">Salary</Option>
                    <Option value="Gift">Gift</Option>
                    <Option value="Other">Other</Option>
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
          <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
            Log in
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const NewTransactionForm = Form.create({ name: 'income_form' })(IncomeForm);

export default NewTransactionForm