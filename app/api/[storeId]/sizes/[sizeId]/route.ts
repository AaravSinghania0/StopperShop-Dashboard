import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function GET(
	_req: Request,
	{ params }: { params: { sizeId: string } }
) {
	try {
		if (!params.sizeId) {
			return new NextResponse("Size ID is required", { status: 400 });
		}

		const size = await prismadb.size.findUnique({
			where: { id: params.sizeId },
		});

		return NextResponse.json(size);
	} catch (error) {
		console.log("[SIZE_GET]", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { sizeId: string; storeId: string } }
) {
	try {
		const { userId } = auth();
		const body = await req.json();
		const { name, value } = body;
		const { sizeId, storeId } = params;

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		if (!name) {
			return new NextResponse("Name is required", { status: 400 });
		}

		if (!value) {
			return new NextResponse("Value is required", { status: 400 });
		}

		if (!sizeId) {
			return new NextResponse("Size ID is required", { status: 400 });
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: { id: storeId, userId },
		});

		if (!storeByUserId) {
			return new NextResponse("Forbidden", { status: 403 });
		}

		// can use update or updateMany
		const size = await prismadb.size.updateMany({
			where: { id: sizeId },
			data: { name, value },
		});

		return NextResponse.json(size);
	} catch (error) {
		console.log("[SIZE_PATCH]", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}

export async function DELETE(
	_req: Request,
	{ params }: { params: { sizeId: string; storeId: string } }
) {
	try {
		const { userId } = auth();
		const { sizeId, storeId } = params;

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		if (!sizeId) {
			return new NextResponse("Size ID is required", { status: 400 });
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: { id: storeId, userId },
		});

		if (!storeByUserId) {
			return new NextResponse("Forbidden", { status: 403 });
		}

		// can use delete or deleteMany
		const size = await prismadb.size.deleteMany({
			where: { id: sizeId },
		});

		return NextResponse.json(size);
	} catch (error) {
		console.log("[SIZE_DELETE]", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
