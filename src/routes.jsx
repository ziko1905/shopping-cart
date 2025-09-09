import App from "./App";
import ErrorPage from "./components/pages/ErrorPage.jsx";

const routes = [
  {
    path: "/*",
    element: <App />,
    errorElement: <ErrorPage />,
  },
];

export default routes;
