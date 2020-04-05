import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from "prop-types";

import { addStep2, backToStep1, addDraftStep2 } from "../../actions/surveyActions";

import * as SurveyJSCreator from "survey-creator";
import * as SurveyKo from "survey-knockout";
import "survey-creator/survey-creator.css";

import "jquery-ui/themes/base/all.css";
import "nouislider/distribute/nouislider.css";
import "select2/dist/css/select2.css";
import "bootstrap-slider/dist/css/bootstrap-slider.css";

import "jquery-bar-rating/dist/themes/css-stars.css";
import "jquery-bar-rating/dist/themes/fontawesome-stars.css";

import $ from "jquery";
import "jquery-ui/ui/widgets/datepicker.js";
import "select2/dist/js/select2.js";
import "jquery-bar-rating";

import "icheck/skins/square/blue.css";

import * as widgets from "surveyjs-widgets";

SurveyJSCreator.StylesManager.applyTheme("default");

widgets.icheck(SurveyKo, $);
widgets.select2(SurveyKo, $);
widgets.inputmask(SurveyKo);
widgets.jquerybarrating(SurveyKo, $);
widgets.jqueryuidatepicker(SurveyKo, $);
widgets.nouislider(SurveyKo);
widgets.select2tagbox(SurveyKo, $);
widgets.signaturepad(SurveyKo);
widgets.sortablejs(SurveyKo);
widgets.ckeditor(SurveyKo);
widgets.autocomplete(SurveyKo, $);
widgets.bootstrapslider(SurveyKo);

class SurveyCreator extends Component {
    surveyCreator;
    componentDidMount() {
        let options = { showEmbededSurveyTab: false };
        this.surveyCreator = new SurveyJSCreator.SurveyCreator(
            "surveyCreatorContainer",
            options
        );
        this.surveyCreator.saveSurveyFunc = this.saveMySurvey;
        console.log(JSON.parse(JSON.stringify(this.surveyCreator.text)));
        if (this.props.survey.data[0] !== undefined) {
            window.localStorage.setItem("LocalStorageSurvey", this.props.survey.data);
            this.surveyCreator.text = window.localStorage.getItem("LocalStorageSurvey") || "";
        }
        console.log(window.localStorage.getItem("LocalStorageSurvey") || "");
        window.localStorage.removeItem("LocalStorageSurvey");
    }

    saveDraft() {
        console.log(JSON.parse(JSON.stringify(this.surveyCreator.text)));
        //window.localStorage.setItem("LocalStorageSurvey", this.surveyCreator.text);
        let builtIns = [];
        let formSurvey;

        if (this.props.builtIns.builtInWidgetGender) {
            builtIns = builtIns.concat({ builtInWidget: "gender" })
        }
        if (this.props.builtIns.builtInWidgetAges) {
            builtIns = builtIns.concat({ builtInWidget: "ages" })
        }
        if (this.props.builtIns.builtInWidgetStatus) {
            builtIns = builtIns.concat({ builtInWidget: "status" })
        }
        if (this.props.builtIns.builtInWidgetEducation) {
            builtIns = builtIns.concat({ builtInWidget: "education" })
        }
        if (this.props.builtIns.builtInWidgetJob) {
            builtIns = builtIns.concat({ builtInWidget: "job" })
        }
        if (this.props.builtIns.builtInWidgetIncome) {
            builtIns = builtIns.concat({ builtInWidget: "income" })
        }
        console.log(builtIns)

        if (builtIns[0] !== undefined) {
            formSurvey = {
                data: JSON.parse(JSON.stringify(this.surveyCreator.text)),
                builtIns: builtIns,
                status: "DRAFT"
            }
        } else {
            formSurvey = {
                data: JSON.parse(JSON.stringify(this.surveyCreator.text)),
                status: "DRAFT"
            }
        }
        console.log(formSurvey)

        this.props.addDraftStep2(formSurvey);

    }

    render() {
        return (
            <div>
                <div id="surveyCreatorContainer" /><br></br>
                <button className="btn btn-danger" onClick={() => this.props.backToStep1()}>ย้อนกลับ</button>&nbsp;
                <button className="btn btn-warning" onClick={this.saveDraft.bind(this)}>บันทึกแบบร่าง</button>&nbsp;
                <button className="btn btn-info" onClick={this.saveMySurvey}>ต่อไป</button>
            </div>
        )
    }

    saveMySurvey = () => {
        console.log(JSON.parse(JSON.stringify(this.surveyCreator.text)));

        let builtIns = [];
        let formSurvey;

        if (this.props.builtIns.builtInWidgetGender) {
            builtIns = builtIns.concat({ builtInWidget: "gender" })
        }
        if (this.props.builtIns.builtInWidgetAges) {
            builtIns = builtIns.concat({ builtInWidget: "ages" })
        }
        if (this.props.builtIns.builtInWidgetStatus) {
            builtIns = builtIns.concat({ builtInWidget: "status" })
        }
        if (this.props.builtIns.builtInWidgetEducation) {
            builtIns = builtIns.concat({ builtInWidget: "education" })
        }
        if (this.props.builtIns.builtInWidgetJob) {
            builtIns = builtIns.concat({ builtInWidget: "job" })
        }
        if (this.props.builtIns.builtInWidgetIncome) {
            builtIns = builtIns.concat({ builtInWidget: "income" })
        }
        console.log(builtIns)

        if (builtIns[0] !== undefined) {
            formSurvey = {
                data: JSON.parse(JSON.stringify(this.surveyCreator.text)),
                builtIns: builtIns
            }
        } else {
            formSurvey = {
                data: JSON.parse(JSON.stringify(this.surveyCreator.text))
            }
        }
        console.log(formSurvey)

        this.props.addStep2(formSurvey);
    };
}

SurveyCreator.propTypes = {
    addStep2: PropTypes.func.isRequired,
    addDraftStep2: PropTypes.func.isRequired,
    backToStep1: PropTypes.func.isRequired,
    survey: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    survey: state.survey
});
export default connect(mapStateToProps, { addStep2, backToStep1, addDraftStep2 })(SurveyCreator);