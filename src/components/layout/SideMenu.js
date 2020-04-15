import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from 'axios';

import Can from "../rbac/Can";

class SideMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            checkOwnSurvey: false
        };
    }

    componentDidMount() {
        const surveyId = this.props.surveyId;
        const userId = this.props.auth.user.id;

        axios.get(`/surveys/find/` + surveyId)
            .then(response => {
                if (response.data.userId === userId) this.setState({ checkOwnSurvey: true })
            })
            .catch((error) => {
                console.log(error);
            })
    }

    changeToSurveyProfile() {
        this.props.ChangePage("survey-profile")
    }

    changeToManageSurvey() {
        this.props.ChangePage("manage-survey")
    }

    changeToManageAnswer() {
        this.props.ChangePage("manage-answer")
    }

    changeToFollowResult() {
        this.props.ChangePage("follow-result")
    }

    render() {
        return (
            <div>
                <aside className="main-sidebar">
                    <section className="sidebar">
                        <br />
                        <div className="user-panel">
                            <div className="pull-left image">
                                <img src={this.props.auth.user.role === "ADMIN" ?
                                    "/dist/img/admin.png"
                                    : this.props.auth.user.role === "RESEARCHER" ?
                                        "/dist/img/researcher.png"
                                        : "/dist/img/responder.png"
                                } className="img-circle" alt="User" />
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
                        <ul className="sidebar-menu" data-widget="tree">
                            <li className="header"></li>

                            <li className={this.props.selected === "survey-profile" ? "active" : ""}>
                                <a onClick={this.changeToSurveyProfile.bind(this)}>
                                    <i className="fa fa-folder" /> <span>ข้อมูลแบบสอบถาม</span>
                                </a>
                            </li>

                            {this.state.checkOwnSurvey ?
                                <li className={this.props.selected === "manage-survey" ? "active" : ""}>
                                    <a onClick={this.changeToManageSurvey.bind(this)}>
                                        <i className="fa fa-folder" /> <span>จัดการแบบสอบถาม</span>
                                    </a>
                                </li>
                                : ""
                            }

                            {this.state.checkOwnSurvey ?
                                <li className={this.props.selected === "manage-answer" ? "active" : ""}>
                                    <a onClick={this.changeToManageAnswer.bind(this)}>
                                        <i className="fa fa-folder" /> <span>จัดการคำตอบ</span>
                                    </a>
                                </li>
                                : ""
                            }

                            {this.state.checkOwnSurvey ?
                                <li className={this.props.selected === "follow-result" ? "active" : ""}>
                                    <a onClick={this.changeToFollowResult.bind(this)}>
                                        <i className="fa fa-folder" /> <span>ติดตามผลการทำแบบสอบถาม</span>
                                    </a>
                                </li>
                                : ""
                            }

                        </ul>
                    </section>
                </aside>
            </div>
        )
    }
}

SideMenu.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(SideMenu);