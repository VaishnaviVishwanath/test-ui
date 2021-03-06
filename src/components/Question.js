import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import '../../style/style.css'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { setQuestionOption } from '../actions/testActions'
import { questionAttemptStatus } from '../constants'
import '../../style/style.css'

class Question extends React.Component {
    constructor(props) {
        super(props)
        this.state = { selectedOption: "" }
    }
    Handlers = {
        handleOptionSelect: (e) => {
            
            
            let selectedValue = e.target.value
            this.setState({ selectedOption: selectedValue })
            let questionId = this.props.question && this.props.question._id ? this.props.question._id : null

            if (questionId) {
                let attemptObj = {}
                attemptObj['selected'] = selectedValue

                let solution = this.props.question.solution ? this.props.question.solution : null
                if (solution) {
                    if (solution.answer && solution.answer.length) {
                              let answer = solution.answer[0]
                                if (selectedValue === answer) {
                                    attemptObj['status'] = questionAttemptStatus.CORRECT
                                }
                                else {
                                    attemptObj['status'] = questionAttemptStatus.INCORRECT
                                }

                            }
                }
                this.props.setQuestionOption(questionId, attemptObj)
            }
        }
    }

    DataHelpers = {
        getAttemptStatus: () => {
            if (this.props.attempts) {
                let questionId = this.props.question ? this.props.question._id : null
                if (questionId) {
                    let attemptForQuestion = this.props.attempts[questionId]
                    if (attemptForQuestion) {
                        return attemptForQuestion.selected
                    }
                }
            }
            return ""
        }
    }
   
    Renderers = {
        renderQuestionStmt: () => {
            let questionTxt = this.props.question ? this.props.question.questionText : null;
            if (questionTxt) {
                return (<div className="question-stmt">
                    {questionTxt}
                </div>)
            }
        },
        renderOptions: () => {
            let optionElements = []
            let { options } = this.props.question
            let value = this.DataHelpers.getAttemptStatus()
            if (options && options.length) {
                // optionElements.push(<MenuItem></MenuItem>)
                optionElements.push(<MenuItem disabled value="">
                    <em>Select Answer</em>
                </MenuItem>)
                optionElements = optionElements.concat(options.map((option) => {
                    return <MenuItem value={option.label?option.label:option.text} onClick={this.Handlers.handleOptionSelect} name={option.text}>{option.text}</MenuItem>
                }))
            }

           
            return (
                <FormControl>
                    <InputLabel>Select Answer</InputLabel>
                    <Select
                        labelId="demo-simple-select-readonly-label"
                        className="options-select"
                        id="demo-simple-select-readonly"
                        value={value}
                        onChange={this.Handlers.handleOptionSelect}
                        style={{ minWidth: "200px" }}
                        disabled={this.props.testSubmitted}
                    >
                        {optionElements}
                    </Select>
                </FormControl>)
        }
    }

    render() {
        let questionWrapperClass = 'question-wrapper'
        if (this.props.status && this.props.status === questionAttemptStatus.INCORRECT) {
            questionWrapperClass += ' disabled'
        }
        return (
            <div className={questionWrapperClass}>
                {this.Renderers.renderQuestionStmt()}
                {this.Renderers.renderOptions()}
            </div>
        )
    }
}

function mapStateToProps(state) {
    // console.log("question_state",state)
    return { attempts: state.attempts }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setQuestionOption }, dispatch)
}



export default connect(mapStateToProps, mapDispatchToProps)(Question)