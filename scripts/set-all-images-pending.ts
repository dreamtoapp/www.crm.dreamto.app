import db from '../lib/prisma';

async function main() {
  try {
    const result = await db.image.updateMany({
      data: { status: 'PENDING' }
    });
    console.log(`Updated ${result.count} images to PENDING status.`);
  } catch (error) {
    console.error('Error updating images:', error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

main(); 