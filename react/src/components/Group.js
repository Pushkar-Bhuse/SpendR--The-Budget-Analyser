import React, { Component } from 'react'

export class Group extends Component {

    constructor(props) {
        super(props)

        this.state = {

        }
    }

    componentDidMount() {
        if(this.props.isAuthenticated){
            axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
            axios.defaults.xsrfCookieName = "csrftoken";
            axios.defaults.headers = {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem('token')}`,
            };
            axios.get(`http://localhost:8000/api/goals/`)
            .then(res => {
                const data = res.data;
                this.setState({ data });
            })
        }
    }

    createProgressReport = () => {
        var goals = this.state.data.goal_list
        var expenditures = []
        var final_expense_report = []
        for( i in goals){
            expenditures.push(this.state.all_expenditures[goals[i].liability.name])

        }

    }

    render() {
        return (
            <div>
                {

                }
            </div>
        )
    }
}

export default Group
