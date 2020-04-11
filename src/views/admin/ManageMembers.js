import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from 'axios';

import { showComponent } from "../../actions/setPageActions";

import ListMember from '../../components/list/admin/ListMember';

class ManageMembers extends Component {
    constructor(props) {
        super(props);

        this.showListUser = this.showListUser.bind(this);

        this.state = {
            already: false,
            users: [],
            search: "",
            showSearch: false,
            showAll: false
        };
    }

    componentDidMount() {
        this.props.showComponent();

        axios.get(`/users/`)
            .then(response => {
                this.setState({
                    users: response.data
                })

                console.log(this.state.listUser);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    updateSearch(e) {
        this.setState({
            search: e.target.value.substr(0, 20)
        })
        if (this.state.search !== "") this.setState({ showSearch: true, showAll: false })
    }

    showListUser() {
        let filterUser = this.state.users.filter(user => {
            return user.firstname.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
        })
        if (this.state.search !== "") {
            return (
                <div>
                    {filterUser.map(user => {
                        if (user.role !== "ADMIN") {
                            return <div className="col-md-6"><ListMember user={user} /></div>
                        }
                    })}
                </div>
            )
        }
    }

    showAllUser() {
        return (
            this.state.users.map((user, index) => {
                if (user.role !== "ADMIN") {
                    return (
                        <div className="col-md-6"><ListMember user={user} /></div>
                    )
                }
            })
        )
    }

    render() {
        return (
            <div className="content-wrapper">
                <section className="content-header">
                    <h1>
                        จัดการสมาชิกทั้งหมด
                    </h1>
                    <ol className="breadcrumb">
                        <li ><a href="/requests"><i className="fa fa-envelope-o" /> คำร้องขอ</a></li>
                        <li className="active"><i className="fa fa-group"></i> จัดการสมาชิกทั้งหมด</li>
                    </ol>
                </section>
                <br />
                <section className="content">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="input-group">
                                <span className="input-group-addon"><i className="fa fa-search" /></span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="กรอกชื่อผู้ที่คุณต้องการค้นหา"
                                    value={this.state.search}
                                    onChange={this.updateSearch.bind(this)}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <button className="btn btn-success" onClick={() => this.setState({ showSearch: false, showAll: true })}>แสดงสมาชิกทั้งหมด</button>
                        </div>
                    </div>
                    <br /><br />
                    <div className="row">
                        {this.state.showSearch ? this.showListUser() : ""}
                    </div>
                    <div className="row">
                        {this.state.showAll ? this.showAllUser() : ""}
                    </div>
                </section>
            </div>
        )
    }
}

ManageMembers.propTypes = {
    showComponent: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { showComponent })(ManageMembers);