import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import axios from 'axios';

import { editStep0 } from "../../actions/surveyActions"

import EditSurvey from '../../views/EditSurvey';
import ReviewSurvey from '../../views/ReviewSurvey';

class baseEditSurvey extends Component {
    constructor(props) {
        super(props);
        this.state = {
            survey: {},
            template: {},
            data: {}
        }
        this.showEditForm = this.showEditForm.bind(this);
    }

    async componentDidMount() {
        const type = this.props.match.params.type;
        const id = this.props.match.params.id;
        var projectId = "";
        var sampleGroupId = "";

        if (await type === "template") {
            projectId = this.props.match.params.projectId;
            if (this.props.match.params.sampleGroupId !== "no") sampleGroupId = this.props.match.params.sampleGroupId;
        }

        if (await type === "draft") {
            await axios.get(`/surveys/find/` + id)
                .then(response => {
                    this.setState({
                        survey: response.data
                    })

                    console.log(this.state.survey);
                })
                .catch((error) => {
                    console.log(error);
                })

            var data = await {
                userId: this.state.survey.userId,
                projectId: this.state.survey.projectId,
                sampleGroupId: this.state.survey.sampleGroupId,
                nameSurvey: this.state.survey.nameSurvey,
                description: this.state.survey.description,
                shareTo: this.state.survey.shareTo,
                wantName: this.state.survey.wantName,
                haveGroup: this.state.survey.haveGroup,
                doOnce: this.state.survey.doOnce,
                frequency: this.state.survey.frequency,
                openAndCloseTimes: this.state.survey.openAndCloseTimes,
                builtIns: this.state.survey.builtIns,
                data: this.state.survey.data,
                status: this.state.survey.status
            }
        } else if (await type === "template") {
            await axios.get(`/templates/find/` + id)
                .then(response => {
                    this.setState({
                        template: response.data
                    })

                    console.log(this.state.template);
                })
                .catch((error) => {
                    console.log(error);
                })

            var data = await {
                userId: this.state.template.userId,
                projectId: projectId,
                sampleGroupId: sampleGroupId,
                nameSurvey: this.state.template.nameSurvey,
                description: this.state.template.description,
                shareTo: this.state.template.shareTo,
                wantName: this.state.template.wantName,
                haveGroup: this.state.template.haveGroup,
                doOnce: this.state.template.doOnce,
                frequency: this.state.template.frequency,
                openAndCloseTimes: this.state.template.openAndCloseTimes,
                builtIns: this.state.template.builtIns,
                data: this.state.template.data,
                status: "template"
            }
        }
        this.setState({ data: data })
        console.log(data);

        await this.props.editStep0(data);
    }

    showEditForm() {
        if (this.props.survey.step === "e1") {
            return <EditSurvey />
        } else if (this.props.survey.step === "e2") {
            console.log(this.props.survey)
            return <ReviewSurvey type={this.props.match.params.type} />
        } else if (this.props.survey.step === "e3") {
            console.log(this.props.survey)
            if (this.props.match.params.type === "template") {
                const data = {
                    userId: this.props.survey.userId,
                    projectId: this.props.survey.projectId,
                    sampleGroupId: this.props.survey.sampleGroupId,
                    nameSurvey: this.props.survey.nameSurvey,
                    description: this.props.survey.description,
                    shareTo: this.props.survey.shareTo,
                    wantName: this.props.survey.wantName,
                    haveGroup: this.props.survey.haveGroup,
                    names: this.props.survey.names,
                    frequency: this.props.survey.frequency,
                    doOnce: this.props.survey.doOnce,
                    openAndCloseTimes: this.props.survey.openAndCloseTimes,
                    builtIns: this.props.survey.builtIns,
                    data: this.props.survey.data,
                    status: this.props.survey.status
                }
                axios.post(`/surveys/create`, data)
                    .then(res => {
                        console.log(res.data)
                        axios.get(`/surveys/${this.props.survey.projectId}/` + data.nameSurvey)
                            .then(response => {
                                console.log(response.data[0]._id);
                                if (this.props.survey.status === "ONLINE") {
                                    if (this.props.survey.dateToDo !== undefined) {
                                        const frequency = {
                                            surveyId: response.data[0]._id,
                                            listTimeToDo: this.props.survey.dateToDo
                                        }
                                        axios.post(`/frequency/create`, frequency)
                                            .then(res => console.log(res.data))
                                    }
                                    window.location = '/survey-management/' + response.data[0]._id;
                                } else if (this.props.survey.status === "DRAFT") {
                                    window.location = '/requests';
                                }

                            })
                            .catch((error) => {
                                console.log(error);
                            })
                    });
                // }
            } else if (this.props.match.params.type === "draft") {
                const data = {
                    projectId: this.props.survey.projectId,
                    sampleGroupId: this.props.survey.sampleGroupId,
                    nameSurvey: this.props.survey.nameSurvey,
                    description: this.props.survey.description,
                    shareTo: this.props.survey.shareTo,
                    wantName: this.props.survey.wantName,
                    haveGroup: this.props.survey.haveGroup,
                    names: this.props.survey.names,
                    frequency: this.props.survey.frequency,
                    doOnce: this.props.survey.doOnce,
                    openAndCloseTimes: this.props.survey.openAndCloseTimes,
                    builtIns: this.props.survey.builtIns,
                    data: this.props.survey.data,
                    status: this.props.survey.status
                }
                axios.post(`/surveys/editSurvey/${this.props.match.params.id}`, data)
                    .then(res => {
                        console.log(res.data)
                        axios.get(`/surveys/${this.props.survey.projectId}/` + data.nameSurvey)
                            .then(response => {
                                console.log(response.data[0]._id);
                                if (this.props.survey.status === "ONLINE") {
                                    if (this.props.survey.dateToDo !== undefined) {
                                        const frequency = {
                                            surveyId: response.data[0]._id,
                                            listTimeToDo: this.props.survey.dateToDo
                                        }
                                        axios.post(`/frequency/create`, frequency)
                                            .then(res => console.log(res.data))
                                    }
                                    //window.location = '/survey-management/' + response.data[0]._id;
                                } else if (this.props.survey.status === "DRAFT") {
                                    window.location = '/requests';
                                }

                            })
                            .catch((error) => {
                                console.log(error);
                            })
                    });
            }
        }
    }

    render() {
        return (
            <div className="bg-blank-page">
                {this.showEditForm()}
                {console.log(this.props.survey)}
            </div>
        )
    }
}

baseEditSurvey.propTypes = {
    editStep0: PropTypes.func.isRequired,
    survey: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    survey: state.survey,
});

export default connect(mapStateToProps, { editStep0 })(baseEditSurvey);