import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Can from "../rbac/Can";

class Sidebar extends Component {
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
                                <img src="dist/img/user2-160x160.jpg" className="img-circle" alt="User" />
                            </div>
                            <div className="pull-left info">
                                <p>{this.props.auth.user.role === "ADMIN" ? this.props.auth.user.firstname : this.props.auth.user.firstname + " " + this.props.auth.user.lastname}</p>
                                <Can
                                    role={this.props.auth.user.role}
                                    perform="sidebar:link-profile"
                                    yes={() => (<a href="/">ดูโปรไฟล์ของคุณ</a>)}
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
                                        <a href="/">
                                            <i className="fa fa-dashboard" /> <span>โปรเจคล่าสุด</span>
                                            <span className="pull-right-container">
                                                <i className="fa fa-angle-left pull-right" />
                                            </span>
                                        </a>
                                        <ul className="treeview-menu">
                                            <li><a href="index.html"><i className="fa fa-circle-o" /> Dashboard v1</a></li>
                                            <li><a href="index2.html"><i className="fa fa-circle-o" /> Dashboard v2</a></li>
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
                                        <a href="/">
                                            <i className="fa fa-pie-chart" />
                                            <span>แบบสอบถามที่ทำครั้งล่าสุด</span>
                                            <span className="pull-right-container">
                                                <i className="fa fa-angle-left pull-right" />
                                            </span>
                                        </a>
                                        <ul className="treeview-menu">
                                            <li><a href="pages/charts/chartjs.html"><i className="fa fa-circle-o" /> ChartJS</a></li>
                                            <li><a href="pages/charts/morris.html"><i className="fa fa-circle-o" /> Morris</a></li>
                                            <li><a href="pages/charts/flot.html"><i className="fa fa-circle-o" /> Flot</a></li>
                                            <li><a href="pages/charts/inline.html"><i className="fa fa-circle-o" /> Inline charts</a></li>
                                        </ul>
                                    </li>
                                )}
                                no={() => ""}
                            />

                        </ul>
                    </section>
                    {/* /.sidebar */}
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