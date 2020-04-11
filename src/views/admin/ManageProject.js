import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from 'axios';

import { showComponent } from "../../actions/setPageActions";

import ListProject from '../../components/list/ListProject';

class ManageProject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projects: [],
        }
    }

    componentDidMount() {
        this.props.showComponent();

        axios.get(`/projects/`)
            .then(response => {
                this.setState({
                    projects: response.data
                })

                console.log(this.state.projects);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    showGroupProject() {
        return (
            this.state.projects.map(res => {
                return <ListProject project={res} />
            })
        )
    }

    render() {
        return (
            <div className="content-wrapper">
                <section className="content-header">
                    <h1>
                        จัดการโปรเจคทั้งหมด
                    </h1>
                    <ol className="breadcrumb">
                        <li ><a href="/requests"><i className="fa fa-envelope-o" /> คำร้องขอ</a></li>
                        <li className="active"><i className="fa fa-folder-open"></i> จัดการโปรเจคทั้งหมด</li>
                    </ol>
                </section>
                <br />
                <section className="content">

                    <div className="box box-warning box-solid">
                        <div className="box-header with-border">
                            <h3 className="box-title">รายการโปรเจค</h3>
                        </div>
                    </div>

                    {this.showGroupProject()}
                </section>
            </div>
        )
    }
}

ManageProject.propTypes = {
    showComponent: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { showComponent })(ManageProject);