import React, { Component } from 'react'
import axios from 'axios';

export default class ListMember extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        };
    }

    async deleteUser() {
        const userId = this.props.user._id;

        if (this.props.user.role === "RESPONDER") {
            await axios.get(`/listSurvey/find/` + userId)
                .then(response => {
                    axios.delete(`/listSurvey/` + response.data._id)
                        .then(res => console.log(res.data));
                })
                .catch((error) => {
                    console.log(error);
                })

            await axios.get(`/requests/`)
                .then(response => {
                    response.data.map(request => {
                        if (request.userId === userId || request.data[0] === userId) {
                            axios.delete(`/requests/` + request._id)
                                .then(res => console.log(res.data));
                        }
                    })
                })
                .catch((error) => {
                    console.log(error);
                })

            await axios.delete(`/users/` + userId)
                .then(res => console.log(res.data));

            window.location = await "/manage-members";

        } else if (this.props.user.role === "RESEARCHER") {
            await axios.get(`/projects/find/` + userId)
                .then(response => {
                    response.data.map(project => {
                        const projectId = project._id;

                        axios.get(`/surveys/` + projectId)
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

                        axios.get(`/sampleGroups/` + projectId)
                            .then(response => {
                                response.data.map(sampleGroup => {
                                    axios.delete(`/sampleGroups/` + sampleGroup._id)
                                        .then(res => console.log(res.data));
                                })
                            })
                            .catch((error) => {
                                console.log(error);
                            })

                        axios.delete(`/projects/` + projectId)
                            .then(res => console.log(res.data));
                    })
                })
                .catch((error) => {
                    console.log(error);
                })

            await axios.get(`/listSurvey/find/` + userId)
                .then(response => {
                    axios.delete(`/listSurvey/` + response.data._id)
                        .then(res => console.log(res.data));
                })
                .catch((error) => {
                    console.log(error);
                })

            await axios.delete(`/users/` + userId)
                .then(res => console.log(res.data));

            window.location = await "/manage-members";
        }
    }

    render() {
        return (
            <div className={this.state.open ? "box box-info box box-solid" : "box box-primary collapsed-box box-solid"}>
                <div className="box-header with-border">
                    <div onClick={() => this.setState({ open: !this.state.open })}>
                        <h3 className="box-title"><i className="fa fa-user" />&nbsp; {this.props.user.firstname + " " + this.props.user.lastname}</h3>
                    </div>

                    <div className="box-tools">
                        <button type="button" className="btn btn-box-tool" onClick={this.deleteUser.bind(this)}><i className="fa fa-trash" /></button>
                        <button type="button" className="btn btn-box-tool" onClick={() => this.setState({ open: !this.state.open })}><i className={this.state.open ? "fa fa-minus" : "fa fa-plus"} />
                        </button>
                    </div>
                </div>

                <div className="box-body">
                    <div className="row">
                        <div className="col-md-6">
                            <p>อีเมล : </p>
                        </div>
                        <div className="col-md-6">
                            <p>{this.props.user.email}</p>
                        </div>
                    </div>
                    {this.props.user.role === "RESEARCHER" ?
                        <div>
                            <div className="row">
                                <div className="col-md-6">
                                    <p>เพศ : </p>
                                </div>
                                <div className="col-md-6">
                                    <p>{this.props.user.gender}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <p>อาชีพ : </p>
                                </div>
                                <div className="col-md-6">
                                    <p>{this.props.user.job}</p>
                                </div>
                            </div>
                        </div>
                        : ""
                    }
                    <div className="row">
                        <div className="col-md-6">
                            <p>ระดับสิทธิ์ : </p>
                        </div>
                        <div className="col-md-6">
                            <p>{this.props.user.role === "RESPONDER" ? "ผู้ตอบแบบสอบถาม" : "ผู้วิจัย"}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
