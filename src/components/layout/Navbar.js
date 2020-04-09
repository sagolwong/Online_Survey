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

    componentDidMount(){
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
                    {/* Logo */}
                    <a href="/requests" className="logo">
                        {/* mini logo for sidebar mini 50x50 pixels */}
                        <span className="logo-mini"><b>OS</b>FR</span>
                        {/* logo for regular state and mobile devices */}
                        <span className="logo-lg"><b>OnlineSurvey</b>_for_Research</span>
                    </a>
                    {/* Header Navbar: style can be found in header.less */}
                    <nav className="navbar navbar-static-top">
                        {/* Sidebar toggle button*/}
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
                        {/* Navbar Right Menu */}
                        <div className="navbar-custom-menu">
                            <ul className="nav navbar-nav">
                                {/* Notifications: style can be found in dropdown.less */}
                                <Can
                                    role={this.props.auth.user.role}
                                    perform="navbar:request"
                                    yes={() => (
                                        <li className="dropdown notifications-menu">
                                            <a href="/requests" >
                                                <i className="fa fa-bell-o" />
                                                <span className="label label-warning">{this.state.countRequests !== 0 ? this.state.countRequests:""}</span>
                                            </a>
                                        </li>
                                    )}
                                    no={() => ""}
                                />

                                {/* แบบสอบถาม */}
                                <Can
                                    role={this.props.auth.user.role}
                                    perform="navbar:survey"
                                    yes={() => (
                                        <li className="dropdown">
                                            <a href="">แบบสอบถาม</a>
                                        </li>
                                    )}
                                    no={() => ""}
                                />
                                {/* โปรเจค */}
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
                                {/* User Account: style can be found in dropdown.less */}
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
                                                {/* User image */}
                                                <li className="user-header">
                                                    <img src="dist/img/user2-160x160.jpg" className="img-circle" alt="User" />
                                                    <p>
                                                        {this.props.auth.user.firstname + " " + this.props.auth.user.lastname} 
                                                        <small>{this.props.auth.user.role}</small>
                                                    </p>
                                                </li>
                                                {/* Menu Footer*/}
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