import { useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Signup, Signin, Explore, Upload, MyUploads, Profile } from "../screen";
import { Sidebar } from "../components";
import ProtectedRoute from "../components/ProtectedRoute";

const Layout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar open={open} onClose={() => setOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-bg/80 px-4 py-3 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="cursor-pointer text-text"
          >
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>
          <span className="font-semibold text-text">
            <span className="text-red-500">S</span>team
          </span>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/explore" replace />} />

      {/* No sidebar */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />

      {/* With sidebar */}
      <Route element={<Layout />}>
        <Route path="/explore" element={<Explore />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/upload" element={<Upload />} />
          <Route path="/dashboard/uploads" element={<MyUploads />} />
          <Route path="/dashboard/profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
