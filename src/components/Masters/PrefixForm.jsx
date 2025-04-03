import React, { useState, useEffect } from "react";
import api from "../API/api";

const PrefixForm = ({ selectedPrefix, clearSelected, refreshPrefixes }) => {
  const [prefix, setPrefix] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (selectedPrefix) {
      setPrefix(selectedPrefix.prefix);
      setDescription(selectedPrefix.description);
    } else {
      setPrefix("");
      setDescription("");
    }
  }, [selectedPrefix]);

  // Save Prefix
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/master/add-prefix", { prefix, description });
      setMessage("Prefix Saved Successfully!");
      setPrefix("");
      setDescription("");
      clearSelected();
      refreshPrefixes();
    } catch (err) {
      setMessage("Error Saving Prefix!");
    }
  };

  // Update Prefix
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/master/update-prefix/${selectedPrefix._id}`, {
        prefix,
        description,
      });
      setMessage("Prefix Updated Successfully!");
      setPrefix("");
      setDescription("");
      clearSelected();
      refreshPrefixes();
    } catch (err) {
      setMessage("Error Updating Prefix!");
    }
  };

  // Inactivate / Activate Prefix
  const handleInactive = async () => {
    if (selectedPrefix) {
      try {
        const action =
          selectedPrefix.status === "Inactive" ? "activate" : "inactive";
        await api.put(`/api/master/${action}-prefix/${selectedPrefix._id}`);
        setMessage(
          `Prefix ${
            action === "activate" ? "Activated" : "Inactivated"
          } Successfully!`
        );
        setPrefix("");
        setDescription("");
        clearSelected();
        refreshPrefixes();
      } catch (err) {
        setMessage("Error Updating Status!");
      }
    }
  };

  // Clear Form
  const handleClear = () => {
    setPrefix("");
    setDescription("");
    clearSelected();
    setMessage("");
  };

  return (
    <form className="space-y-6">
      {/* Prefix Input */}
      <div>
        <label className="block mb-2 font-semibold">Prefix</label>
        <input
          type="text"
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3"
          required
        />
      </div>

      {/* Description Input */}
      <div>
        <label className="block mb-2 font-semibold">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3"
          required
        />
      </div>

      {/* Buttons */}
      <div className="flex space-x-4">
        {!selectedPrefix ? (
          <>
            <button
              type="submit"
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold"
            >
              Save
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold"
            >
              Clear
            </button>
          </>
        ) : (
          <>
            <button
              type="submit"
              onClick={handleUpdate}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold"
            >
              Update
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={handleInactive}
              className={`${
                selectedPrefix.status === "Inactive"
                  ? "bg-green-500"
                  : "bg-red-500"
              } text-white px-4 py-2 rounded-lg font-semibold`}
            >
              {selectedPrefix.status === "Inactive" ? "Activate" : "Inactive"}
            </button>
          </>
        )}
      </div>

      {message && <p className="text-blue-700 font-semibold mt-4">{message}</p>}
    </form>
  );
};

export default PrefixForm;
