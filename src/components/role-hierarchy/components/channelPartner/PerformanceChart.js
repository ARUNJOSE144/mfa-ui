import React, { Component } from "react";
import {
    ResponsiveContainer,
    LineChart,
    CartesianGrid,
    XAxis,
    Tooltip,
    Line
} from "recharts";

export default class PerformanceChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data : this.getData()
        }
    }

    render() {
        const { data } = this.state;
        return (
            <div style={{ height: "150px" }}>
                <ResponsiveContainer height="100%" width="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 15, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid stroke="#26A1FD" horizontal={false} />
                        <XAxis dataKey="name" stroke="#26A1FD" />
                        {/* <YAxis /> */}
                        <Tooltip />
                        {/* <Legend /> */}
                        <Line type="monotone" dataKey="sale" stroke="#26A1FD" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }

    // functions to be removed **************************************
    getData() {
        const data = [];
        const today = new Date().getDate();
        let name, sale;
        for (let i = 1; i < today; i++) {
            name = (i + "").padStart(2, "0");
            sale = Math.floor(Math.random() * 10) + 1;
            data.push({ name, sale });
        }
        data.push({ name: "today", sale: Math.floor(Math.random() * 10) + 1 });
        return data;
    }
    // **************************************************************
}
