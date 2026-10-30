-- 1. Enable uuid extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create the 'students' table
CREATE TABLE public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nim TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    cohort TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create the 'quiz_attempts' table
CREATE TABLE public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    total_score INTEGER NOT NULL,
    completion_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    details JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- 4. Create indexes for Leaderboard query performance
CREATE INDEX idx_quiz_attempts_student_id ON public.quiz_attempts(student_id);
CREATE INDEX idx_quiz_attempts_score_time ON public.quiz_attempts(total_score DESC, completion_time ASC);
