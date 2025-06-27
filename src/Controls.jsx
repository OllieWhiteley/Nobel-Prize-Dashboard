import React from "react";
import "./App.css";

export default function Controls({ search, setSearch, pageSize, setPageSize }) {
  return (
    <div className="controls">
      <input
        type="text"
        placeholder="Search by name, category, motivation..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <label>
        Show
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={200}>200</option>
        </select>
        entries per page
      </label>
    </div>
  );
}
