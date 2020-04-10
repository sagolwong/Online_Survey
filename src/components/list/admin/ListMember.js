import React, { Component } from 'react'

export default class ListMember extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        };
    }

    render() {
        return (
            <div className={this.state.open ? "box box-info box box-solid" : "box box-primary collapsed-box box-solid"}>
                <div className="box-header with-border">
                    <div onClick={() => this.setState({ open: !this.state.open })}>
                         <h3 className="box-title"><i className="fa fa-user" />&nbsp; {this.props.user.firstname + " " + this.props.user.lastname}</h3>
                    </div>
                   
                    <div className="box-tools">
                        <button type="button" class="btn btn-box-tool" data-widget="remove"><i className="fa fa-trash"></i></button>
                        <button type="button" className="btn btn-box-tool" onClick={() => this.setState({ open: !this.state.open })}><i className={this.state.open ? "fa fa-minus" : "fa fa-plus"} />
                        </button>
                    </div>
                </div>

                <div className="box-body">
                    <div className="row">
                        <div className="col-md-6">
                            <p>อีเมล : </p>
                        </div>
                        <div className="col-md-6">
                            <p>{this.props.user.email}</p>
                        </div>
                    </div>
                    {this.props.user.role === "RESEARCHER" ?
                        <div>
                            <div className="row">
                                <div className="col-md-6">
                                    <p>เพศ : </p>
                                </div>
                                <div className="col-md-6">
                                    <p>{this.props.user.gender}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <p>อาชีพ : </p>
                                </div>
                                <div className="col-md-6">
                                    <p>{this.props.user.job}</p>
                                </div>
                            </div>
                        </div>
                        : ""
                    }
                    <div className="row">
                        <div className="col-md-6">
                            <p>ระดับสิทธิ์ : </p>
                        </div>
                        <div className="col-md-6">
                            <p>{this.props.user.role === "RESPONDER" ? "ผู้ตอบแบบสอบถาม" : "ผู้วิจัย"}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
