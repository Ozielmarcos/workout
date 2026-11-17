import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const EXERCISES_URL = process.env.EXERCISES_API_URL as string;

const IMAGE_BASE_URL = process.env.IMAGE_BASE_API_URL as string;

type ExerciseRaw = {
  id: string;
  name: string;
  category: string;
  level: string;
  force: string | null;
  mechanic: string | null;
  equipment: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  images: string[];
};

function toFullImageUrls(images: string[]): string[] {
  return images.map((img) => `${IMAGE_BASE_URL}${img}`);
}

function toExerciseRecord(ex: ExerciseRaw) {
  return {
    externalId: ex.id,
    name: ex.name,
    category: ex.category,
    level: ex.level,
    force: ex.force,
    mechanic: ex.mechanic,
    equipment: ex.equipment,
    primaryMuscles: ex.primaryMuscles,
    secondaryMuscles: ex.secondaryMuscles,
    instructions: ex.instructions,
    images: toFullImageUrls(ex.images),
  };
}

async function fetchExercises(): Promise<ExerciseRaw[]> {
  const response = await fetch(EXERCISES_URL);
  return response.json() as Promise<ExerciseRaw[]>;
}

async function main() {
  console.log('Baixando exercícios...');
  const exercises = await fetchExercises();

  console.log(`Inserindo ${exercises.length} exercícios...`);
  await prisma.exercise.createMany({
    data: exercises.map(toExerciseRecord),
    skipDuplicates: true,
  });

  console.log('Seed concluído!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
