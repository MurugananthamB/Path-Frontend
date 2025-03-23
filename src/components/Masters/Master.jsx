import React, { useState, useEffect } from "react";
import PrefixForm from "./PrefixForm";
import PrefixList from "./PrefixList";
import api from "../API/api";

const Master = () => {
  const [selectedMenu, setSelectedMenu] = useState("Prefix");
  const [selectedPrefix, setSelectedPrefix] = useState(null);
  const [prefixes, setPrefixes] = useState([]);

  // Fetch Prefix Data
  const fetchPrefixes = async () => {
    try {
      const res = await api.get("/api/master/get-prefixes");
      setPrefixes(res.data);
    } catch (err) {
      console.error("Error fetching prefixes");
    }
  };

  useEffect(() => {
    fetchPrefixes();
  }, []);

  const menuItems = [
    "Prefix",
    "Master Menu 2",
    "Master Menu 3",
    "Master Menu 4",
  ];

  const renderForm = () => {
    switch (selectedMenu) {
      case "Prefix":
        return (
          <PrefixForm
            selectedPrefix={selectedPrefix}
            clearSelected={() => setSelectedPrefix(null)}
            refreshPrefixes={fetchPrefixes}
          />
        );
      default:
        return <div className="text-center">Select a Master Menu</div>;
    }
  };

  const renderList = () => {
    switch (selectedMenu) {
      case "Prefix":
        return (
          <PrefixList
            setSelectedPrefix={setSelectedPrefix}
            prefixes={prefixes}
            refreshPrefixes={fetchPrefixes}
          />
        );
      default:
        return <div className="text-center mt-4">No data to show</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-500 to-green-700 flex">
      {/* Left Menu */}
      <div className="w-1/5 bg-white p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-6 text-center">Masters</h2>
        <ul className="space-y-4">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => setSelectedMenu(item)}
                className={`w-full p-3 rounded-lg font-semibold ${
                  selectedMenu === item
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Middle Form */}
      <div className="w-2/5 bg-white m-6 rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-bold mb-4 text-center">
          {selectedMenu} Master
        </h2>
        {renderForm()}
      </div>

      {/* Right List */}
      <div className="w-2/5 bg-white m-6 rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-bold mb-4 text-center">
          Existing {selectedMenu}s
        </h2>
        {renderList()}
      </div>
    </div>
  );
};

export default Master;
