import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from 'axios';

import { showComponent } from "../actions/setPageActions";
import ListSampleGroup from '../components/list/ListSampleGroup';

class ProjectManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            success: false,
            checkShowPrototype: false,
            nameSampleGroup: "",
            project: {},
            surveys: [],
            sampleGroups: [],
            listPrototype: []
        }
        this.createSampleGroup = this.createSampleGroup.bind(this);
        this.showGroupSampleGroup = this.showGroupSampleGroup.bind(this);
    }

    componentDidMount() {
        const projectId = this.props.match.params.projectId;

        this.props.showComponent();

        // GET Collection project
        axios.get(`/projects/` + projectId)
            .then(response => {
                this.setState({
                    project: response.data
                })

                console.log(this.state.project);
            })
            .catch((error) => {
                console.log(error);
            })

        //GET Collection sampleGroup
        axios.get(`/sampleGroups/` + projectId)
            .then(response => {
                this.setState({
                    sampleGroups: response.data
                })
                console.log(this.state.sampleGroups);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    async createSampleGroup(e) {
        console.log(this.state.nameSampleGroup);
        const data = {
            nameSampleGroup: this.state.nameSampleGroup
        }
        console.log(data);
        const projectId = this.props.match.params.projectId;
        axios.post(`/sampleGroups/createSampleGroup/${projectId}`, data)
            .then(res => console.log(res.data));

    }

    showGroupSampleGroup() {
        return (
            this.state.sampleGroups.map(res => {
                return <ListSampleGroup sampleGroup={res} projectId={this.props.match.params.projectId} />
            })
        )
    }


    render() {
        return (
            <div className="content-wrapper">
                <section className="content-header">
                    <h1>
                        <i className="fa fa-folder-o" /> {this.state.project.nameProject}
                    </h1>
                    <ol className="breadcrumb">
                        <li ><a href="/requests"><i className="fa fa-bell-o"></i> คำร้องขอ</a></li>
                        <li ><a href="/projects"><i className="fa fa-folder-o"></i> โปรเจค</a></li>
                        <li className="active">{this.state.project.nameProject}</li>
                    </ol>
                </section>
                <section className="content">
                    <div className="row">
                        <div className="row">
                            <div className="bg-template">
                                <div className="col-md-3 col-sm-6 col-xs-12">
                                    <div className="input-group-btn">
                                        <button type="button"
                                            className="btn btn-info btn-lg dropdown-toggle"
                                            data-toggle="dropdown"
                                            style={{
                                                height: "80px",
                                                marginTop: "15%",
                                                marginLeft: "20%",
                                            }}>
                                            สร้าง <i className="fa fa-plus" />
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li><a href="#">สร้างแบบสอบถาม</a></li>
                                            <li><a data-toggle="modal" data-target="#modal-default">สร้างกลุ่มตัวอย่าง</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="modal fade" id="modal-default">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">×</span></button>
                                        <h4 className="modal-title">ชื่อกลุ่มตัวอย่างใหม่</h4>
                                    </div>

                                    <form onSubmit={this.createSampleGroup}>
                                        <div className="modal-body">
                                            <input type="text"
                                                required
                                                id="nameSampleGroup"
                                                className="form-control"
                                                value={this.state.nameSampleGroup}
                                                onChange={this.onChange}
                                            />
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-default pull-left" data-dismiss="modal">ยกเลิก</button>
                                            <button type="submit" className="btn btn-primary">สร้าง</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="row-md-6">
                            <h4 style={{ marginLeft: "10px" }}>แบบร่าง</h4>
                            <h4 style={{ marginLeft: "10px" }}>แบบสอบถาม</h4>
                            <h4 style={{ marginLeft: "10px" }}>กลุ่มตัวอย่าง</h4>
                            {this.showGroupSampleGroup()}
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

ProjectManagement.propTypes = {
    showComponent: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { showComponent })(ProjectManagement);