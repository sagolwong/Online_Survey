import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from 'axios';

import { showComponent } from "../actions/setPageActions";

import UpgradeRequest from '../components/list/request/UpgradeRequest';
import MemberRequest from '../components/list/request/MemberRequest';
import DoOnlyRequest from '../components/list/request/DoOnlyRequest';
import FrequencyRequest from '../components/list/request/FrequencyRequest';
import DecryptionRequest from '../components/list/request/DecryptionRequest';

class Requests extends Component {
    constructor(props) {
        super(props);

        this.state = {
            requests: []
        };
    }

    componentDidMount() {
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

    showRequests() {
        if (this.state.requests[0] !== undefined) {
            return (
                this.state.requests.map(res => {
                    if (res.typeRequest === "upgrade") return <div className="col-md-6"><UpgradeRequest upgradeRequest={res} /></div>
                    else if (res.typeRequest === "member") return <div className="col-md-6"><MemberRequest memberRequest={res} /></div>
                    else if (res.typeRequest === "doOnly") return <div className="col-md-6"><DoOnlyRequest doOnlyRequest={res} /></div>
                    else if (res.typeRequest === "frequency") return <div className="col-md-6"><FrequencyRequest frequencyRequest={res} /></div>
                    else if (res.typeRequest === "decryption") return <div className="col-md-6"><DecryptionRequest decryptionRequest={res} /></div>
                })
            )
        } else {
            return (
                <div style={{ fontSize: "25px" }}>
                    <br /><br /><br /><br />
                    <div className="row text-center">
                        <i className="fa fa-envelope-o" /> ไม่มีรายการคำขอร้องขอ
                    </div>
                </div>
            )
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
                        <li className="active"><i className="fa fa-envelope-o"></i> คำร้องขอ</li>
                    </ol>
                </section>
                <br />
                <section className="content">
                    <div className="box box-warning box-solid">
                        <div className="box-header with-border">
                            <h3 className="box-title">รายการคำร้องขอ</h3>
                        </div>
                    </div>
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