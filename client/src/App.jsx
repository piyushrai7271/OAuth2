import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChangePassword from "./pages/ChangePassword";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />
        <Route
          path="/signup"
          element={
            <Layout>
              <Signup />
            </Layout>
          }
        />
        <Route
          path="/change-password" // <-- Add this route
          element={
            <Layout>
              <ChangePassword />
            </Layout>
          }
        />
        <Route
          path="/forget-password"
          element={
            <Layout>
              <ForgetPassword />
            </Layout>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <Layout>
              <ResetPassword />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
