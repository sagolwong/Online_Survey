import React, { Component } from 'react'
import '../../App.css';

export default class ListProject extends Component {
    constructor(props) {
        super(props);

        this.goToManageProject = this.goToManageProject.bind(this);
    }

    goToManageProject() {
        const projectId = this.props.project._id;
        window.location = `/requests`;
    }

    render() {
        return (
            <div className="box box-warning box-solid" >
                <div className="list" onClick={this.goToManageProject}>
                    <div className="box-body">
                        {this.props.project.nameProject}
                    </div>
                </div>
            </div>
        )
    }
}
