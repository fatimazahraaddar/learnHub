// src/api/index.js

export {
  getStoredUser,
  getUserDisplayData,
  getDashboardRouteByRole,
  loginUser,
  registerUser,
  logoutUser,
  fetchCurrentUser,
  fetchProfile,
  saveProfile,
  mergeStoredUser,
  clearStoredUser,
  subscribeUserChanges,
} from './auth';

export {
  fetchCourses,
  fetchCourseById,
  createCourseFromForm,
  updateCourseFromForm,
  deleteCourseById,
  enrollInCourse,
} from './courses';

export {
  fetchPublicCategories,
  fetchTestimonials,
  fetchTeamMembers,
  fetchBlogPosts,
  fetchSubscriptionPlans,
  fetchHomePageData,
  submitContactMessage,
  uploadImageFile,
} from './public';

export {
  fetchAdminDashboardData,
  fetchAdminUsersData,
  fetchAdminTrainersData,
  fetchAdminCertificatesData,
  updateCertificateStatus,
  fetchAdminReportsData,
  fetchAdminNotificationsData,
  fetchPlatformSettings,
  savePlatformSettings,
  updateUser,
  deleteUser,
} from './admin';

export {
  fetchTrainerOverviewData,
  fetchTrainerStudentsData,
  fetchTrainerAnalytics,
} from './trainer';

export {
  fetchLearnerDashboardData,
  fetchLearnerCourses,
  fetchLearnerCertificates,
  fetchLearnerLessonsData,
} from './learner';

export {
  fetchMessageContacts,
  fetchConversation,
  sendConversationMessage,
} from './message';

export {
  apiRequest,
  postForm,
  getJson,
  postMultipart,
  API_BASE,
  LEGACY_API_BASE,
} from './client';