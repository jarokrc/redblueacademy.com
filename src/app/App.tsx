import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "@/components/Layout";
import ScrollToTop from "@/components/ScrollToTop";
import { appRoutes } from "@/routes";

const App = () => (
  <BrowserRouter>
    <ScrollToTop />
    <Layout>
      <Routes>
        {appRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Layout>
  </BrowserRouter>
);

export default App;
