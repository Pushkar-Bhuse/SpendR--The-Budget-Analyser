import React, { Component, createRef } from 'react'
import { Slider, InputNumber, Row, Col } from 'antd';
import { element } from 'prop-types';

export class IndividualSlider extends Component {

    constructor(props) {
        super(props)

        this.state = {
             inputValue:props.liability.goal
        }
    }


    onChange = (value) => {

        this.setState({
            inputValue:value
        }, () => {
            if(typeof this.props.liability.liability !== 'object'){
                this.props.ChangeTotal(this.props.liability, value, true)
            }
            else{
                this.props.ChangeTotal(this.props.liability, value, false)
            }

        })

      };

    render() {

        var liability
        if(typeof this.props.liability.liability !== 'object'){
            liability = "Savings"
        }
        else{
            liability = this.props.liability.liability.name
        }

    return (
        <Row>
            <h3>{liability}</h3>
            <Col span={12}>
                <Slider
                    min={0}
                    max={100}
                    onChange={this.onChange}
                    value={typeof this.state.inputValue === 'number' ? this.state.inputValue : 0}
                />
            </Col>
            <Col span={4}>
                <InputNumber
                    min={0}
                    max={100}
                    style={{ marginLeft: 16 }}
                    value={this.state.inputValue}
                    onChange={this.onChange}
                />
            </Col>
        </Row>
    );
    }
}

export default IndividualSlider
