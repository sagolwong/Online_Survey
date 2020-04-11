import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from 'axios'

import { showComponent } from "../actions/setPageActions";
import ListProject from '../components/list/ListProject';

class Projects extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projects: [],
        }
    }

    componentDidMount() {
        const userId = this.props.auth.user.id;

        this.props.showComponent();

        axios.get(`/projects/find/` + userId)
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

    goToCreateProject(){
        window.location = `/create-project`;
    }

    render() {
        return (
            <div className="content-wrapper">
                <section className="content-header">
                    <h1>
                        โปรเจค
                    </h1>
                    <ol className="breadcrumb">
                        <li ><a href="/requests"><i className="fa fa-envelope-o"></i> คำร้องขอ</a></li>
                        <li className="active">โปรเจค</li>
                    </ol>
                </section>
                <br />
                <section className="content">

                    <div className="box box-warning box-solid">
                        <div className="box-header with-border">
                            <h3 className="box-title">รายการโปรเจค</h3>
                        </div>
                    </div>

                    <div className="box  box-solid">
                        <div className="listCreate" onClick={this.goToCreateProject.bind(this)}>
                            <div className="box-body" align="center">
                                <i className="fa fa-plus-circle" /> เพิ่มโปรเจคใหม่
                            </div>
                        </div>
                    </div>
                    
                    {this.showGroupProject()}
                </section>
            </div>
        )
    }
}

Projects.propTypes = {
    showComponent: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { showComponent })(Projects);
