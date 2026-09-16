export const COURSE_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const
export const COURSE_STATUS = ['PUBLISHED', 'ARCHIVED'] as const
export const VIDEO_PROVIDERS = ['YOUTUBE', 'UPLOAD'] as const

export type CourseLevel = (typeof COURSE_LEVELS)[number]
export type CourseStatus = (typeof COURSE_STATUS)[number]
export type VideoProvider = (typeof VIDEO_PROVIDERS)[number]
