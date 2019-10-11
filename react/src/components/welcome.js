import React, {Component} from 'react'
import Navbar from "./Navbar"

class Welcome extends Component{

    constructor(props){
        super(props);

        this.inputref = React.createRef();
        this.state = {
            name : "Pushkar",
            username :""
        }
    }
    divStyle = {
        color:"#333333"
    }
    render() {
    return (
        <div className = "container-fluid" style = {this.divStyle}>
            <Navbar/>
        </div>
    );
    }



}
export default Welcome