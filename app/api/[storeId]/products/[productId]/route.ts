import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function GET(
	_req: Request,
	{ params }: { params: { productId: string } }
) {
	try {
		if (!params.productId) {
			return new NextResponse("Product ID is required", { status: 400 });
		}

		const product = await prismadb.product.findUnique({
			where: { id: params.productId },
			include: {
				images: true,
				category: true,
				size: true,
				color: true,
			},
		});

		return NextResponse.json(product);
	} catch (error) {
		console.log("[PRODUCT_GET]", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { productId: string; storeId: string } }
) {
	try {
		const { userId } = auth();
		const body = await req.json();
		const {
			name,
			price,
			categoryId,
			images,
			colorId,
			sizeId,
			isFeatured,
			isArchived,
		} = body;
		const { productId, storeId } = params;

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		if (!productId) {
			return new NextResponse("Product ID is required", { status: 400 });
		}

		if (!name) {
			return new NextResponse("Name is required", { status: 400 });
		}

		if (!images || !images.length) {
			return new NextResponse("Images are required", { status: 400 });
		}

		if (!price) {
			return new NextResponse("Price is required", { status: 400 });
		}

		if (!categoryId) {
			return new NextResponse("Category ID is required", { status: 400 });
		}

		if (!colorId) {
			return new NextResponse("Color ID is required", { status: 400 });
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

		// cannot use update or updateMany because of images
		await prismadb.product.update({
			where: { id: productId },
			data: {
				name,
				price,
				categoryId,
				colorId,
				sizeId,
				images: { deleteMany: {} },
				isFeatured,
				isArchived,
			},
		});

		const product = await prismadb.product.update({
			where: { id: productId },
			data: {
				images: {
					createMany: {
						data: [
							...images.map((image: { url: string }) => image),
						],
					},
				},
			},
		});

		return NextResponse.json(product);
	} catch (error) {
		console.log("[PRODUCT_PATCH]", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}

export async function DELETE(
	_req: Request,
	{ params }: { params: { productId: string; storeId: string } }
) {
	try {
		const { userId } = auth();
		const { productId, storeId } = params;

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		if (!productId) {
			return new NextResponse("Product ID is required", { status: 400 });
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: { id: storeId, userId },
		});

		if (!storeByUserId) {
			return new NextResponse("Forbidden", { status: 403 });
		}

		// can use delete or deleteMany
		const product = await prismadb.product.deleteMany({
			where: { id: productId },
		});

		return NextResponse.json(product);
	} catch (error) {
		console.log("[PRODUCT_DELETE]", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
