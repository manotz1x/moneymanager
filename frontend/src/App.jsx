import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Charts from "./pages/Charts";
import Accounts from "./pages/Accounts";
import Sidebar from "./components/Sidebar";
import DarkToggle from "./components/DarkToggle";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen">

        <Sidebar />

        <div className="flex-1 bg-gray-100 dark:bg-slate-900">

          <div className="p-4 flex justify-end bg-white dark:bg-slate-800 shadow">
            <DarkToggle />
          </div>

          <div className="p-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/charts" element={<Charts />} />
              <Route path="/accounts" element={<Accounts />} />
            </Routes>
          </div>

        </div>
      </div>
    </BrowserRouter>
  );
}
