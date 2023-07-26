import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = auth();
		const body = await req.json();
		const { label, imageUrl } = body;
		const { storeId } = params;

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		if (!label) {
			return new NextResponse("Label is required", { status: 400 });
		}

		if (!imageUrl) {
			return new NextResponse("Image URL is required", { status: 400 });
		}

		if (!storeId) {
			return new NextResponse("Store ID is required", { status: 400 });
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: { id: storeId, userId },
		});

		if (!storeByUserId) {
			return new NextResponse("Forbidden", { status: 403 });
		}

		const billboard = await prismadb.billboard.create({
			data: { label, imageUrl, storeId },
		});

		return NextResponse.json(billboard);
	} catch (error) {
		console.log("[BILLBOARDS_POST]", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}

export async function GET(
	_req: Request,
	{ params }: { params: { storeId: string } }
) {
	const { storeId } = params;
	try {
		if (!storeId) {
			return new NextResponse("Store ID is required", { status: 400 });
		}

		const billboards = await prismadb.billboard.findMany({
			where: { storeId },
		});

		return NextResponse.json(billboards);
	} catch (error) {
		console.log("[BILLBOARDS_GET]", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
