import { NotFoundError } from "../errors/index.js";
import { prisma } from "../lib/db.js";

interface InputDto {
  userId: string;
  workoutPlanId: string;
  workoutDayId: string;
  workoutExerciseId: string;
  weightInGrams: number;
}

interface OutputDto {
  id: string;
  weightInGrams: number;
}

export class UpdateWorkoutExerciseWeight {
  async execute(dto: InputDto): Promise<OutputDto> {
    const workoutPlan = await prisma.workoutPlan.findUnique({
      where: { id: dto.workoutPlanId },
    });
    if (!workoutPlan) {
      throw new NotFoundError("Workout plan not found");
    }

    const workoutDay = await prisma.workoutDay.findUnique({
      where: { id: dto.workoutDayId, workoutPlanId: dto.workoutPlanId },
    });
    if (!workoutDay) {
      throw new NotFoundError("Workout day not found");
    }

    const exercise = await prisma.workoutExercise.findUnique({
      where: { id: dto.workoutExerciseId, workoutDayId: dto.workoutDayId },
    });
    if (!exercise) {
      throw new NotFoundError("Workout exercise not found");
    }

    const updatedExerciseWeight = await prisma.workoutExercise.update({
      where: { id: dto.workoutExerciseId, workoutDayId: dto.workoutDayId },
      data: { weightInGrams: dto.weightInGrams * 1000 },
    });

    if (updatedExerciseWeight.createdAt === null) {
      throw new NotFoundError("Workout exercise not found");
    }

    return {
      id: updatedExerciseWeight.id,
      weightInGrams: updatedExerciseWeight.weightInGrams,
    };
  }
}
