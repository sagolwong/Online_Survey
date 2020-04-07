import React, { Component } from 'react'

import Agreement from '../../views/Agreement';
import OnlineSurvey from '../../views/OnlineSurvey';
import ResultSurvey from '../../views/ResultSurvey';

export default class extends Component {
    constructor(props) {
        super(props);

        this.state = {
            step: 1,
            name: ""
        }
        this.showOnlineSurvey = this.showOnlineSurvey.bind(this)
    }

    checked = data => {
        this.setState({
            step: data.step,
            name: data.name
        })
    }

    showOnlineSurvey() {
        if (this.state.step === 1) return <Agreement surveyId={this.props.match.params.surveyId} checked={this.checked} />
        else if (this.state.step === 2) return <OnlineSurvey surveyId={this.props.match.params.surveyId} name={this.state.name} checked={this.checked} />
        else if (this.state.step === 3) return <ResultSurvey surveyId={this.props.match.params.surveyId} name={this.state.name} />
    }

    render() {
        return (
            <div>
                {this.showOnlineSurvey()}
            </div>
        )
    }
}
