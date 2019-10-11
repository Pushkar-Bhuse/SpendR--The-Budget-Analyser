import React from 'react';
import { Modal, Button, Tabs } from 'antd';
import TransactionForm from "./TransactionForm"
import IncomeForm from "./IncomeForm"
const { TabPane } = Tabs;

class AddTransaction extends React.Component {
  state = {
    loading: false,
    visible: false,
    transaction_key: 1
  };

  showModal = () => {
    console.log(this.props.history)
    this.setState({
      visible: true,
    });
  };

  onSubmitModal = () => {
    this.handleCancel()
    this.props.onSubmit()
  }

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  render() {
    const { visible, loading } = this.state;
    return (
      <div>
        <Button type="primary" shape="round" size="large" onClick={this.showModal} style={{ position:"fixed", bottom:"20px", right:"20px" }}>
          + Add Transaction
        </Button>
        <Modal
          visible={visible}
          title="Title"
        //   onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer = {null}>
            <Tabs defaultActiveKey="1" onChange={(key) => this.setState({
                transaction_key: key
            })}>
                <TabPane tab="Expenditure" key="1">
                    <TransactionForm onSubmit = { this.onSubmitModal }/>
                </TabPane>
                <TabPane tab="Income" key="2">
                    <IncomeForm onSubmit = { this.onSubmitModal }/>
                </TabPane>
            </Tabs>
        </Modal>
      </div>
    );
  }
}

export default AddTransaction