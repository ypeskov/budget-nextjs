"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FilterControls() {
  const router = useRouter();

  const [includeHidden, setIncludeHidden] = useState(false);
  const [archivedOnly, setArchivedOnly] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIncludeHidden(params.get("includeHidden") === "true");
    setArchivedOnly(params.get("archivedOnly") === "true");
  }, []);

  const updateQuery = (key: string, value: boolean) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(key, "true");
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Filters</h2>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            checked={includeHidden}
            onChange={(e) => {
              setIncludeHidden(e.target.checked);
              updateQuery("includeHidden", e.target.checked);
            }}
          />
          <span className="text-gray-700">Include Hidden</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            checked={archivedOnly}
            onChange={(e) => {
              setArchivedOnly(e.target.checked);
              updateQuery("archivedOnly", e.target.checked);
            }}
          />
          <span className="text-gray-700">Show Archived Accounts</span>
        </label>
      </div>
    </div>
  );
}