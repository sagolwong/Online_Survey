import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from 'axios';

class SurveyProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            survey: {},
            project: [],
            already: false
        };
        this.showComponent = this.showComponent.bind(this);
    }

    async componentDidMount() {
        const surveyId = this.props.surveyId;

        await axios.get(`/surveys/find/` + surveyId)
            .then(response => {
                this.setState({
                    survey: response.data,
                })
                console.log(this.state.survey);

            })
            .catch((error) => {
                console.log(error);
            })

        await axios.get(`/projects/find/` + this.state.survey.userId)
            .then(response => {
                this.setState({
                    project: response.data,
                    already: true
                })
                console.log(this.state.project[0]);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    goToProject() {
        window.location = "/project-management/" + this.state.survey.projectId
    }

    showComponent() {
        return (
            <div>
                <section className="content-header">
                    <h1>
                        <i className="fa fa-file-text-o" /> {this.state.survey.nameSurvey}
                    </h1>
                    <ol className="breadcrumb">
                        <li ><a href="/requests"><i className="fa fa-bell-o" /> คำร้องขอ</a></li>
                        <li ><a onClick={this.goToProject.bind(this)}><i className="fa fa-folder-o" /> {this.state.project[0].nameProject}</a></li>
                        <li className="active"><i className="fa fa-file-text-o" /> {this.state.survey.nameSurvey}</li>
                    </ol>
                </section>
                <br />
                <section className="content">
                    <div className="box box-success">
                        <div className="box-header with-border">
                            <h3 className="box-title">รายละเอียดแบบสอบถาม</h3>
                        </div>

                        <div className="box-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <p>แบบสอบถาม :</p>
                                </div>
                                <div className="col-md-6">
                                    <p> {this.state.survey.nameSurvey}</p>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <p>คำอธิบายแบบสอบถาม : </p>
                                </div>
                                <div className="col-md-6">
                                    {this.state.survey.description}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }

    render() {
        return (
            <div className="content-wrapper">
                {this.state.already ?
                    this.showComponent()
                    : <div>
                        <div className="row text-center">
                            <i className="fa fa-refresh fa-spin" />
                        </div>
                        <div className="row text-center">
                            กำลังโหลดข้อมูล...
                        </div>
                    </div>
                }
            </div>
        )
    }
}

SurveyProfile.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(SurveyProfile);