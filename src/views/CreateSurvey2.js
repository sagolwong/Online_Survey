import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";

import SurveyCreator from '../components/creator/SurveyCreator';

class CreateSurvey2 extends Component {
    constructor(props) {
        super(props);

        this.onChangeBuiltInWidgetGender = this.onChangeBuiltInWidgetGender.bind(this);
        this.onChangeBuiltInWidgetAges = this.onChangeBuiltInWidgetAges.bind(this);
        this.onChangeBuiltInWidgetStatus = this.onChangeBuiltInWidgetStatus.bind(this);
        this.onChangeBuiltInWidgetEducation = this.onChangeBuiltInWidgetEducation.bind(this);
        this.onChangeBuiltInWidgetJob = this.onChangeBuiltInWidgetJob.bind(this);
        this.onChangeBuiltInWidgetIncome = this.onChangeBuiltInWidgetIncome.bind(this);


        this.state = {
            builtInWidgetGender: false,
            builtInWidgetAges: false,
            builtInWidgetStatus: false,
            builtInWidgetEducation: false,
            builtInWidgetJob: false,
            builtInWidgetIncome: false,
        };
    }

    componentDidMount() {
        if (this.props.survey.builtIns !== undefined) {
            this.props.survey.builtIns.map(widget => {
                if (widget.builtInWidget === "gender") this.setState({ builtInWidgetGender: true })
                else if (widget.builtInWidget === "ages") this.setState({ builtInWidgetAges: true })
                else if (widget.builtInWidget === "status") this.setState({ builtInWidgetStatus: true })
                else if (widget.builtInWidget === "education") this.setState({ builtInWidgetEducation: true })
                else if (widget.builtInWidget === "job") this.setState({ builtInWidgetJob: true })
                else if (widget.builtInWidget === "income") this.setState({ builtInWidgetIncome: true })
            })
        }
    }

    onChangeBuiltInWidgetGender() {
        this.setState({
            builtInWidgetGender: !this.state.builtInWidgetGender
        })
    }
    onChangeBuiltInWidgetAges() {
        this.setState({
            builtInWidgetAges: !this.state.builtInWidgetAges
        })
    }
    onChangeBuiltInWidgetStatus() {
        this.setState({
            builtInWidgetStatus: !this.state.builtInWidgetStatus
        })
    }
    onChangeBuiltInWidgetEducation() {
        this.setState({
            builtInWidgetEducation: !this.state.builtInWidgetEducation
        })
    }
    onChangeBuiltInWidgetJob() {
        this.setState({
            builtInWidgetJob: !this.state.builtInWidgetJob
        })
    }
    onChangeBuiltInWidgetIncome() {
        this.setState({
            builtInWidgetIncome: !this.state.builtInWidgetIncome
        })
    }

    render() {
        return (
            <div>
                <section className="content-header">
                    <div className="progress active">
                        <div className="progress-bar progress-bar-info progress-bar-striped" role="progressbar" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100} style={{ width: '50%' }}>
                            <span className="sr-only">STEP 2</span>
                        </div>
                    </div>
                    <h3>ส่วนที่ 2 : แบบสอบถาม</h3>
                </section>

                <section className="content">
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <h3 className="box-title">คำถามพื้นฐานสำเร็จรูป</h3>&nbsp;
                            <small>( โปรดเลือกคำถามเกี่ยวกับข้อมูลส่วนตัวจากที่นี่ )</small>
                        </div>

                        <div className="box-body">
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        className="flat-green"
                                        checked={this.state.builtInWidgetGender}
                                        onChange={this.onChangeBuiltInWidgetGender}
                                    /> คำถามเรื่องเพศ
                                </label>
                            </div>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        className="flat-green"
                                        checked={this.state.builtInWidgetAges}
                                        onChange={this.onChangeBuiltInWidgetAges}
                                    /> คำถามเรื่องอายุ
                                </label>
                            </div>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        className="flat-green"
                                        checked={this.state.builtInWidgetStatus}
                                        onChange={this.onChangeBuiltInWidgetStatus}
                                    /> คำถามเรื่องสถานภาพ
                                </label>
                            </div>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        className="flat-green"
                                        checked={this.state.builtInWidgetEducation}
                                        onChange={this.onChangeBuiltInWidgetEducation}
                                    /> คำถามเรื่องระดับการศึกษา
                                </label>
                            </div>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        className="flat-green"
                                        checked={this.state.builtInWidgetJob}
                                        onChange={this.onChangeBuiltInWidgetJob}
                                    /> คำถามเรื่องอาชีพ
                                </label>
                            </div>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        className="flat-green"
                                        checked={this.state.builtInWidgetIncome}
                                        onChange={this.onChangeBuiltInWidgetIncome}
                                    /> คำถามเรื่องรายได้เฉลี่ยต่อเดือน
                                </label>
                            </div>
                        </div>
                    </div>
                    <br />
                    <SurveyCreator builtIns={this.state} />
                </section>
                {console.log(this.props.survey)}
            </div>
        );
    }
}

CreateSurvey2.propTypes = {
    survey: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    survey: state.survey
});
export default connect(mapStateToProps)(CreateSurvey2);