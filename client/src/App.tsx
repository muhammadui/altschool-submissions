import { Suspense, lazy } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Loader2 } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import RootLayout from "./layouts/RootLayout";

// Lazy load components
const HomePage = lazy(() => import("@/pages/Homes"));
const BlogDetailPage = lazy(() => import("@/pages/BlogDetailPage"));
const CreateBlogPage = lazy(() => import("@/pages/CreateBlogPage"));
const EditBlogPage = lazy(() => import("@/pages/EditBlogPage"));
const UserBlogsPage = lazy(() => import("@/pages/UserBlogsPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const SignInPage = lazy(() => import("@/pages/Login"));
const SignUpPage = lazy(() => import("@/pages/SignUp"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: "blog/:blogId",
        element: (
          <Suspense fallback={<PageLoader />}>
            <BlogDetailPage />
          </Suspense>
        ),
      },
      {
        path: "create-blog",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute>
              <CreateBlogPage />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "edit-blog/:blogId",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute>
              <EditBlogPage />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "my-blogs",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute>
              <UserBlogsPage />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "profile",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "signin",
        element: (
          <Suspense fallback={<PageLoader />}>
            <SignInPage />
          </Suspense>
        ),
      },
      {
        path: "signup",
        element: (
          <Suspense fallback={<PageLoader />}>
            <SignUpPage />
          </Suspense>
        ),
      },
      {
        path: "404",
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: <Navigate to="/404" replace />,
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
