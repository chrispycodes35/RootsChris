// src/app/api/listings/bbox/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sw = searchParams.get('sw')?.split(',').map(Number) ?? [];
  const ne = searchParams.get('ne')?.split(',').map(Number) ?? [];

  if (sw.length !== 2 || ne.length !== 2) {
    return NextResponse.json({ message: 'Invalid bbox' }, { status: 400 });
  }

  try {
    const listings = await prisma.listing.findMany({
      where: {
        latitude: { gte: sw[1], lte: ne[1] },
        longitude: { gte: sw[0], lte: ne[0] }
      },
      take: 500,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        price: true,
        latitude: true,
        longitude: true,
        bedrooms: true,
        bathrooms: true,
        squareFeet: true,
        address: true,
        isAssumable: true,
        createdAt: true,
        propertyType: true,
        photoUrls: true
      }
    });

    // Debug log
    console.log('Found listings:', listings.length);

    const formattedListings = listings.map(l => ({
      id: l.id,
      price: Number(l.price),
      lat: Number(l.latitude),
      lng: Number(l.longitude),
      beds: l.bedrooms ?? 0,
      baths: l.bathrooms ?? 0,
      sqft: l.squareFeet ?? 0,
      address: l.address,
      isAssumable: l.isAssumable,
      createdAt: l.createdAt.toISOString(),
      propertyType: l.propertyType,
      imageUrl: l.photoUrls[0] || null
    }));

    return NextResponse.json(formattedListings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json({ message: 'Error fetching listings' }, { status: 500 });
  }
}