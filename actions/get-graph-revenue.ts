import prismadb from "@/lib/prismadb";

interface GraphData {
	name: string;
	total: number;
}

export const getGraphRevenue = async (
	storeId: string
): Promise<GraphData[]> => {
	const paidOrders = await prismadb.order.findMany({
		where: { storeId, isPaid: true },
		include: {
			orderItems: { include: { product: true } },
		},
	});

	const monthlyRevenue: { [key: number]: number } = {};

	// Grouping the orders by month and summing the revenue
	for (const order of paidOrders) {
		const month = order.createdAt.getMonth(); // 0 for Jan, 1 for Feb, ...
		let revenueForOrder = 0;

		for (const item of order.orderItems) {
			revenueForOrder += item.product.price.toNumber();
		}

		// Adding the revenue for this order to the respective month
		monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
	}

	// Converting the grouped data into the format expected by the graph
	const graphData: GraphData[] = [
		{ name: "January", total: 0 },
		{ name: "February", total: 0 },
		{ name: "March", total: 0 },
		{ name: "April", total: 0 },
		{ name: "May", total: 0 },
		{ name: "June", total: 0 },
		{ name: "July", total: 0 },
		{ name: "August", total: 0 },
		{ name: "September", total: 0 },
		{ name: "October", total: 0 },
		{ name: "November", total: 0 },
		{ name: "December", total: 0 },
	];

	// Filling in the revenue data
	for (const month in monthlyRevenue) {
		graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
	}

	return graphData;
};
