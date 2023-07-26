import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function GET(
	_req: Request,
	{ params }: { params: { billboardId: string } }
) {
	const { billboardId } = params;
	try {
		if (!billboardId) {
			return new NextResponse("Billboard ID is required", {
				status: 400,
			});
		}

		const billboard = await prismadb.billboard.findUnique({
			where: { id: billboardId },
		});

		return NextResponse.json(billboard);
	} catch (error) {
		console.log("[BILLBOARD_GET]", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { billboardId: string; storeId: string } }
) {
	try {
		const { userId } = auth();
		const body = await req.json();
		const { label, imageUrl } = body;
		const { billboardId, storeId } = params;

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		if (!label) {
			return new NextResponse("Label is required", { status: 400 });
		}

		if (!imageUrl) {
			return new NextResponse("Image URL is required", { status: 400 });
		}

		if (!billboardId) {
			return new NextResponse("Billboard ID is required", {
				status: 400,
			});
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: { id: storeId, userId },
		});

		if (!storeByUserId) {
			return new NextResponse("Forbidden", { status: 403 });
		}

		// can use update or updateMany
		const billboard = await prismadb.billboard.updateMany({
			where: { id: billboardId },
			data: { label, imageUrl },
		});

		return NextResponse.json(billboard);
	} catch (error) {
		console.log("[BILLBOARD_PATCH]", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}

export async function DELETE(
	_req: Request,
	{ params }: { params: { billboardId: string; storeId: string } }
) {
	try {
		const { userId } = auth();
		const { billboardId, storeId } = params;

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		if (!billboardId) {
			return new NextResponse("Billboard ID is required", {
				status: 400,
			});
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: { id: storeId, userId },
		});

		if (!storeByUserId) {
			return new NextResponse("Forbidden", { status: 403 });
		}

		// can use delete or deleteMany
		const billboard = await prismadb.billboard.deleteMany({
			where: { id: billboardId },
		});

		return NextResponse.json(billboard);
	} catch (error) {
		console.log("[BILLBOARD_DELETE]", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
