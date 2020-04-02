import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from 'axios';

import { showComponent } from "../actions/setPageActions";

class CreateProject extends Component {
    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);


        this.state = {
            nameProject: "",
            description: "",
            project: {},
            profile: {}
        };
    }

    componentDidMount() {
        const userId = this.props.auth.user.id;

        this.props.showComponent();

        axios.get('/users/' + userId)
            .then(response => {
                this.setState({
                    profile: response.data
                })
                console.log(this.state.profile);
                console.log(this.state.profile.recentProjects.length);
            })
            .catch((error) => {
                console.log(error);
            })


    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    async onSubmit(e) {
        e.preventDefault();

        const userId = this.props.auth.user.id;
        var nameProject = this.state.nameProject;

        var createProject = {
            nameProject: this.state.nameProject,
            description: this.state.description
        }
        console.log(createProject);

        await axios.post(`/projects/createProject/${userId}`, createProject)
            .then(res => console.log(res.data));


        await axios.get(`/projects/${userId}/` + nameProject)
            .then(response => {
                this.setState({
                    project: response.data
                })
                console.log(this.state.project._id);
            })
            .catch((error) => {
                console.log(error);
            })

        if (await this.state.profile.recentProjects.length < 10) {
            await this.state.profile.recentProjects.unshift(this.state.project._id)

            const editRecentProject = await {
                recentOtherSurveys: this.state.profile.recentOtherSurveys,
                recentProjects: this.state.profile.recentProjects
            }

            await axios.post(`/users/edit/${userId}`, editRecentProject)
                .then(res => console.log(res.data));
        } else {
            await this.state.profile.recentProjects.splice(9, 1);
            await this.state.profile.recentProjects.unshift(this.state.project._id)

            const editRecentProject = await {
                recentOtherSurveys: this.state.profile.recentOtherSurveys,
                recentProjects: this.state.profile.recentProjects
            }

            await axios.post(`/users/edit/${userId}`, editRecentProject)
                .then(res => console.log(res.data));
        }

        window.location = await '/project-management/' + this.state.project._id;
    }

    render() {
        return (
            <div className="content-wrapper">
                <section className="content-header">
                    <h1>
                        สร้างโปรเจค
                    </h1>
                    <ol className="breadcrumb">
                        <li ><a href="/requests"><i className="fa fa-bell-o"></i> คำร้องขอ</a></li>
                        <li className="active">สร้างโปรเจค</li>
                    </ol>
                </section>
                <br />
                <section className="content">
                    <div className="box box-info">
                        <div className="box-header with-border">
                            <h3 className="box-title">สร้างโปรเจคใหม่</h3>
                        </div>

                        <form onSubmit={this.onSubmit}>
                            <div className="box-body">
                                <div className="row-md-6">
                                    <div className="form-group">
                                        <label>ชื่อโปรเจค:</label>
                                        <input type="text"
                                            required
                                            id="nameProject"
                                            className="form-control"
                                            value={this.state.nameProject}
                                            onChange={this.onChange}
                                        />
                                    </div>
                                </div>
                                <div className="row-md-6">
                                    <div className="form-group">
                                        <label>คำอธิบายโปรเจค: </label>
                                        <textarea
                                            id="description"
                                            className="form-control"
                                            value={this.state.description}
                                            onChange={this.onChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="box-footer text-center">
                                <div className="form-group">
                                    <input type="submit" value="สร้าง" className="btn btn-info" style={{ width: "200px" }} />
                                </div>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        )
    }
}

CreateProject.propTypes = {
    showComponent: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { showComponent })(CreateProject);