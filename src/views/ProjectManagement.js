import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from 'axios';

import { showComponent } from "../actions/setPageActions";

import ListSampleGroup from '../components/list/ListSampleGroup';
import ListSurvey from '../components/list/ListSurvey';
import ListTemplate from '../components/list/ListTemplate';

class ProjectManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showTemplates: false,
            nameSampleGroup: "",
            project: {},
            surveys: [],
            sampleGroups: [],
            listTemplate: []
        }
        this.createSampleGroup = this.createSampleGroup.bind(this);
        this.showGroupDraft = this.showGroupDraft.bind(this);
        this.showGroupSurvey = this.showGroupSurvey.bind(this);
        this.showTemplate = this.showTemplate.bind(this);
        this.showMoreTemplate = this.showMoreTemplate.bind(this);
        this.showGroupSampleGroup = this.showGroupSampleGroup.bind(this);
        this.goToCreateSurvey = this.goToCreateSurvey.bind(this);
    }

    componentDidMount() {
        const projectId = this.props.match.params.projectId;
        const userId = this.props.auth.user.id;

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

        // GET Collection survey
        axios.get(`/surveys/` + projectId)
            .then(response => {
                this.setState({
                    surveys: response.data
                })

                console.log(this.state.surveys);
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

        //GET Collection template
        axios.get('/templates/' + userId)
            .then(response => {
                this.setState({
                    listTemplate: response.data
                })
                console.log(this.state.listTemplate)
            })
            .catch((error) => {
                console.log(error);
            })
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevState.success !== this.state.success) {
            await axios.get(`http://localhost:5000/sampleGroups/` + this.props.match.params.projectId)
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

    showGroupSurvey() {
        return (
            this.state.surveys.map(res => {
                if (res.sampleGroupId === "") {
                    if (res.status !== "DRAFT") {
                        return <ListSurvey survey={res} projectId={this.props.match.params.projectId}/>
                    }
                }
            })
        )
    }

    showGroupDraft() {
        return (
            this.state.surveys.map(res => {
                if (res.sampleGroupId === "") {
                    if (res.status === "DRAFT") {
                        return <ListSurvey survey={res} projectId={this.props.match.params.projectId}/>
                    }
                }
            })
        )
    }

    showGroupSampleGroup() {
        return (
            this.state.sampleGroups.map(res => {
                return <ListSampleGroup sampleGroup={res} projectId={this.props.match.params.projectId} />
            })
        )
    }

    showTemplate() {
        return (
            this.state.listTemplate.map((res, index) => {
                if (index < 3) {
                    return <ListTemplate template={res} projectId={this.props.match.params.projectId} />
                }
            })
        )
    }

    showMoreTemplate(indexC) {
        return (
            this.state.listTemplate.map((res, index) => {
                if (((index + 1) / 3) < indexC && ((index + 1) / 3) > (indexC - 1)) {
                    return <ListTemplate template={res} projectId={this.props.match.params.projectId} />
                }
            })
        )
    }

    goToCreateSurvey() {
        window.location = '/create-survey/' + this.props.match.params.projectId;
    }

    render() {
        var indexC = 2;
        return (
            <div className="content-wrapper">
                <section className="content-header">
                    <h1>
                        <i className="fa fa-folder-o" /> {this.state.project.nameProject}
                    </h1>
                    <ol className="breadcrumb">
                        <li ><a href="/requests"><i className="fa fa-envelope-o"></i> คำร้องขอ</a></li>
                        <li ><a href="/projects"><i className="fa fa-folder-open-o"></i> โปรเจค</a></li>
                        <li className="active"><i className="fa fa-folder-o"></i> {this.state.project.nameProject}</li>
                    </ol>
                </section>
                <section className="content">
                    <div className="row">
                        <div className="bg-template">
                            <div className="row">
                                {this.state.showTemplates ?
                                    <div className="col-md-6 pull-right">
                                        <button className="btn btn-link pull-right" onClick={() => this.setState({ showTemplates: false })}>
                                            แสดงแม่แบบน้อยลง <i className="fa fa-angle-up" />
                                        </button>
                                    </div>
                                    : <div className="col-md-6 pull-right">
                                        <button className="btn btn-link pull-right" onClick={() => this.setState({ showTemplates: true })}>
                                            แสดงแม่แบบเพิ่มเติม <i className="fa fa-angle-down" />
                                        </button>
                                    </div>
                                }
                            </div>
                            <div className="row">
                                <div className="col-md-3 col-sm-6 col-xs-12">
                                    <div className="input-group-btn">
                                        <button type="button"
                                            className="btn btn-info btn-lg dropdown-toggle"
                                            data-toggle="dropdown"
                                            style={{
                                                height: "80px",
                                                marginLeft: "20%",
                                            }}>
                                            สร้าง <i className="fa fa-plus" />
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li><a onClick={this.goToCreateSurvey}>สร้างแบบสอบถาม</a></li>
                                            <li><a data-toggle="modal" data-target="#modal-default">สร้างกลุ่มตัวอย่าง</a></li>
                                        </ul>
                                    </div>
                                </div>
                                {this.showTemplate()}
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

                    {this.state.showTemplates ?
                        <div className="row">
                            <div className="bg-template-full">
                                <br />
                                {this.state.listTemplate.map((res, index) => {
                                    if (((index + 1) / 3) < indexC && ((index + 1) / 3) > (indexC - 1)) {
                                        indexC = indexC + 1;
                                        return (
                                            <div className="row-md-8" style={{ marginLeft: "35px" }}>
                                                <h4 style={{ marginLeft: "15px" }}>แม่แบบเพิ่มเติม</h4>
                                                {this.showMoreTemplate(indexC - 1)}
                                            </div>
                                        )
                                    }
                                })}
                            </div>
                        </div>
                        :
                        <div className="row-md-8" style={{ marginLeft: "15px" }}>
                            <div className="row">
                                <h4 style={{ marginLeft: "10px" }}>แบบร่าง</h4>
                                {this.showGroupDraft()}
                            </div>

                            <div className="row">
                                <h4 style={{ marginLeft: "10px" }}>แบบสอบถาม</h4>
                                {this.showGroupSurvey()}
                            </div>

                            <div className="row">
                                <h4 style={{ marginLeft: "10px" }}>กลุ่มตัวอย่าง</h4>
                                {this.showGroupSampleGroup()}
                            </div>
                        </div>
                    }
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
    auth: state.auth,
});

export default connect(mapStateToProps, { showComponent })(ProjectManagement);