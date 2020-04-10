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
                <div className="listSampleGroup" onClick={this.goToSampleGroup}>
                    <div className="info-box">
                        <span className="info-box-icon bg-yellow"><i className="fa fa-users" /></span>
                        <div className="info-box-content">
                            <h3>
                                {this.props.sampleGroup.nameSampleGroup}
                                <i className="fa fa-ellipsis-v" />
                            </h3>
                        </div>
                    </div>     
                </div>
            </div>
        )
    }
}
