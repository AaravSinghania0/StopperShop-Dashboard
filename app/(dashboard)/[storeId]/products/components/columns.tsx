"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type ProductColumn = {
	id: string;
	name: string;
	price: string;
	category: string;
	size: string;
	color: string;
	createdAt: string;
	isFeatured: boolean;
	isArchived: boolean;
};

export const columns: ColumnDef<ProductColumn>[] = [
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "isFeatured",
		header: "Featured",
		cell: ({ row }) => (
			<div className="text-center">
				{row.original.isFeatured ? "Yes" : "No"}
			</div>
		),
	},
	{
		accessorKey: "isArchived",
		header: "Archived",
		cell: ({ row }) => (
			<div className="text-center">
				{row.original.isArchived ? "Yes" : "No"}
			</div>
		),
	},
	{
		accessorKey: "price",
		header: "Price",
	},
	{
		accessorKey: "category",
		header: "Category",
	},
	{
		accessorKey: "size",
		header: "Size",
	},
	{
		accessorKey: "color",
		header: "Color",
		cell: ({ row }) => (
			<div className="flex items-center gap-x-2">
				{row.original.color}
				<div
					className="h-6 w-6 rounded-md border"
					style={{ backgroundColor: row.original.color }}
				/>
			</div>
		),
	},
	{
		accessorKey: "createdAt",
		header: "Date",
	},
	{
		id: "actions",
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
