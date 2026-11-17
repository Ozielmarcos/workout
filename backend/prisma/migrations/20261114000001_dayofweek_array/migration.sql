ALTER TABLE "workout_series"
  ALTER COLUMN "day_of_week" TYPE TEXT[]
  USING ARRAY["day_of_week"];
