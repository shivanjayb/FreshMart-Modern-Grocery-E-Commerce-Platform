import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, rating, comment } = body;

    if (!productId || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Use demo user
    const user = await prisma.user.findFirst();
    if (!user) {
      return NextResponse.json({ error: 'Please log in to review' }, { status: 401 });
    }

    const review = await prisma.review.create({
      data: {
        productId,
        userId: user.id,
        rating: Math.min(5, Math.max(1, rating)),
        comment,
      },
    });

    // Update product rating
    const reviews = await prisma.review.findMany({
      where: { productId },
    });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Review creation error:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
