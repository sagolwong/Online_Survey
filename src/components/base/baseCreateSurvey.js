import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import axios from 'axios';

import { addStep0 } from "../../actions/surveyActions";

import CreateSurvey1 from '../../views/CreateSurvey1';
import CreateSurvey2 from '../../views/CreateSurvey2';
import CreateSurvey3 from '../../views/CreateSurvey3';
import ReviewSurvey from '../../views/ReviewSurvey';

class baseCreateSurvey extends Component {
    constructor(props) {
        super(props);
        this.state = {
            project: {},
            survey: [],
            sampleGroup: {}
        }
        this.showForm = this.showForm.bind(this);
    }

    async componentDidMount() {
        const projectId = this.props.match.params.projectId;
        const sampleGroupId = this.props.match.params.sampleGroupId;
        console.log(projectId);
        console.log(sampleGroupId);
        await axios.get(`/projects/` + projectId)
            .then(response => {
                this.setState({
                    project: response.data
                })

                console.log(this.state.project._id);
            })
            .catch((error) => {
                console.log(error);
            })

        if (sampleGroupId !== undefined) {
            await axios.get(`/sampleGroups/find/` + sampleGroupId)
                .then(response => {
                    this.setState({
                        sampleGroup: response.data
                    })

                    console.log(this.state.sampleGroup._id);
                })
                .catch((error) => {
                    console.log(error);
                })
        } else {
            this.setState({
                sampleGroup: {
                    _id: ""
                }
            })
        }
        const data = await {
            userId: this.props.auth.user.id,
            projectId: this.state.project._id,
            sampleGroupId: this.state.sampleGroup._id
        }
        console.log(data);

        await this.props.addStep0(data);
    }

    showForm() {
        if (this.props.survey.step === 1) {
            return <CreateSurvey1 />
        } if (this.props.survey.step === 2) {
            return <CreateSurvey2 />
        } if (this.props.survey.step === 3) {
            return <CreateSurvey3 />
        } if (this.props.survey.step === 4) {
            return <ReviewSurvey />
        } if (this.props.survey.step === 5) {
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
            console.log(data);

            axios.post(`/surveys/create`, data)
                .then(res => {
                    console.log(res.data)
                    axios.get(`/surveys/${this.state.project._id}/` + data.nameSurvey)
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
        }
    }

    render() {
        return (
            <div className="bg-blank-page">
                {this.showForm()}

                {console.log(this.props.survey)}
            </div>
        )
    }
}

baseCreateSurvey.propTypes = {
    addStep0: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    survey: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    survey: state.survey
});

export default connect(mapStateToProps, { addStep0 })(baseCreateSurvey);