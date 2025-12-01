import { db } from './src/db';
import { user, userBalances } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function listUsers() {
    const users = await db.select().from(user);
    console.log('Users:', users);

    const balances = await db.select().from(userBalances);
    console.log('Balances:', balances);
}

listUsers().catch(console.error);
