import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from 'axios';

import Can from "../rbac/Can";

class ListProject extends Component {
    constructor(props) {
        super(props);

        this.goToManageProject = this.goToManageProject.bind(this);

        this.state = {
            user: {}
        };
    }

    componentDidMount() {
        const userId = this.props.project.userId;

        if (this.props.auth.user.role === "ADMIN") {
            axios.get(`/users/` + userId)
                .then(response => {
                    this.setState({
                        user: response.data
                    })

                    console.log(this.state.user);
                })
                .catch((error) => {
                    console.log(error);
                })
        }

    }

    goToManageProject() {
        const projectId = this.props.project._id;
        window.location = `/project-management/${projectId}`;
    }

    async deleteProject() {
        const projectId = this.props.project._id;

        await axios.get(`/surveys/` + projectId)
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

        await axios.get(`/sampleGroups/` + projectId)
            .then(response => {
                response.data.map(sampleGroup => {
                    axios.delete(`/sampleGroups/` + sampleGroup._id)
                        .then(res => console.log(res.data));
                })
            })
            .catch((error) => {
                console.log(error);
            })

        await axios.delete(`/projects/` + projectId)
            .then(res => console.log(res.data));

        window.location = await "/projects";
    }

    render() {
        if (this.props.sidebar) {
            return <li><a onClick={this.goToManageProject}><i className="fa fa-folder-o" /> {this.props.project.nameProject}</a></li>
        } else {
            return (
                <div className="box box-warning box-solid" >
                    <div className="list">
                        <div className="row">
                            <div className="col-md-6" onClick={this.goToManageProject}>
                                <div className="box-body">
                                    {this.props.auth.user.role === "ADMIN" ?
                                        <div className="row-md-6">
                                            <i className="fa fa-folder-o" /> {this.props.project.nameProject}
                                        </div>
                                        :
                                        <div className="row-md-6" style={{ fontSize: "20px" }}>
                                            <i className="fa fa-folder-o" /> {this.props.project.nameProject}
                                        </div>
                                    }

                                    {this.props.auth.user.role === "ADMIN" ?
                                        <div className="row-md-6 pull-left">
                                            เจ้าของโปรเจค : {this.state.user.firstname + " " + this.state.user.lastname}
                                        </div>
                                        : ""
                                    }
                                </div>

                            </div>
                            <Can
                                role={this.props.auth.user.role}
                                perform="list-project:delete-project"
                                data={{
                                    userId: this.props.auth.user.id,
                                    surveyOwnerId: this.props.project.userId
                                }}
                                yes={() => (
                                    <div className="col-md-6">
                                        <div className="box-body">
                                            <button type="button" className="btn btn-danger pull-right" onClick={this.deleteProject.bind(this)}><i className="fa fa-trash" /> ลบ</button>
                                        </div>
                                    </div>
                                )}
                                no={() => ""}
                            />
                        </div>
                    </div>

                </div>
            )
        }

    }
}

ListProject.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(ListProject);