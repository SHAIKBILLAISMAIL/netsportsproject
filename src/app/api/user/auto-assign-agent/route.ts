import { NextResponse } from 'next/server';
import { db } from '@/db';
import { userBalances } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// POST - Auto-assign user to an active agent
export async function POST(request: Request) {
    try {
        // Get current user from session
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
        }

        const userId = session.user.id;

        // Check if user already has an agent
        const userBalance = await db.select().from(userBalances)
            .where(eq(userBalances.userId, userId))
            .limit(1);

        if (userBalance.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (userBalance[0].agentId) {
            return NextResponse.json({
                message: 'User already assigned to an agent',
                agentId: userBalance[0].agentId
            }, { status: 200 });
        }

        // Find all active agents (users with role='agent')
        const agents = await db.select().from(userBalances)
            .where(eq(userBalances.role, 'agent'))
            .all();

        if (agents.length === 0) {
            console.log('⚠️ No agents available for auto-assignment');
            return NextResponse.json({
                message: 'No agents available',
                assigned: false
            }, { status: 200 });
        }

        // Select a random agent (you can implement more sophisticated logic here)
        // For now, we'll just pick a random one
        const randomAgent = agents[Math.floor(Math.random() * agents.length)];

        // Assign user to the selected agent
        const now = new Date();
        await db.update(userBalances)
            .set({
                agentId: randomAgent.userId,
                updatedAt: now.toISOString()
            })
            .where(eq(userBalances.userId, userId));

        console.log(`✅ Auto-assigned user ${userId} to agent ${randomAgent.userId}`);

        return NextResponse.json({
            success: true,
            message: 'Successfully assigned to an agent',
            agentId: randomAgent.userId,
            assigned: true
        }, { status: 200 });

    } catch (error) {
        console.error('❌ Auto-assign error:', error);
        return NextResponse.json({
            error: 'Failed to auto-assign agent: ' + (error instanceof Error ? error.message : 'Unknown error')
        }, { status: 500 });
    }
}
