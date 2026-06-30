import { db, questionsTable } from '../lib/db/src/index.ts';

async function check() {
  try {
    const questions = await db.select().from(questionsTable);
    console.log(`Found ${questions.length} questions in the database.`);
    process.exit(0);
  } catch (error) {
    console.error("Database check failed:", error);
    process.exit(1);
  }
}

check();
