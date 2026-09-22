import SignUp from "layouts/authentication/sign-up";
import HomePage from "layouts/homePage";
import Videos from "layouts/Videos";
import Performance from "layouts/performance";
import SelfAssessment from "layouts/selfAssessment";
import MatheLibrary from "layouts/library";
import TeachingMaterials from "layouts/TeachingMaterials";
import { ProtectedRoute } from "./protectedRoutes";
import { ROLES } from "constants/roles";
import RestrictedMaterials from "layouts/retrictedMaterials";
import RestrictedVideos from "layouts/restrictedVideos";
import RestrictedQuestion from "layouts/restrictedQuestion";
import SelfOlympicAssessment from "layouts/selfOlympicAssessment";
import OlympicPerformance from "layouts/olympicPerformance";
import ProfileTeacher from "layouts/profileTeacher";
import WelcomePage from "layouts/welcome";
import OlympicWelcomePage from "layouts/olympicwelcome";
import ChoosePlatform from "layouts/choosePlatform";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faVideo,
  faFile,
  faList,
  faUser,
  faUserPlus,
  faChartSimple,
} from "@fortawesome/free-solid-svg-icons";

const notVerifiedLecturerRoutes = [
  { type: "title", title: "My account", key: "account-pages" },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    route: "/profile",
    icon: faUser,
    component: (
      <ProtectedRoute allowedRoles={[ROLES.LECTURER_NOT_VERIFIED]}>
        <ProfileTeacher />
      </ProtectedRoute>
    ),
    noCollapse: true,
  },
  { type: "title", title: "Working area" },
  {
    type: "collapse",
    name: "Questions",
    key: "questions",
    route: "/questions",
    icon: faBookOpen,
    component: (
      <ProtectedRoute allowedRoles={[ROLES.LECTURER_NOT_VERIFIED]}>
        <RestrictedQuestion />
      </ProtectedRoute>
    ),
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Questions",
    key: "olympiads-Questions",
    route: "/Olympiads-Questions",
    icon: faBookOpen,
    component: (
      <ProtectedRoute>
        <RestrictedQuestion />
      </ProtectedRoute>
    ),
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Videos",
    key: "videos",
    route: "/videos",
    icon: faVideo,
    component: (
      <ProtectedRoute allowedRoles={[ROLES.LECTURER_NOT_VERIFIED]}>
        <RestrictedVideos />
      </ProtectedRoute>
    ),
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Teaching Materials",
    key: "materials",
    route: "/materials",
    icon: faFile,
    component: (
      <ProtectedRoute allowedRoles={[ROLES.LECTURER_NOT_VERIFIED]}>
        <RestrictedMaterials />
      </ProtectedRoute>
    ),
    noCollapse: true,
  },
  { type: "title", title: "Student's Assessment" },
  {
    type: "collapse",
    name: "Assessment",
    key: "assessment",
    route: "/assessment",
    icon: faList,
    component: (
      <ProtectedRoute allowedRoles={[ROLES.LECTURER_NOT_VERIFIED]}>
        <SelfAssessment />
      </ProtectedRoute>
    ),
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Performance",
    key: "performance",
    route: "/performance",
    icon: faChartSimple,
    component: (
      <ProtectedRoute allowedRoles={[ROLES.LECTURER_NOT_VERIFIED]}>
        <Performance />
      </ProtectedRoute>
    ),
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Assessment",
    key: "olympiads-Assessment",
    route: "/Olympiads-Assessment",
    icon: faList,
    component: (
      <ProtectedRoute>
        <SelfOlympicAssessment />
      </ProtectedRoute>
    ),
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Performance",
    key: "Olympiads-Performance",
    route: "/Olympiads-Performance",
    icon: faChartSimple,
    component: (
      <ProtectedRoute>
        <OlympicPerformance />
      </ProtectedRoute>
    ),
    noCollapse: true,
  },
  { type: "title", title: "MathE content" },
  {
    type: "none",
    name: "Sign Up",
    key: "sign-up",
    route: "/sign-up",
    icon: <FontAwesomeIcon icon={faUserPlus} size="xs" />,
    component: <SignUp />,
    noCollapse: true,
  },
  {
    type: "none",
    name: "Home Page",
    key: "homePage",
    route: "/homePage",
    icon: <FontAwesomeIcon icon={faUserPlus} size="xs" />,
    component: <HomePage />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "MathE Library",
    key: "matheLibrary",
    route: "/matheLibrary",
    icon: faBookOpen,
    component: (
      <ProtectedRoute allowedRoles={[ROLES.LECTURER_NOT_VERIFIED]}>
        <MatheLibrary />
      </ProtectedRoute>
    ),
    noCollapse: true,
  },
  {
    type: "none",
    name: "Welcome",
    key: "welcome",
    route: "welcome",
    icon: faUser,
    component: (
      <ProtectedRoute allowedRoles={[ROLES.LECTURER_NOT_VERIFIED]}>
        <WelcomePage />
      </ProtectedRoute>
    ),
    noCollapse: true,
  },
  {
    type: "none",
    name: "WelcomeOlympic",
    key: "welcomeOlympic",
    route: "welcome-Olympiads",
    icon: faUser,
    component: (
      <ProtectedRoute>
        <OlympicWelcomePage />
      </ProtectedRoute>
    ),
    noCollapse: true,
  },
  {
    type: "none",
    name: "Choose Platform",
    key: "choose-platform",
    route: "/choose-platform",
    icon: faUser,
    component: (
      <ProtectedRoute>
        <ChoosePlatform />
      </ProtectedRoute>
    ),
    noCollapse: true,
  },
];

export default notVerifiedLecturerRoutes;
