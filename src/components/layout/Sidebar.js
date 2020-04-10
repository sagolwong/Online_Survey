import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from 'axios';

import Can from "../rbac/Can";
import ListProject from '../list/ListProject';
import ListSurveyReadOnly from '../list/ListSurveyReadOnly';

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: {},
            projects: [],
            otherSurveys: []
        }
        this.listProjects = this.listProjects.bind(this);
        this.listSurveys = this.listSurveys.bind(this);
    }

    async componentDidMount() {
        const userId = this.props.auth.user.id;

        await axios.get('/users/' + userId)
            .then(response => {
                this.setState({
                    profile: response.data
                })
                console.log(this.state.profile.firstname);
                console.log(this.state.profile.role);
                console.log(this.state.profile._id);
            })
            .catch((error) => {
                console.log(error);
            })
        if (await this.state.profile.recentProjects !== undefined) {
            console.log(this.state.profile.recentProjects);

            this.state.profile.recentProjects.map(res => {
                axios.get(`/projects/` + res)
                    .then(response => {
                        this.setState({
                            projects: this.state.projects.concat(response.data)
                        })

                        console.log(this.state.projects);
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            })
        }
        if (await this.state.profile.recentOtherSurveys !== undefined) {
            console.log(this.state.profile.recentOtherSurveys);

            this.state.profile.recentOtherSurveys.map(res => {
                axios.get(`/surveys/find/` + res)
                    .then(response => {
                        this.setState({
                            otherSurveys: this.state.otherSurveys.concat(response.data)
                        })

                        console.log(this.state.otherSurveys);
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            })
        }
    }

    listProjects() {
        console.log(this.state.projects);
        console.log(this.state.otherSurveys);
        if (this.state.projects !== undefined) {
            return (this.state.projects.map(res => {
                return <ListProject project={res} sidebar={true}/>
            }))
        }
    }

    listSurveys() {
        if (this.state.profile.recentOtherSurveys !== undefined) {
            return (this.state.otherSurveys.map(res => {
                return <ListSurveyReadOnly survey={res} sidebar={true}/>
            }))
        }
    }

    render() {
        return (
            <div>
                <aside className="main-sidebar">
                    {/* sidebar: style can be found in sidebar.less */}
                    <section className="sidebar">
                        <br />
                        {/* Sidebar user panel */}
                        <div className="user-panel">
                            <div className="pull-left image">
                                <img src="/dist/img/user2-160x160.jpg" className="img-circle" alt="User" />
                            </div>
                            <div className="pull-left info">
                                <p>{this.props.auth.user.role === "ADMIN" ? this.props.auth.user.firstname : this.props.auth.user.firstname + " " + this.props.auth.user.lastname}</p>
                                <Can
                                    role={this.props.auth.user.role}
                                    perform="sidebar:link-profile"
                                    yes={() => (<a href="/user-profile">ดูโปรไฟล์ของคุณ</a>)}
                                    no={() => ""}
                                />
                            </div>
                        </div>
                        <br />
                        {/* sidebar menu: : style can be found in sidebar.less */}
                        <ul className="sidebar-menu" data-widget="tree">
                            <li className="header"></li>
                            <Can
                                role={this.props.auth.user.role}
                                perform="sidebar:recent-project"
                                yes={() => (
                                    <li className="treeview">
                                        <a href="/projects">
                                            <i className="fa fa-folder" /> <span>โปรเจคที่สร้างครั้งล่าสุด</span>
                                            <span className="pull-right-container">
                                                <i className="fa fa-angle-left pull-right" />
                                            </span>
                                        </a>
                                        <ul className="treeview-menu">
                                            <li><a href="/create-project"><i className="fa fa-plus" /> เพิ่มโปรเจคใหม่</a></li>
                                            {this.listProjects()}
                                        </ul>
                                    </li>
                                )}
                                no={() => ""}
                            />
                            <Can
                                role={this.props.auth.user.role}
                                perform="sidebar:recent-other-survey"
                                yes={() => (
                                    <li className="treeview">
                                        <a href="/surveys">
                                            <i className="fa fa-file-text" />
                                            <span>แบบสอบถามที่ทำครั้งล่าสุด</span>
                                            <span className="pull-right-container">
                                                <i className="fa fa-angle-left pull-right" />
                                            </span>
                                        </a>
                                        <ul className="treeview-menu">
                                            {this.listSurveys()}
                                        </ul>
                                    </li>
                                )}
                                no={() => ""}
                            />

                            <Can
                                role={this.props.auth.user.role}
                                perform="sidebar:all-member"
                                yes={() => (
                                    <li>
                                        <a href="/manage-members">
                                            <i className="fa fa-users" />
                                            <span>จัดการสมาชิกทั้งหมด</span>
                                        </a>
                                    </li>
                                )}
                                no={() => ""}
                            />

                            <Can
                                role={this.props.auth.user.role}
                                perform="sidebar:all-project"
                                yes={() => (
                                    <li>
                                        <a href="/manage-project">
                                            <i className="fa fa-folder-open" />
                                            <span>จัดการโปรเจคทั้งหมด</span>
                                        </a>
                                    </li>
                                )}
                                no={() => ""}
                            />


                        </ul>
                    </section>
                    {/* /.sidebar */}
                    {console.log(this.props.auth.user.role)}
                </aside>
            </div>

        )
    }
}

Sidebar.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(Sidebar);