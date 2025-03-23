import React from "react";

const PrefixList = ({ setSelectedPrefix, prefixes }) => {
  return (
    <div className="space-y-4">
      {Array.isArray(prefixes) && prefixes.length > 0 ? (
        prefixes.map((p, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg text-center font-semibold cursor-pointer ${
              p.status === "Inactive"
                ? "bg-red-200 text-red-800"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setSelectedPrefix(p)}
          >
            {p.prefix}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No prefixes found</p>
      )}
    </div>
  );
};

export default PrefixList;
