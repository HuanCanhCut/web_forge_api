export const LESSON_TYPE = {
    VIDEO: 'VIDEO',
    CODING: 'CODING',
    QUESTION: 'QUESTION',
    DOCUMENT: 'DOCUMENT',
} as const

export type LessonType = (typeof LESSON_TYPE)[keyof typeof LESSON_TYPE]
