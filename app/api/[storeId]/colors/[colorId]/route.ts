import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function GET(
	_req: Request,
	{ params }: { params: { colorId: string } }
) {
	try {
		if (!params.colorId) {
			return new NextResponse("Color ID is required", { status: 400 });
		}

		const color = await prismadb.color.findUnique({
			where: { id: params.colorId },
		});

		return NextResponse.json(color);
	} catch (error) {
		console.log("[COLOR_GET]", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { colorId: string; storeId: string } }
) {
	try {
		const { userId } = auth();
		const body = await req.json();
		const { name, value } = body;
		const { colorId, storeId } = params;

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		if (!name) {
			return new NextResponse("Name is required", { status: 400 });
		}

		if (!value) {
			return new NextResponse("Value is required", { status: 400 });
		}

		if (!colorId) {
			return new NextResponse("Color ID is required", { status: 400 });
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: { id: storeId, userId },
		});

		if (!storeByUserId) {
			return new NextResponse("Forbidden", { status: 403 });
		}

		// can use update or updateMany
		const color = await prismadb.color.updateMany({
			where: { id: colorId },
			data: { name, value },
		});

		return NextResponse.json(color);
	} catch (error) {
		console.log("[COLOR_PATCH]", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}

export async function DELETE(
	_req: Request,
	{ params }: { params: { colorId: string; storeId: string } }
) {
	try {
		const { userId } = auth();
		const { colorId, storeId } = params;

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		if (!colorId) {
			return new NextResponse("Color ID is required", { status: 400 });
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: { id: storeId, userId },
		});

		if (!storeByUserId) {
			return new NextResponse("Forbidden", { status: 403 });
		}

		// can use delete or deleteMany
		const color = await prismadb.color.deleteMany({
			where: { id: colorId },
		});

		return NextResponse.json(color);
	} catch (error) {
		console.log("[COLOR_DELETE]", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
