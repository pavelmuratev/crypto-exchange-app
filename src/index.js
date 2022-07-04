import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./App";
import ResultsTable from "./components/ResultsTable";
import DetailsModal from "./components/DetailsModal";
import RouteNotFound from "./components/RouteNotFound";
import { Routes, Route, BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path="/:pair" element={<ResultsTable />} />
        <Route path=":pair/details" element={<DetailsModal />} />
        <Route path="*" element={<RouteNotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
