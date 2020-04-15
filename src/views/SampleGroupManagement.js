import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from 'axios';

import { showComponent } from "../actions/setPageActions";

import ListSurvey from '../components/list/ListSurvey';
import ListTemplate from '../components/list/ListTemplate';

class SampleGroupManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showTemplates: false,
            project: {},
            surveys: [],
            sampleGroup: {},
            listTemplate: []
        }
        this.showGroupDraft = this.showGroupDraft.bind(this);
        this.showGroupSurvey = this.showGroupSurvey.bind(this);
        this.showTemplate = this.showTemplate.bind(this);
        this.showMoreTemplate = this.showMoreTemplate.bind(this);
        this.comeback = this.comeback.bind(this);
        this.goToCreateSurvey = this.goToCreateSurvey.bind(this);
    }

    componentDidMount() {
        const projectId = this.props.match.params.projectId;
        const sampleGroupId = this.props.match.params.sampleGroupId;
        const userId = this.props.auth.user.id;
        console.log(projectId);
        console.log(sampleGroupId);

        this.props.showComponent();

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

        axios.get(`/surveys/group/` + sampleGroupId)
            .then(response => {
                this.setState({
                    surveys: response.data
                })

                console.log(this.state.surveys);
            })
            .catch((error) => {
                console.log(error);
            })

        axios.get(`/sampleGroups/find/` + sampleGroupId)
            .then(response => {
                this.setState({
                    sampleGroup: response.data
                })

                console.log(this.state.sampleGroups);
            })
            .catch((error) => {
                console.log(error);
            })

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

    showGroupSurvey() {
        return (
            this.state.surveys.map(res => {
                if (res.status !== "DRAFT") {
                    return <ListSurvey survey={res} projectId={this.props.match.params.projectId} sampleGroupId={this.props.match.params.sampleGroupId}/>
                }
            })
        )
    }

    showGroupDraft() {
        return (
            this.state.surveys.map(res => {
                if (res.status === "DRAFT") {
                    return <ListSurvey survey={res} projectId={this.props.match.params.projectId} sampleGroupId={this.props.match.params.sampleGroupId}/>
                }
            })
        )
    }

    showTemplate() {
        return (
            this.state.listTemplate.map((res, index) => {
                if (index < 3) {
                    return <ListTemplate template={res} projectId={this.props.match.params.projectId} sampleGroupId={this.props.match.params.sampleGroupId}/>
                }
            })
        )
    }

    showMoreTemplate(indexC) {
        return (
            this.state.listTemplate.map((res, index) => {
                if (((index + 1) / 3) < indexC && ((index + 1) / 3) > (indexC - 1)) {
                    return <ListTemplate template={res} projectId={this.props.match.params.projectId} sampleGroupId={this.props.match.params.sampleGroupId}/>
                }
            })
        )
    }

    comeback() {
        window.location = '/project-management/' + this.props.match.params.projectId;
    }

    goToCreateSurvey() {
        window.location = `/create-survey/${this.props.match.params.projectId}/${this.props.match.params.sampleGroupId}`;
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
                        <li><a onClick={this.comeback}><i className="fa fa-folder-o"></i> {this.state.project.nameProject}</a></li>
                        <li className="active"><i className="fa fa-users"></i> {this.state.sampleGroup.nameSampleGroup}</li>
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
                                        </ul>
                                    </div>
                                </div>
                                {this.showTemplate()}
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

                        </div>
                    }
                </section>
            </div>
        )
    }
}

SampleGroupManagement.propTypes = {
    showComponent: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
});

export default connect(mapStateToProps, { showComponent })(SampleGroupManagement);