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
            <div className="col-md-3 col-sm-6 col-xs-12" style={{width:"24%"}}>
                <div class="input-group">
                    <div className="listSampleGroup">
                        <div className="info-box" onClick={this.goToEditSurvey.bind(this)}>
                            <span className="info-box-icon bg-blue"><i className="fa fa-file-o" /></span>
                            <div className="info-box-content">
                                <h4>{this.props.template.nameSurvey}</h4>
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
