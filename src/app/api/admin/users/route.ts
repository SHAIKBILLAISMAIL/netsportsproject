import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user, userBalances } from '@/db/schema';
import { desc, eq, sql, or, like } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');

    let query = db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        createdAt: user.createdAt,
        role: userBalances.role,
        coins: userBalances.coins,
      })
      .from(user)
      .leftJoin(userBalances, eq(user.id, userBalances.userId));

    if (search) {
      query = query.where(
        or(
          like(user.name, `%${search}%`),
          like(user.email, `%${search}%`)
        )
      ) as any;
    }

    const results = await query
      .orderBy(desc(user.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    // Note: This is a simplified count, for full search support we'd need to duplicate the where clause
    const totalResult = await db.select({ count: sql<number>`count(*)` }).from(user);
    const total = totalResult[0]?.count ?? 0;

    return NextResponse.json({
      users: results,
      total,
    });
  } catch (error) {
    console.error('GET users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}