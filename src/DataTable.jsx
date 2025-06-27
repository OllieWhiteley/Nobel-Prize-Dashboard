import React from "react";
import "./App.css";

export default function DataTable({
  data,
  sortConfig,
  onSort,
  selectedYear,
  setSelectedYear,
  availableYears,
}) {
  const SortArrow = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    return <>{sortConfig.direction === "asc" ? "↑" : "↓"}</>;
  };

  return (
    <table>
      <thead>
        <tr>
          <th onClick={() => onSort("year")}>
            <div className="flex-container">
              <span className="flex-text">Year</span>
              <span className="sort-arrow">
                <SortArrow columnKey="year" />
              </span>
              <select
                className="year-filter"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="">All</option>
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </th>
          <th onClick={() => onSort("category")} title="Sort by Category">
            <div className="flex-container">
              <span className="flex-text">Category</span>
              <span className="sort-arrow">
                <SortArrow columnKey="category" />
              </span>
            </div>
          </th>
          <th onClick={() => onSort("name")} title="Sort by Name">
            <div className="flex-container">
              <span className="flex-text">Name</span>
              <span className="sort-arrow">
                <SortArrow columnKey="name" />
              </span>
            </div>
          </th>
          <th className="motivation-header">Motivation</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan="4" style={{ textAlign: "center" }}>
              No results found.
            </td>
          </tr>
        ) : (
          data.map((entry, index) => (
            <tr key={index}>
              <td>{entry.year}</td>
              <td>{entry.category}</td>
              <td>{entry.name}</td>
              <td>{entry.motivation}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
