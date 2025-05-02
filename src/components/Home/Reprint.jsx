import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JsBarcode from "jsbarcode";
import api from "../API/api";

const Reprint = () => {
  const navigate = useNavigate();
  const [pathId, setPathId] = useState("");
  const [prefixOptions, setPrefixOptions] = useState([]);
  const [selectedPrefix, setSelectedPrefix] = useState("");
  const [patientData, setPatientData] = useState(null);
  const [barcodeVisible, setBarcodeVisible] = useState(false);
  const barcodeRef = useRef(null);

  // Fetch prefixes on Enter key
  const handleKeyPress = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!pathId) return alert("Please enter a Path ID");

      try {
        const encodedPathID = encodeURIComponent(pathId);
        const response = await api.get(
          `/api/patients/get-prefixes-for-pathid/${encodedPathID}`
        );
        if (response.data.length > 0) {
          setPrefixOptions(response.data);
          setSelectedPrefix(response.data[0]); // default to first prefix
          setPatientData(null);
          setBarcodeVisible(false);
        } else {
          alert("No prefixes found for this Path ID.");
        }
      } catch (error) {
        console.error("Prefix fetch failed:", error);
        alert("Error fetching prefixes.");
      }
    }
  };

  // Fetch patient data with prefix + pathId
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pathId || !selectedPrefix) {
      alert("Path ID or prefix missing");
      return;
    }

    try {
      const response = await api.get(
        `/api/patients/get-patient/${selectedPrefix}/${encodeURIComponent(
          pathId
        )}`
      );
      if (response.data) {
        setPatientData(response.data);
        setBarcodeVisible(true);
      } else {
        alert("No patient found.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to get patient.");
    }
  };

  // Generate barcode
  useEffect(() => {
    if (barcodeVisible && patientData) {
      const pathIdOnly = patientData.barcode.replace(patientData.prefix, "");
      JsBarcode(barcodeRef.current, pathIdOnly, {
        format: "CODE128",
        lineColor: "#000",
        width: 2.5,
        height: 80,
        displayValue: false,
        margin: 0,
      });
    }
  }, [barcodeVisible, patientData]);

  // Print barcode
  const printBarcode = () => {
    if (!patientData) return alert("No data to print");

    const pathIdOnly = patientData.barcode.replace(patientData.prefix, "");

    document
      .querySelectorAll(".print-barcode-container")
      .forEach((el) => el.remove());

    const printContainer = document.createElement("div");
    printContainer.className = "print-barcode-container";
    printContainer.style = `
      display: flex; flex-direction: column; align-items: center;
      width: 63.5mm; height: 38.1mm; background: white; padding: 0; margin: 0;
    `;

    const heading = document.createElement("div");
    heading.textContent = `APH - ${patientData.prefix}`;
    heading.style = "font-size: 18px; font-weight: bold; margin: 2mm 0;";
    printContainer.appendChild(heading);

    const barcodeSVG = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    JsBarcode(barcodeSVG, pathIdOnly, {
      format: "CODE128",
      lineColor: "#000",
      width: 2.5,
      height: 80,
      displayValue: false,
      margin: 0,
    });
    printContainer.appendChild(barcodeSVG);

    const pathIdText = document.createElement("div");
    pathIdText.textContent = pathIdOnly;
    pathIdText.style = "font-size: 24px; font-weight: bold; margin-top: 2mm;";
    printContainer.appendChild(pathIdText);

    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        @page { size: 63.5mm 38.1mm; margin: 0; }
        body * { visibility: hidden; }
        .print-barcode-container, .print-barcode-container * {
          visibility: visible;
          position: fixed;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        svg {
          width: 90% !important;
          height: 80px !important;
        }
      }
    `;
    document.body.appendChild(printContainer);
    document.head.appendChild(style);

    setTimeout(() => {
      window.print();
      setTimeout(() => document.body.removeChild(printContainer), 500);
    }, 500);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/", { replace: true });
  };

  const handleReport = () => {
    navigate("/report", { replace: true });
  };

  return (
    <div className="flex justify-center items-center h-screen overflow-hidden">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <div className="logout-btn-container">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
          <button
            onClick={handleReport}
            className="bg-blue-500 mt-4 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Report
          </button>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center underline">
          Reprint Label
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex gap-2">
            <div className="flex-grow">
              <label className="block text-gray-700 font-medium mb-1">
                Path ID:
              </label>
              <input
                type="text"
                value={pathId}
                onChange={(e) => setPathId(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full px-3 py-2 h-[42px] border border-gray-300 rounded"
                required
              />
            </div>

            <div className="w-24">
              <label className="block text-gray-700 font-medium mb-1">
                Prefix:
              </label>
              <select
                className="w-full px-2 py-2 h-[42px] border border-gray-300 rounded"
                value={selectedPrefix}
                onChange={(e) => setSelectedPrefix(e.target.value)}
                disabled={prefixOptions.length === 0}
              >
                <option value="">--</option>
                {prefixOptions.map((pre) => (
                  <option key={pre} value={pre}>
                    {pre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="w-full mt-4 bg-gray-500 text-white py-2 rounded"
          >
            Back
          </button>
        </form>

        {patientData && (
          <div className="mt-6 p-4 bg-gray-100 rounded shadow-md">
            <h3 className="text-lg font-bold">Patient Details</h3>
            <p>
              <b>Name:</b> {patientData.patientName}
            </p>
            <p>
              <b>UHID:</b> {patientData.uhid}
            </p>
            <p>
              <b>Age:</b> {patientData.age}
            </p>
            <p>
              <b>Gender:</b> {patientData.gender}
            </p>
            <p>
              <b>Prefix:</b> {patientData.prefix}
            </p>
            <p>
              <b>Path ID:</b> {patientData.pathId}
            </p>
          </div>
        )}

        {barcodeVisible && patientData && (
          <div className="mt-6 flex flex-col items-center p-4 bg-white rounded shadow-md">
            <h3 className="text-xl font-bold mb-2">
              APH - {patientData.prefix}
            </h3>
            <svg ref={barcodeRef}></svg>
            <p className="text-base font-bold mt-1">
              {patientData.barcode.replace(patientData.prefix, "")}
            </p>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mt-4"
              onClick={printBarcode}
            >
              Print
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reprint;
