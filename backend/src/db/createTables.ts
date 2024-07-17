import pool from './connect';

const createTables = async () => {
  const queries = `
    CREATE TABLE IF NOT EXISTS Users (
        user_code SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Workout_plan (
        workout_plan_code SERIAL PRIMARY KEY,
        user_code INTEGER NOT NULL,
        init_date DATE,
        end_date DATE,
        FOREIGN KEY (user_code) REFERENCES Users(user_code)
    );

    CREATE TABLE IF NOT EXISTS Exercises (
        exercise_code SERIAL PRIMARY KEY,
        user_code INTEGER NOT NULL,
        name VARCHAR(255) NOT NULL,
        FOREIGN KEY (user_code) REFERENCES Users(user_code)
    );

    CREATE TABLE IF NOT EXISTS Workout (
        workout_code SERIAL PRIMARY KEY,
        workout_plan_code INTEGER NOT NULL,
        week_days VARCHAR(255),
        title VARCHAR(255),
        FOREIGN KEY (workout_plan_code) REFERENCES Workout_plan(workout_plan_code) ON DELETE CASCADE
    );

        CREATE TABLE IF NOT EXISTS Workout_exercises (
        workout_code INTEGER NOT NULL,
        exercise_code INTEGER NOT NULL,
        PRIMARY KEY (workout_code, exercise_code),
        FOREIGN KEY (workout_code) REFERENCES Workout(workout_code) ON DELETE CASCADE,
        FOREIGN KEY (exercise_code) REFERENCES Exercises(exercise_code) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS Session (
        session_code SERIAL PRIMARY KEY,
        workout_code INTEGER NOT NULL,
        date DATE NOT NULL,
        FOREIGN KEY (workout_code) REFERENCES Workout(workout_code) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS Set_detail (
        set_detail_code SERIAL,
        session_code INTEGER NOT NULL,
        exercise_code INTEGER NOT NULL,
        set INTEGER NOT NULL,
        reps INTEGER NOT NULL,
        weight FLOAT NOT NULL,
        PRIMARY KEY (set_detail_code, session_code, exercise_code),
        FOREIGN KEY (session_code) REFERENCES Session(session_code) ON DELETE CASCADE,
        FOREIGN KEY (exercise_code) REFERENCES Exercises(exercise_code) ON DELETE CASCADE
    );
  `;

  try {
    await pool.query(queries);
    console.log('Tables created successfully');
  } catch (err) {
    console.error('Error creating tables', err);
  } finally {
    pool.end();
  }
};

createTables();
