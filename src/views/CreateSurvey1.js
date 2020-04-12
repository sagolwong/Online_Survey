import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { addStep1, addDraftStep1 } from "../actions/surveyActions";

class CreateSurvey1 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            surveyName: "",
            description: "",
            shareTo: "",
            wantName: false,
            haveGroup: false,
        }
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        // set old value
        if (this.props.survey.nameSurvey !== "") {
            this.setState({ surveyName: this.props.survey.nameSurvey })
        }
        if (this.props.survey.description !== "") {
            this.setState({ description: this.props.survey.description })
        }
        if (this.props.survey.shareTo !== "") {
            this.setState({ shareTo: this.props.survey.shareTo })
        }
        if (this.props.survey.wantName !== "") {
            this.setState({ wantName: this.props.survey.wantName })
        }
        if (this.props.survey.haveGroup !== "") {
            this.setState({ haveGroup: this.props.survey.haveGroup })
        }
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    }

    onChangeWantName = () => this.setState({ wantName: !this.state.wantName })

    onChangeHaveGroup = () => this.setState({ haveGroup: !this.state.haveGroup })

    onSubmit(e) {
        e.preventDefault();
        console.log(this.state)

        const data = {
            surveyName: this.state.surveyName,
            description: this.state.description,
            shareTo: this.state.shareTo,
            wantName: this.state.wantName,
            haveGroup: this.state.haveGroup,
        }

        this.props.addStep1(data);
    }

    saveDraft() {
        const data = {
            surveyName: this.state.surveyName,
            description: this.state.description,
            shareTo: this.state.shareTo,
            wantName: this.state.wantName,
            haveGroup: this.state.haveGroup,
            status: "DRAFT"
        }
        //console.log(data);
        this.props.addDraftStep1(data);
    }

    render() {
        return (
            <div style={{ height: "570px" }}>
                <section className="content-header">
                    <div className="progress active">
                        <div className="progress-bar progress-bar-info progress-bar-striped" role="progressbar" aria-valuenow={25} aria-valuemin={0} aria-valuemax={100} style={{ width: '25%' }}>
                            <span className="sr-only">STEP 1</span>
                        </div>
                    </div>
                    <h3>ส่วนที่ 1 : ข้อมูลทั่วไป</h3>
                </section>

                <section className="content">
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <h3 className="box-title">สร้างแบบสอบถามใหม่</h3>
                        </div>

                        <div className="box-body">
                            <div className="form-group">
                                <label>ชื่อแบบสอบถาม :</label>
                                <input required
                                    type="text"
                                    id="surveyName"
                                    className="form-control"
                                    placeholder="โปรดกรอกชื่อแบบสอบถาม"
                                    value={this.state.surveyName}
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>คำอธิบาย :</label>
                                <textarea
                                    id="description"
                                    className="form-control"
                                    placeholder="โปรดกรอกคำอธิบายแบบสอบถาม"
                                    value={this.state.description}
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>ผู้มีสิทธิทำแบบสอบถาม :</label>
                                <select required
                                    id="shareTo"
                                    className="form-control"
                                    value={this.state.shareTo}
                                    onChange={this.onChange}>
                                    <option>ต้องการแสดงผลแบบใด?</option>
                                    <option value="CLOSE">กลุ่มปิด</option>
                                    <option value="OPEN">กลุ่มเปิด</option>
                                    <option value="PUBLIC">กลุ่มสาธารณะ</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>
                                    <input
                                        id="wantName"
                                        type="checkbox"
                                        className="flat-green"
                                        checked={this.state.wantName}
                                        onChange={this.onChangeWantName}
                                    /> ต้องการทราบชื่อผู้ทำแบบสอบถาม
                                    </label>
                            </div>
                            {this.state.shareTo !== "PUBLIC" && this.state.shareTo !== "" ?
                                <div className="form-group">
                                    <label>
                                        <input
                                            id="haveGroup"
                                            type="checkbox"
                                            className="flat-green"
                                            checked={this.state.haveGroup}
                                            onChange={this.onChangeHaveGroup}
                                        /> ต้องการให้มีสมาชิกเข้าร่วมกลุ่มทำแบบสอบถาม
                                        </label>
                                </div>
                                : ""}
                        </div>
                    </div>
                    {this.state.surveyName !== "" ?
                        <div>
                            <button className="btn btn-warning" onClick={this.saveDraft.bind(this)}>บันทึกแบบร่าง</button> &nbsp;
                            <button className="btn btn-info" onClick={this.onSubmit}>ต่อไป</button>
                        </div>
                        :
                        <div>
                            <button className="btn btn-warning" disabled>บันทึกแบบร่าง</button> &nbsp;
                            <button className="btn btn-info" disabled>ต่อไป</button>
                        </div>
                    }
                </section>
            </div>
        );
    }
}

CreateSurvey1.propTypes = {
    addStep1: PropTypes.func.isRequired,
    addDraftStep1: PropTypes.func.isRequired,
    survey: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    survey: state.survey
});

export default connect(mapStateToProps, { addStep1, addDraftStep1 })(CreateSurvey1);