import React, { Component } from 'react'

export default class ErrorPage extends Component {
    render() {
        return (
            <div className="content-wraper">
                <h1>คุณไม่มีสิทธิ์เข้าถึงการทำงานส่วนนี้</h1>
                <a href="/requests"><button>กลับสู่หน้าหลัก</button></a>
            </div>
        )
    }
}
