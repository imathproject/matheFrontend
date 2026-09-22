/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Soft UI Dashboard React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Soft UI Dashboard React layouts
import SignUp from "layouts/authentication/sign-up";
import HomePage from "layouts/homePage";
//import EditQuestion from "layouts/SNAQuestions/pages/EditQuestion";
import Videos from "layouts/Videos";
import SelfAssessment from "layouts/selfAssessment";
import MatheLibrary from "layouts/library";
import TeachingMaterials from "layouts/TeachingMaterials";
import AllQuestionsRestricted from "layouts/allQuestionsRestricted";
import SelfOlympicAssessment from "layouts/selfOlympicAssessment";
import OlympicPerformance from "layouts/olympicPerformance";
import ReviewQuestion from "layouts/reviewQuestions";
import ReviewOlympicQuestion from "layouts/reviewOlympicQuestions";
import ReviewVideo from "layouts/reviewVideos";
import ReviewTeachingMaterials from "layouts/reviewMaterials";
import Question from "layouts/SnaQuestion";
import OlympicQuestion from "layouts/SnaOlympicQuestion";
import ProfileTeacher from "layouts/profileTeacher";
import WelcomePage from "layouts/welcome";
import OlympicWelcomePage from "layouts/olympicwelcome";
import ChoosePlatform from "layouts/choosePlatform";
import { ProtectedRoute } from "./protectedRoutes";
import { ROLES } from "constants/roles";
import Performance from "layouts/performance";
//Fontawesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faVideo,
  faFile,
  faList,
  faUser,
  faUserPlus,
  faListUl,
  faListCheck,
  faPhotoFilm,
  faFileCircleCheck,
  faChartSimple,
  faFileSignature,
} from "@fortawesome/free-solid-svg-icons";

const reviewerRoutes = [
  { type: "title", title: "My account", key: "account-pages" },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    route: "/profile",
    icon: faUser,
    component: (
      <ProtectedRoute allowedRoles={[ROLES.LECTURE_REVIEWER]}>
        <ProfileTeacher />{" "}
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
      <ProtectedRoute allowedRoles={[ROLES.LECTURE_REVIEWER]}>
        <Question />
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
      <ProtectedRoute allowedRoles={[ROLES.LECTURE_REVIEWER]}>
        {" "}
        <Videos />{" "}
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
      <ProtectedRoute allowedRoles={[ROLES.LECTURE_REVIEWER]}>
        {" "}
        <TeachingMaterials />{" "}
      </ProtectedRoute>
    ),
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Questions",
    key: "olympiads-Questions",
    route: "/Olympiads-Questions",
    icon: faFileSignature,
    component: (
      <ProtectedRoute>
        <OlympicQuestion />
      </ProtectedRoute>
    ),
    noCollapse: true,
  },
  { type: "title", title: "Review Area" },
  {
    type: "collapse",
    name: "Review Questions",
    key: "reviewQuestions",
    route: "/reviewQuestions",
    icon: faListCheck,
    component: (
      <ProtectedRoute allowedRoles={[ROLES.LECTURE_REVIEWER]}>
        <ReviewQuestion />
      </ProtectedRoute>
    ),
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Review Questions",
    key: "reviewOlympiadsQuestions",
    route: "/reviewOlympiadsQuestions",
    icon: faListCheck,
    component: (
      <ProtectedRoute>
        <ReviewOlympicQuestion />
      </ProtectedRoute>
    ),
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Review Videos",
    key: "reviewVideos",
    route: "/reviewVideos",
    icon: faPhotoFilm,
    component: (
      <ProtectedRoute allowedRoles={[ROLES.LECTURE_REVIEWER]}>
        <ReviewVideo />
      </ProtectedRoute>
    ),
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Review Materials",
    key: "reviewMaterials",
    route: "/reviewMaterials",
    icon: faFileCircleCheck,
    component: (
      <ProtectedRoute allowedRoles={[ROLES.LECTURE_REVIEWER]}>
        <ReviewTeachingMaterials />
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
      <ProtectedRoute allowedRoles={[ROLES.LECTURE_REVIEWER]}>
        {" "}
        <SelfAssessment />{" "}
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
      <ProtectedRoute allowedRoles={[ROLES.LECTURE_REVIEWER]}>
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
      <ProtectedRoute allowedRoles={[ROLES.LECTURE_REVIEWER]}>
        <MatheLibrary />{" "}
      </ProtectedRoute>
    ),
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "All Questions",
    key: "allQuestions",
    route: "/allQuestions",
    icon: faListUl,
    component: (
      <ProtectedRoute allowedRoles={[ROLES.LECTURE_REVIEWER]}>
        {" "}
        <AllQuestionsRestricted />{" "}
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
      <ProtectedRoute allowedRoles={[ROLES.LECTURE_REVIEWER]}>
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

export default reviewerRoutes;
