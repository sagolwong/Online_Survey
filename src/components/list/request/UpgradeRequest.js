import React, { Component } from 'react'
import axios from 'axios';

export default class UpgradeRequest extends Component {
    constructor(props) {
        super(props);

        this.state = {
            profile: {},
            check: ""
        };
        this.agree = this.agree.bind(this);
        this.disagree = this.disagree.bind(this);
    }

    componentDidMount() {
        const userId = this.props.upgradeRequest.data[0];

        axios.get('/users/' + userId)
            .then(response => {
                this.setState({
                    profile: response.data
                })
                console.log(this.state.profile);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    async agree() {
        const userId = this.props.upgradeRequest.data[0];
        var upgrade = await {
            gender: this.props.upgradeRequest.data[1],
            job: this.props.upgradeRequest.data[2],
        }
        console.log(upgrade)
        await axios.post(`/users/upgrade/${userId}`, upgrade)
            .then(res => {
                this.setState({
                    check: res.data
                })
                console.log(res.data)
            });

        if (await this.state.check === "User upgrade!") {
            axios.delete('/requests/' + this.props.upgradeRequest._id)
                .then(res => console.log(res.data));
        }
        window.location = '/requests';
    }

    disagree() {
        axios.delete('/requests/' + this.props.upgradeRequest._id)
            .then(res => console.log(res.data));

        window.location = '/requests';
    }

    render() {
        return (
            <div className="box box-widget collapsed-box">
                <div className="box-header with-border">
                    <div className="user-block">
                        <img className="img-circle" src={this.state.profile.role === "ADMIN" ?
                            "/dist/img/admin.png"
                            : this.state.profile.role === "RESEARCHER" ?
                                "/dist/img/researcher.png"
                                : "/dist/img/responder.png"
                        } alt="User" />
                        <span className="username"><a onClick={() => window.location = "/user-profile/" + this.state.profile._id}>{this.state.profile.firstname} {this.state.profile.lastname} </a></span>
                        <span className="description">ต้องการอัพเกรดเป็นนักวิจัย</span>
                    </div>
                    <div className="box-tools">
                        <button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-plus" />
                        </button>
                    </div>
                </div>

                <div className="box-body">
                    <div className="row-md-6">
                        <div className="col-md-6">
                            <p>เพศ :</p>
                        </div>
                        <div className="col-md-6">
                            <p>{this.props.upgradeRequest.data[1]}</p>
                        </div>
                    </div>
                    <div className="row-md-6">
                        <div className="col-md-6">
                            <p>อาชีพ :</p>
                        </div>
                        <div className="col-md-6">
                            <p>{this.props.upgradeRequest.data[2]}</p>
                        </div>
                    </div>
                    <div className="row-md-6">
                        <div className="col-md-6">
                            <p>ทำไมถึงอยากยกระดับเป็นผู้วิจัย :</p>
                        </div>
                        <div className="col-md-6">
                            <p>{this.props.upgradeRequest.data[3]}</p>
                        </div>
                    </div>
                </div>

                <div className="box-footer">
                    <div className="row-md-6">
                        <div className="col-md-6">
                            <button style={{ width: "200px" }} className="btn btn-primary" onClick={this.agree}>อนุญาต</button>
                        </div>
                        <div className="col-md-6">
                            <button style={{ width: "200px" }} className="btn btn-danger" onClick={this.disagree}>ปฏิเสธ</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
