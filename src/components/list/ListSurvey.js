import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from 'axios';

import Can from "../rbac/Can";

class ListSurvey extends Component {
    constructor(props) {
        super(props);

        this.goToManageSurvey = this.goToManageSurvey.bind(this);
        this.goToEditSurvey = this.goToEditSurvey.bind(this);

    }

    goToManageSurvey() {
        const surveyId = this.props.survey._id;
        window.location = `/survey-management/${surveyId}`;
    }

    goToEditSurvey() {
        const surveyId = this.props.survey._id;
        const type = "draft"
        window.location = `/edit-survey/${type}/${surveyId}`;
    }

    deleteDraft() {
        const surveyId = this.props.survey._id;
        const projectId = this.props.projectId;
        var sampleGroupId = "no";
        if (this.props.sampleGroupId !== undefined) {
            sampleGroupId = this.props.sampleGroupId;
        }

        axios.delete(`/surveys/${surveyId}`)
            .then(res => console.log(res.data));

        if (sampleGroupId === "no") {
            window.location = `/project-management/` + projectId;
        } else {
            window.location = `/project-management/sample-group-management/${projectId}/${sampleGroupId}`;
        }

    }

    async deleteSurvey() {
        const surveyId = this.props.survey._id;
        const projectId = this.props.projectId;
        var sampleGroupId = "no";
        if (this.props.sampleGroupId !== undefined) {
            sampleGroupId = this.props.sampleGroupId;
        }

        await axios.get(`/answers/find/` + surveyId)
            .then(response => {
                axios.delete(`/answers/` + response.data[0]._id)
                    .then(res => console.log(res.data));
            })
            .catch((error) => {
                console.log(error);
            })

        if (await this.props.survey.frequency.amount !== 0) {
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

        await axios.get(`/requests/`)
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

        await axios.delete(`/surveys/` + surveyId)
            .then(res => console.log(res.data));

        if (await sampleGroupId === "no") {
            window.location = `/project-management/` + projectId;
        } else {
            window.location = `/project-management/sample-group-management/${projectId}/${sampleGroupId}`;
        }

    }

    render() {
        return (
            <div className="col-md-3 col-sm-6 col-xs-12">
                <Can
                    role={this.props.auth.user.role}
                    perform="listSurvey:delete"
                    data={{
                        userId: this.props.auth.user.id,
                        surveyOwnerId: this.props.survey.userId
                    }}
                    yes={() => (
                        <div class="input-group">
                            <div className="listSampleGroup">
                                <div className="info-box" onClick={this.props.survey.status !== "DRAFT" ? this.goToManageSurvey : this.goToEditSurvey}>
                                    {this.props.survey.status !== "DRAFT" ?
                                        <span className="info-box-icon bg-green"><i className="fa fa-file-text-o" /></span>
                                        : <span className="info-box-icon bg-aqua"><i className="fa fa-edit" /></span>
                                    }
                                    <div className="info-box-content">
                                        <h4>{this.props.survey.nameSurvey}</h4>
                                    </div>
                                </div>
                            </div>
                            <span className="input-group-btn" >
                                <div className="info-box">
                                    <button style={{ height: "90px" }} type="button" className="btn btn-link dropdown-toggle" data-toggle="dropdown"><i className="fa fa-ellipsis-v" /></button>
                                    <ul className="dropdown-menu" role="menu">
                                        <li>
                                            {this.props.survey.status !== "DRAFT" ?
                                                <a onClick={this.deleteSurvey.bind(this)}>ลบแบบสอบถาม</a>
                                                : <a onClick={this.deleteDraft.bind(this)}>ลบแบบร่าง</a>
                                            }
                                        </li>
                                    </ul>
                                </div>
                            </span>
                        </div>
                    )}
                    no={() => (
                        <div className="listSampleGroup">
                            <div className="info-box" onClick={this.props.survey.status !== "DRAFT" ? this.goToManageSurvey : this.goToEditSurvey}>
                                {this.props.survey.status !== "DRAFT" ?
                                    <span className="info-box-icon bg-green"><i className="fa fa-file-text-o" /></span>
                                    : <span className="info-box-icon bg-aqua"><i className="fa fa-edit" /></span>
                                }
                                <div className="info-box-content">
                                    <h4>{this.props.survey.nameSurvey}</h4>
                                </div>
                            </div>
                        </div>
                    )}
                />
            </div>
        )
    }
}

ListSurvey.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(ListSurvey);