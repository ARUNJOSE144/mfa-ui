import React, { Component } from 'react';
import {
    ResponsiveContainer,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Bar
} from 'recharts'

export default class TargetChart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: this.getData()
        }
    }

    render() {
        const { data } = this.state;
        return (
            <div style={{ height: '170px' }}>
                <ResponsiveContainer height='100%' width='100%'>
                    <BarChart data={data} margin={{ top: 15, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="1 5" stroke="#26A1FD" vertical={false} />
                        <XAxis dataKey="name" stroke="#26A1FD" fontSize={8} />
                        <YAxis hide />
                        <Tooltip />
                        <Legend />
                        <Bar barSize={15} dataKey="Achieved" fill="#B9EA88" />
                        <Bar barSize={15} dataKey="Target" fill="#7AB931" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        )
    }

    // functions to be removed **************************************
    getData() {
        const data = [
            { name: '3G Sim', Target: 4000, Achieved: 2400, amt: 2400 },
            { name: 'Recharge Coupons', Target: 3000, Achieved: 1398, amt: 2210 },
            { name: 'Iphone 6S', Target: 9000, Achieved: 2800, amt: 2290 },
            { name: 'Pre-Paid Cards', Target: 3780, Achieved: 1308, amt: 2000 },
            { name: 'Routers', Target: 4890, Achieved: 3800, amt: 2181 }
        ];
        return data;
    }
    // **************************************************************

}