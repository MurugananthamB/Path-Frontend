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
    if (!patientData) {
      alert("No data to print");
      return;
    }

    const pathIdOnly = patientData.barcode.replace(patientData.prefix, "");

    // Remove old containers
    document
      .querySelectorAll(".print-barcode-container")
      .forEach((el) => el.remove());

    // Create print container
    const printContainer = document.createElement("div");
    printContainer.className = "print-barcode-container";
    printContainer.style.display = "flex";
    printContainer.style.flexDirection = "column";
    printContainer.style.alignItems = "center";
    printContainer.style.justifyContent = "center";
    printContainer.style.width = "43.5mm";
    printContainer.style.height = "18.1mm";
    printContainer.style.background = "white";
    printContainer.style.margin = "0";
    printContainer.style.padding = "0";

    // Header (Prefix)
    const heading = document.createElement("h3");
    heading.textContent = `APH - ${patientData.prefix}`;
    heading.style.fontSize = "12px";
    heading.style.fontWeight = "bold";
    heading.style.fontFamily = "Arial, sans-serif";
    heading.style.textAlign = "center";
    heading.style.margin = "1mm 0 0.5mm 0";
    heading.style.color = "#000";
    printContainer.appendChild(heading);

    // Barcode
    const barcodeSVG = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    JsBarcode(barcodeSVG, pathIdOnly, {
      format: "CODE128",
      lineColor: "#000",
      width: 2.5,
      height: 40,
      displayValue: false,
      margin: 0,
    });
    barcodeSVG.style.margin = "0";
    barcodeSVG.style.padding = "0";
    printContainer.appendChild(barcodeSVG);

    // Path ID text
    const pathIdText = document.createElement("p");
    pathIdText.textContent = pathIdOnly;
    pathIdText.style.fontSize = "12px";
    pathIdText.style.fontWeight = "bold";
    pathIdText.style.color = "#000";
    pathIdText.style.margin = "0.5mm 0 0 0";
    pathIdText.style.textAlign = "center";
    pathIdText.style.fontFamily = "Arial, sans-serif";
    printContainer.appendChild(pathIdText);

    // Print styles
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          page-break-inside: avoid;
        }
        body * {
          visibility: hidden;
        }
        .print-barcode-container, 
        .print-barcode-container * {
          visibility: visible;
        }
        .print-barcode-container {
          position: fixed;
          left: 52%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 43.5mm;
          height: 18.1mm;
          background: white;
          text-align: center;
          font-family: Arial, sans-serif;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .print-barcode-container h3 {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 1mm;
        }
        svg {
          width: 40mm;
          height: 15mm;
          display: block;
          margin: 0 auto;
        }
        .print-barcode-container p {
          font-size: 20px;
          font-weight: bold;
          text-align: center;
          margin-top: 0mm;
          color: #000;
          font-family: Arial, sans-serif;
        }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(printContainer);

    // Trigger print
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        document.body.removeChild(printContainer);
      }, 500);
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
