import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from 'axios';

import Can from "../rbac/Can";

class ListProject extends Component {
    constructor(props) {
        super(props);

        this.goToManageProject = this.goToManageProject.bind(this);

        this.state = {
            user: {}
        };
    }

    componentDidMount() {
        const userId = this.props.project.userId;

        if (this.props.auth.user.role === "ADMIN") {
            axios.get(`/users/` + userId)
                .then(response => {
                    this.setState({
                        user: response.data
                    })

                    console.log(this.state.listUser);
                })
                .catch((error) => {
                    console.log(error);
                })
        }

    }

    goToManageProject() {
        const projectId = this.props.project._id;
        window.location = `/project-management/${projectId}`;
    }

    deleteProject() {

    }

    render() {
        if (this.props.sidebar) {
            return <li><a onClick={this.goToManageProject}><i className="fa fa-folder-o" /> {this.props.project.nameProject}</a></li>
        } else {
            return (
                <div className="box box-warning box-solid" >
                    <div className="list">
                        <div className="row">
                            <div className="col-md-6" onClick={this.goToManageProject}>
                                <div className="box-body">
                                    <div className="row-md-6">
                                        <i className="fa fa-folder-o" /> {this.props.project.nameProject}
                                    </div>

                                    {this.props.auth.user.role === "ADMIN" ?
                                        <div className="row-md-6 pull-left">
                                            เจ้าของโปรเจค : {this.state.user.firstname + " " + this.state.user.lastname}
                                        </div>
                                        : ""
                                    }
                                </div>

                            </div>
                            <Can
                                role={this.props.auth.user.role}
                                perform="list-project:delete-project"
                                yes={() => (
                                    <div className="col-md-6">
                                        <div className="box-body">
                                            <button type="button" className="btn btn-danger pull-right" onClick={this.deleteProject.bind(this)}><i className="fa fa-trash" /> ลบ</button>
                                        </div>
                                    </div>
                                )}
                                no={() => ""}
                            />
                        </div>
                    </div>

                </div>
            )
        }

    }
}

ListProject.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(ListProject);