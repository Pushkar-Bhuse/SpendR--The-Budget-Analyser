import { Timeline, Icon } from 'antd';
import React, { Component } from 'react';

class TimelineDisplay extends Component {

    render() {
        var data = this.props.timeline_user
        var timeline = []
        let temp
        for(var key in data){
            temp = data[key].amount + " spent on " + data[key].liability.name + " on " + data[key].date
            timeline.push(<Timeline.Item>{temp}</Timeline.Item>)
        }
        return (
            <Timeline mode="right">
                {timeline}
            </Timeline>
        )
    }
}

export default TimelineDisplay


