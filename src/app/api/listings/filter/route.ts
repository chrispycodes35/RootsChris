import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const propertyType = searchParams.get('propertyType');
  const sw = searchParams.get('sw')?.split(',').map(Number) ?? [];
  const ne = searchParams.get('ne')?.split(',').map(Number) ?? [];

  if (sw.length !== 2 || ne.length !== 2) {
    return NextResponse.json({ message: 'Invalid bbox' }, { status: 400 });
  }

  const where: any = {
    latitude: { gte: sw[1], lte: ne[1] },
    longitude: { gte: sw[0], lte: ne[0] }
  };

  if (minPrice) {
    where.price = { ...where.price, gte: Number(minPrice) };
  }
  if (maxPrice) {
    where.price = { ...where.price, lte: Number(maxPrice) };
  }
  if (propertyType) {
    where.propertyType = propertyType;
  }

  const listings = await prisma.listing.findMany({
    where,
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
    }
  });

  return NextResponse.json(
    listings.map(l => ({
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
    }))
  );
} 