import { NextResponse } from 'next/server';
import { db } from '@/db';
import { referralCodes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// GET - Get user's referral code (creates one if doesn't exist)
export async function GET(request: Request) {
    try {
        // Get current user from session
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
        }

        const userId = session.user.id;

        // Check if user already has a referral code
        const existingCodes = await db.select().from(referralCodes)
            .where(eq(referralCodes.userId, userId))
            .limit(1);

        if (existingCodes.length > 0) {
            // User already has a code, return it
            return NextResponse.json({
                referralCode: existingCodes[0].referralCode,
                createdAt: existingCodes[0].createdAt
            }, { status: 200 });
        }

        // User doesn't have a code, create one
        const newReferralCode = `REF${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
        const now = new Date();

        await db.insert(referralCodes).values({
            userId: userId,
            referralCode: newReferralCode,
            createdAt: now.toISOString(),
        });

        console.log('✅ Created new referral code for user:', userId, '→', newReferralCode);

        return NextResponse.json({
            referralCode: newReferralCode,
            createdAt: now.toISOString(),
            isNew: true
        }, { status: 200 });

    } catch (error) {
        console.error('❌ Get referral code error:', error);
        return NextResponse.json({
            error: 'Failed to get referral code: ' + (error instanceof Error ? error.message : 'Unknown error')
        }, { status: 500 });
    }
}
