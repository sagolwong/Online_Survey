import React, { Component } from 'react'

export default class ListTemplate extends Component {

    goToEditSurvey() {
        const templateId = this.props.template._id;
        const projectId = this.props.projectId;
        var sampleGroupId = "no";
        if (this.props.sampleGroupId !== undefined) {
            sampleGroupId = this.props.sampleGroupId;
        }
        const type = "template"
        window.location = `/edit-survey/${type}/${templateId}/${projectId}/${sampleGroupId}`;
    }

    render() {
        return (
            <div className="col-md-3 col-sm-6 col-xs-12">
                <div className="listSampleGroup" onClick={this.goToEditSurvey.bind(this)}>
                    <div className="info-box">
                        <span className="info-box-icon bg-green"><i className="fa fa-file-text-o" /></span>
                        <div className="info-box-content">
                            <h3>
                                {this.props.template.nameSurvey}
                                <i className="fa fa-ellipsis-v" />
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
