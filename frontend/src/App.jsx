import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

import LoginPage from "./pages/login-page";
import AuthLayout from "./layout/Authlayout";
import Dashboard from "./pages/dashboard";
import ReportsGen from "./pages/reports-gen";
import StudentManagement from "./pages/student-management";
import VacineManagement from "./pages/vacine-management";


const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },{
    Component:AuthLayout,
    children:[
      {path:"/dashboard",Component:Dashboard},
      {path:"/reports",Component:ReportsGen},
      {path:"/students",Component:StudentManagement},
      {path:"/vaccinemng",Component:VacineManagement},
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />
}

export default App
