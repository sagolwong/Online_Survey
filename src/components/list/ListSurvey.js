import React, { Component } from 'react'

export default class ListSurvey extends Component {
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

    render() {
        return (
            <div className="col-md-3 col-sm-6 col-xs-12">
                <div class="input-group">
                    <div className="listSampleGroup">
                        <div className="info-box" onClick={this.props.survey.status === "ONLINE" ? this.goToManageSurvey : this.goToEditSurvey}>
                            {this.props.survey.status === "ONLINE" ?
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
                                <li><a >ลบแบบสอบถาม</a></li>
                            </ul>
                        </div>
                    </span>
                </div>
            </div>
        )
    }
}
