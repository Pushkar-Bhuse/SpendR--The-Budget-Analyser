import React, { Component } from 'react'
import { Form, Input, Button, Spin, Icon } from 'antd';
import axios from 'axios'

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

class AddLiability extends Component {

        componentDidMount() {
          // To disabled submit button at the beginning.
          console.log(this.props)
        //   this.props.form.validateFields();
        }

        handleLiabilitySubmit = e => {
          console.log(this.props)
          var fun = this.props.addNewLiability
          e.preventDefault();
          this.props.form.validateFields((err, values) => {
            if (!err) {
                axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
                axios.defaults.xsrfCookieName = "csrftoken";
                axios.defaults.headers = {
                "Content-Type": "application/json",
                Authorization: `Token ${localStorage.getItem('token')}`,
                };
                axios.post(`http://localhost:8000/api/add_liability/`, {
                    name: values.name
                })
                .then(function (response) {
                    var data = response.data
                    // console.log(this.props)
                    fun({'id':data.id, 'name': values.name})
                    this.props.form.resetFields()

                })
                .catch(function (error) {
                    // console.log(error);
                });
            }
          });
        };
    render() {
        // console.log(this.props)
        if(this.props.form){
            var { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
            var nameError = isFieldTouched('name') && getFieldError('name');
        }

        return (
            <div>
                {
                    this.props.form ?
                    <Form layout="inline" onSubmit={this.handleLiabilitySubmit}>
                        <Form.Item validateStatus={nameError ? 'error' : ''} help={nameError || ''}>
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: 'Please input your Liability Name!' }],
                        })(
                            <Input
                                placeholder="Liability Name"
                            />,
                        )}
                        </Form.Item>
                        <Form.Item>
                        <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
                            Submit
                        </Button>
                        </Form.Item>
                    </Form> :
                    <Spin indicator={antIcon} />
                }
            </div>

        )
    }
}

const NewLiabilityForm = Form.create({ name: 'horizontal_liability' })(AddLiability);

export default NewLiabilityForm
