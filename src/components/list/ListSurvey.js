import React, { Component } from 'react'

export default class ListSurvey extends Component {
    constructor(props) {
        super(props);
        
        this.goToManageSurvey = this.goToManageSurvey.bind(this);
        this.goToEditSurvey = this.goToEditSurvey.bind(this);
        
    }

    goToManageSurvey(){
        const surveyId = this.props.survey._id;
        window.location = `/survey-management/${surveyId}`;
    }

    goToEditSurvey(){
        const surveyId = this.props.survey._id;
        const type = "draft"
        window.location = `/edit-survey/${type}/${surveyId}`;
    }

    render() {
        return (
            <div className="col-md-3 col-sm-6 col-xs-12">
                <div className="listSampleGroup" onClick={this.props.survey.status === "ONLINE" ? this.goToManageSurvey :this.goToEditSurvey}>
                    <div className="info-box">
                        <span className="info-box-icon bg-aqua"><i className="fa fa-edit" /></span>
                        <div className="info-box-content">
                            <h3>
                                {this.props.survey.nameSurvey}
                                <i className="fa fa-ellipsis-v" />
                            </h3>
                        </div>
                    </div>     
                </div>
            </div>
        )
    }
}
