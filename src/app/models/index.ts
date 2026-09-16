import { sequelize } from '../../config/database'
import associations from './association'
import Chapter from './ChapterModel'
import CourseCategory from './CourseCategoryModel'
import Course from './CourseModel'
import CourseTag from './CourseTagModel'
import LessonCodingFile from './LessonCodingFileModel'
import LessonCoding from './LessonCodingModel'
import Lesson from './LessonModel'
import LessonQuestion from './LessonQuestionModel'
import LessonVideo from './LessonVideoModel'
import Notification from './NotificationModel'
import NotificationRecipient from './NotificationRecipientModel'
import RefreshToken from './RefreshTokenModel'
import TestCase from './TestCaseModel'
import UserCourse from './UserCourseModel'
import UserLessonCode from './UserLessonCodeModel'
import UserLessonProgress from './UserLessonProgressModel'
import User from './UserModel'

associations()

// Sync all models with the database
sequelize
    .authenticate()
    .then(() => {
        console.log('\x1b[36m%s\x1b[0m', 'All models were synchronized successfully.')
    })
    .catch((err) => console.error('Sync failed:', err))

// Export all models (required in association)
export {
    Chapter,
    Course,
    CourseCategory,
    CourseTag,
    Lesson,
    LessonCoding,
    LessonCodingFile,
    LessonQuestion,
    LessonVideo,
    Notification,
    NotificationRecipient,
    RefreshToken,
    TestCase,
    User,
    UserCourse,
    UserLessonCode,
    UserLessonProgress,
}
