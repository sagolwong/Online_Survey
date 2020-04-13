import React, { Component } from 'react'
import '../../App.css';

export default class ListSampleGroup extends Component {
    constructor(props) {
        super(props);

        this.goToSampleGroup = this.goToSampleGroup.bind(this);

    }

    goToSampleGroup() {
        const projectId = this.props.projectId;
        const sampleGroupId = this.props.sampleGroup._id;

        window.location = `/project-management/sample-group-management/${projectId}/${sampleGroupId}`;
    }

    render() {
        return (
            <div className="col-md-3 col-sm-6 col-xs-12">
                <div class="input-group">
                    <div className="listSampleGroup">
                        <div className="info-box" onClick={this.goToSampleGroup}>
                            <span className="info-box-icon bg-yellow"><i className="fa fa-users" /></span>
                            <div className="info-box-content">
                                <h4>{this.props.sampleGroup.nameSampleGroup}</h4>
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
            </div >
        )
    }
}
