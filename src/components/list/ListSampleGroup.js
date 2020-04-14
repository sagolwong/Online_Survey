import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from 'axios';

import Can from "../rbac/Can";

class ListSampleGroup extends Component {
    constructor(props) {
        super(props);

        this.goToSampleGroup = this.goToSampleGroup.bind(this);

        this.state={
            userId: ""
        }

    }

    componentDidMount() {
        axios.get(`/projects/` + this.props.sampleGroup.projectId)
            .then(response => {
                this.setState({ userId: response.data.userId })
            })
            .catch((error) => {
                console.log(error);
            })
    }

    goToSampleGroup() {
        const projectId = this.props.projectId;
        const sampleGroupId = this.props.sampleGroup._id;

        window.location = `/project-management/sample-group-management/${projectId}/${sampleGroupId}`;
    }

    async deleteSampleGroup() {
        const projectId = this.props.projectId;
        const sampleGroupId = this.props.sampleGroup._id;

        await axios.get(`/surveys/group/` + sampleGroupId)
            .then(response => {
                response.data.map(survey => {
                    const surveyId = survey._id;

                    axios.get(`/answers/find/` + surveyId)
                        .then(response => {
                            axios.delete(`/answers/` + response.data[0]._id)
                                .then(res => console.log(res.data));
                        })
                        .catch((error) => {
                            console.log(error);
                        })

                    if (survey.frequency.amount !== 0) {
                        axios.get(`/frequency/find/` + surveyId)
                            .then(response => {
                                axios.delete(`/frequency/` + response.data[0]._id)
                                    .then(res => console.log(res.data));
                            })
                            .catch((error) => {
                                console.log(error);
                            })

                        axios.get(`/followResults/findS/` + surveyId)
                            .then(response => {
                                axios.delete(`/followResults/` + response.data[0]._id)
                                    .then(res => console.log(res.data));
                            })
                            .catch((error) => {
                                console.log(error);
                            })
                    }

                    axios.get(`/requests/`)
                        .then(response => {
                            response.data.map(request => {
                                if (request.data[0] === surveyId) {
                                    axios.delete(`/requests/` + request._id)
                                        .then(res => console.log(res.data));
                                }
                            })
                        })
                        .catch((error) => {
                            console.log(error);
                        })

                    axios.delete(`/surveys/` + surveyId)
                        .then(res => console.log(res.data));
                })

            })
            .catch((error) => {
                console.log(error);
            })

        await axios.delete(`/sampleGroups/` + sampleGroupId)
            .then(res => console.log(res.data));

        window.location = await `/project-management/` + projectId;
    }

    render() {
        return (
            <div className="col-md-3 col-sm-6 col-xs-12">
                <Can
                    role={this.props.auth.user.role}
                    perform="listSampleGroup:delete"
                    data={{
                        userId: this.props.auth.user.id,
                        surveyOwnerId: this.state.userId
                    }}
                    yes={() => (
                        <div class="input-group">
                            <div className="listSampleGroup">
                                <div className="info-box" onClick={this.goToSampleGroup}>
                                    <span className="info-box-icon bg-yellow"><i className="fa fa-users" /></span>
                                    <div className="info-box-content">
                                        <h4>{this.props.sampleGroup.nameSampleGroup}</h4>
                                    </div>
                                </div>
                            </div>
                            <span className="input-group-btn" >
                                <div className="info-box">
                                    <button style={{ height: "90px" }} type="button" className="btn btn-link dropdown-toggle" data-toggle="dropdown"><i className="fa fa-ellipsis-v" /></button>
                                    <ul className="dropdown-menu" role="menu">
                                        <li><a onClick={this.deleteSampleGroup.bind(this)}>ลบกลุ่มตัวอย่าง</a></li>
                                    </ul>
                                </div>
                            </span>
                        </div>
                    )}
                    no={() => (
                        <div className="listSampleGroup">
                            <div className="info-box" onClick={this.goToSampleGroup}>
                                <span className="info-box-icon bg-yellow"><i className="fa fa-users" /></span>
                                <div className="info-box-content">
                                    <h4>{this.props.sampleGroup.nameSampleGroup}</h4>
                                </div>
                            </div>
                        </div>
                    )}
                />
            </div >
        )
    }
}

ListSampleGroup.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(ListSampleGroup);