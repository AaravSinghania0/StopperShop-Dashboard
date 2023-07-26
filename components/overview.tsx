"use client";

import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";

interface OverviewProps {
	data: any[];
}

export const Overview: React.FC<OverviewProps> = ({ data }) => {
	return (
		<ResponsiveContainer width="100%" height={350}>
			<BarChart data={data}>
				<XAxis
					dataKey="name"
					stroke="#888888"
					fontSize={12}
					tickLine
					axisLine
				/>
				<YAxis
					stroke="#888888"
					fontSize={12}
					tickLine
					axisLine
					tickFormatter={(value) => `₹${value}`}
				/>
				<CartesianGrid strokeDasharray="5 5" />
				<Bar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]} />
			</BarChart>
		</ResponsiveContainer>
	);
};
