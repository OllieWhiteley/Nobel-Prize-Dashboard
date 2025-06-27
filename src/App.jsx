import React, { useEffect, useState } from "react";
import "./App.css";
import Controls from "./Controls";
import DataTable from "./DataTable";
import Pagination from "./Pagination";

function cleanMotivation(text) {
  if (!text) return "";
  let cleaned = text.replace(/^["']?for\s+/i, "");
  cleaned = cleaned.trim().replace(/["']$/, "");
  if (cleaned.startsWith('"')) {
    cleaned = cleaned.slice(1); // Remove leading quotation mark
  }
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function App() {
  const [prizes, setPrizes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  useEffect(() => {
    fetch("https://api.nobelprize.org/v1/prize.json")
      .then((response) => response.json())
      .then((data) => {
        const processedData = [];

        data.prizes.forEach((prize) => {
          if (prize.laureates) {
            prize.laureates.forEach((laureate) => {
              processedData.push({
                year: prize.year,
                category:
                  prize.category.charAt(0).toUpperCase() +
                  prize.category.slice(1),
                name: `${laureate.firstname || ""} ${
                  laureate.surname || ""
                }`.trim(),
                motivation: cleanMotivation(laureate.motivation),
              });
            });
          }
        });

        setPrizes(processedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const availableYears = [...new Set(prizes.map((p) => p.year))].sort(
    (a, b) => b - a
  );

  const filteredPrizes = prizes.filter((entry) => {
    const matchesYear = selectedYear ? entry.year === selectedYear : true;
    const searchLower = search.toLowerCase();
    const matchesSearch = Object.entries(entry)
      .filter(([key]) => key !== "year")
      .some(([, value]) => value.toLowerCase().includes(searchLower));
    return matchesYear && matchesSearch;
  });

  const sortedPrizes = React.useMemo(() => {
    if (!sortConfig.key) return filteredPrizes;

    const sorted = [...filteredPrizes].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (sortConfig.key === "year") {
        aVal = Number(aVal);
        bVal = Number(bVal);
      } else {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredPrizes, sortConfig]);

  const totalPages = Math.ceil(sortedPrizes.length / pageSize);
  const currentPageData = sortedPrizes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedYear, pageSize, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  return (
    <div className="App">
      <h1 style={{ marginBottom: 20 }}>Nobel Prizes Dashboard</h1>

      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Loading data...</p>
        </div>
      ) : (
        <>
          <Controls
            search={search}
            setSearch={setSearch}
            pageSize={pageSize}
            setPageSize={setPageSize}
          />

          <DataTable
            data={currentPageData}
            sortConfig={sortConfig}
            onSort={handleSort}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            availableYears={availableYears}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                if (page >= 1 && page <= totalPages) setCurrentPage(page);
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
