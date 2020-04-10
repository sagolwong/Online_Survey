import React, { Component } from 'react'

export default class ListSurveyReadOnly extends Component {
    constructor(props) {
        super(props);

        this.goToManageSurvey = this.goToManageSurvey.bind(this);
    }

    goToManageSurvey() {
        const surveyId = this.props.survey._id;

        window.location = `/survey-management/${surveyId}`;
    }

    render() {
        if (this.props.sidebar) {
            return <li><a onClick={this.goToManageSurvey}><i className="fa fa-file-o" /> {this.props.survey.nameSurvey}</a></li>
        } else {
            return (
                <div className="box box-warning box-solid" >
                    <div className="list" onClick={this.goToManageSurvey}>
                        <div className="box-body">
                            <i className="fa fa-file-o" /> {this.props.survey.nameSurvey}
                        </div>
                    </div>
                </div>
            )
        }

    }
}
