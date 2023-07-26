import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function GET(
	_req: Request,
	{ params }: { params: { categoryId: string } }
) {
	try {
		if (!params.categoryId) {
			return new NextResponse("Category ID is required", { status: 400 });
		}

		const category = await prismadb.category.findUnique({
			where: { id: params.categoryId },
			include: { billboard: true },
		});

		return NextResponse.json(category);
	} catch (error) {
		console.log("[CATEGORY_GET]", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { categoryId: string; storeId: string } }
) {
	try {
		const { userId } = auth();
		const body = await req.json();
		const { name, billboardId } = body;
		const { categoryId, storeId } = params;

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		if (!billboardId) {
			return new NextResponse("Billboard ID is required", {
				status: 400,
			});
		}

		if (!name) {
			return new NextResponse("Name is required", { status: 400 });
		}

		if (!categoryId) {
			return new NextResponse("Category ID is required", { status: 400 });
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: { id: storeId, userId },
		});

		if (!storeByUserId) {
			return new NextResponse("Forbidden", { status: 403 });
		}

		// can use update or updateMany
		const category = await prismadb.category.updateMany({
			where: { id: categoryId },
			data: { name, billboardId },
		});

		return NextResponse.json(category);
	} catch (error) {
		console.log("[CATEGORY_PATCH]", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}

export async function DELETE(
	_req: Request,
	{ params }: { params: { categoryId: string; storeId: string } }
) {
	try {
		const { userId } = auth();
		const { categoryId, storeId } = params;

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		if (!categoryId) {
			return new NextResponse("Category ID is required", { status: 400 });
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: { id: storeId, userId },
		});

		if (!storeByUserId) {
			return new NextResponse("Forbidden", { status: 403 });
		}

		// can use delete or deleteMany
		const category = await prismadb.category.deleteMany({
			where: { id: categoryId },
		});

		return NextResponse.json(category);
	} catch (error) {
		console.log("[CATEGORY_DELETE]", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
