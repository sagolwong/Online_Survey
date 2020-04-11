import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from 'axios';

import Can from "../rbac/Can";
import { logoutUser } from "../../actions/authActions";
import { setBlankPage } from "../../actions/setPageActions";

class Navbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            countRequests: 0
        };
    }

    componentDidMount() {
        const userId = this.props.auth.user.id;

        axios.get('/requests/count/' + userId)
            .then(response => {
                this.setState({
                    countRequests: response.data
                })
                console.log(this.state.countRequests)
            })
            .catch((error) => {
                console.log(error);
            })
    }

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
        this.props.setBlankPage();
    };

    render() {
        return (
            <div>
                <header className="main-header">
                    <Can
                        role={this.props.auth.user.role}
                        perform="navbar:banner"
                        yes={() => (
                            <a href="/requests" className="logo">
                                <span className="logo-mini"><b>OS</b>FR</span>
                                <span className="logo-lg"><b>OnlineSurvey</b>_for_Research</span>
                            </a>
                        )}
                        no={() => (
                            <a href="/" className="logo">
                                <span className="logo-mini"><b>OS</b>FR</span>
                                <span className="logo-lg"><b>OnlineSurvey</b>_for_Research</span>
                            </a>
                        )}
                    />
                    <nav className="navbar navbar-static-top">
                        <Can
                            role={this.props.auth.user.role}
                            perform="navbar:toggle-button"
                            yes={() => (
                                <a href="/requests" className="sidebar-toggle" data-toggle="push-menu" role="button">
                                    <span className="sr-only">Toggle navigation</span>
                                </a>
                            )}
                            no={() => ""}
                        />
                        <div className="navbar-custom-menu">
                            <ul className="nav navbar-nav">
                                <Can
                                    role={this.props.auth.user.role}
                                    perform="navbar:create-project"
                                    yes={() => (
                                        <li className="dropdown notifications-menu">
                                            <button
                                                style={{ marginTop: "11%", marginRight: "10px" }}
                                                className="btn btn-info btn-sm"
                                                onClick={() => window.location = "/create-project"}>
                                                สร้างโปรเจค
                                            </button>
                                        </li>
                                    )}
                                    no={() => (
                                        <li className="dropdown notifications-menu">
                                            <button
                                                style={{ marginTop: "11%", marginRight: "10px" }}
                                                className="btn btn-info btn-sm"
                                                onClick={() => window.location = "/user-profile"}>
                                                อัพเกรด
                                            </button>
                                        </li>
                                    )}
                                />

                                <Can
                                    role={this.props.auth.user.role}
                                    perform="navbar:request"
                                    yes={() => (
                                        <li className="dropdown notifications-menu">
                                            <a href="/requests" >
                                                <i className="fa fa-envelope-o" />
                                                <span className="label label-warning">{this.state.countRequests !== 0 ? this.state.countRequests : ""}</span>
                                            </a>
                                        </li>
                                    )}
                                    no={() => ""}
                                />

                                <Can
                                    role={this.props.auth.user.role}
                                    perform="navbar:survey"
                                    yes={() => (
                                        <li className="dropdown">
                                            <a href="/surveys">แบบสอบถาม</a>
                                        </li>
                                    )}
                                    no={() => ""}
                                />

                                <Can
                                    role={this.props.auth.user.role}
                                    perform="navbar:project"
                                    yes={() => (
                                        <li className="dropdown">
                                            <a href="/projects">โปรเจค</a>
                                        </li>
                                    )}
                                    no={() => ""}
                                />

                                <Can
                                    role={this.props.auth.user.role}
                                    perform="navbar:user"
                                    yes={() => (
                                        <li className="dropdown user user-menu">
                                            <a href="/" className="dropdown-toggle" data-toggle="dropdown">
                                                <img src="/dist/img/user2-160x160.jpg" className="user-image" alt="User" />
                                                <span className="hidden-xs">
                                                    {this.props.auth.user.role === "ADMIN" ? this.props.auth.user.firstname : this.props.auth.user.firstname + " " + this.props.auth.user.lastname}
                                                </span>
                                            </a>
                                            <ul className="dropdown-menu">
                                                <li className="user-header">
                                                    <img src="/dist/img/user2-160x160.jpg" className="img-circle" alt="User" />
                                                    <p>
                                                        {this.props.auth.user.firstname + " " + this.props.auth.user.lastname}
                                                        <small>{this.props.auth.user.role}</small>
                                                    </p>
                                                </li>

                                                <li className="user-footer">
                                                    <div className="pull-left">
                                                        <a href="/user-profile" className="btn btn-default btn-flat">โปรไฟล์</a>
                                                    </div>
                                                    <div className="pull-right">
                                                        <a onClick={this.onLogoutClick} className="btn btn-default btn-flat">ออกจากระบบ</a>
                                                    </div>
                                                </li>
                                            </ul>
                                        </li>
                                    )}
                                    no={() => ""}
                                />

                            </ul>
                        </div>
                    </nav>
                    {console.log(this.props.auth.isAuthenticated)}
                    {console.log(this.props.auth.user.role)}
                </header>
            </div>

        )
    }
}
Navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    setBlankPage: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(mapStateToProps, { logoutUser, setBlankPage })(Navbar);