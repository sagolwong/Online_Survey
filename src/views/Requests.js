import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from 'axios';

import { showComponent } from "../actions/setPageActions";

import UpgradeRequest from '../components/list/request/UpgradeRequest';

class Requests extends Component {
    constructor(props) {
        super(props);

        this.state = {
            requests: []
        };
    }

    componentDidMount(){
        const userId = this.props.auth.user.id;

        this.props.showComponent()

        axios.get('/requests/' + userId)
            .then(response => {
                this.setState({
                    requests: response.data
                })
                console.log(this.state.requests);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    showRequests(){
        if (this.state.requests[0] !== undefined) {
            return (
                this.state.requests.map(res => {
                    if (res.typeRequest === "upgrade") return <UpgradeRequest upgradeRequest={res} />
                })
            )
        } else {
            return <h2>ไม่มีรายการคำขอร้อง</h2>
        }  
    }

    render() {
        return (
            <div className="content-wrapper">
                <section className="content-header">
                    <h1>
                        คำร้องขอ
                    </h1>
                    <ol className="breadcrumb">
                        <li className="active"><i className="fa fa-bell-o"></i> คำร้องขอ</li>
                    </ol>
                </section>
                <br />
                <section className="content">
                    {this.showRequests()}
                </section>
            </div>
        )
    }
}
Requests.propTypes = {
    showComponent: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(mapStateToProps, { showComponent })(Requests);