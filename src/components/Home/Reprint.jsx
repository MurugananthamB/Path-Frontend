import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JsBarcode from "jsbarcode";
import api from "../API/api"; // Import the axios instance

const Reprint = () => {
  const navigate = useNavigate();
  const [pathId, setPathId] = useState(""); // Path ID input
  const [patientData, setPatientData] = useState(null); // Store patient details
  const [barcodeVisible, setBarcodeVisible] = useState(false);
  const barcodeRef = useRef(null);

  // ✅ Handle Path ID Input Change
  const handleChange = (e) => {
    setPathId(e.target.value);
  };

  // ✅ Fetch Patient Data using Path ID
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pathId) {
      alert("Please enter a Path ID.");
      return;
    }

    try {
      const response = await api.get(`/api/patients/get-patient/${pathId}`);

      if (response.data) {
        setPatientData(response.data); // ✅ Store patient details
        setBarcodeVisible(true);
      } else {
        alert("No patient found with this Path ID.");
      }
    } catch (error) {
      console.error(
        "Error fetching patient data:",
        error.response?.data || error.message
      );
      alert("Failed to fetch patient details. Please try again.");
    }
  };

  // ✅ Generate Barcode when Barcode is Visible
  useEffect(() => {
    if (barcodeVisible && patientData) {
      JsBarcode(barcodeRef.current, patientData.pathId, {
        format: "CODE128",
        lineColor: "#000",
        width: 2, // ✅ Adjusted width
        height: 50, // ✅ Adjusted height
        displayValue: true,
        margin: 0, // ✅ Reduced margin to prevent clipping
      });
    }
  }, [barcodeVisible, patientData]);

  // ✅ Print Barcode
  const printBarcode = () => {
    // Remove any existing print containers
    document.querySelectorAll(".print-barcode-container").forEach((el) => el.remove());

    const printContainer = document.createElement("div");
    printContainer.classList.add("print-barcode-container");

    // Add "APH" text at the top
    const heading = document.createElement("h3");
    heading.textContent = "APH";
    heading.style.fontSize = "14px";
    heading.style.fontWeight = "bold";
    heading.style.textAlign = "center";
    heading.style.margin = "5px";
    printContainer.appendChild(heading);

    // Generate barcode
    const barcodeSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    JsBarcode(barcodeSVG, patientData.pathId, {
      format: "CODE128",
      lineColor: "#000",
      width: 2,
      height: 40,
      displayValue: false,
      margin: 2,
    });

    // Append barcode
    printContainer.appendChild(barcodeSVG);

    // Path ID below barcode
    const pathIdText = document.createElement("p");
    pathIdText.textContent = patientData.pathId;
    pathIdText.style.fontSize = "12px";
    pathIdText.style.fontWeight = "bold";
    pathIdText.style.textAlign = "center";
    pathIdText.style.marginTop = "5px";
    printContainer.appendChild(pathIdText);

    // Print styles
    const printStyle = document.createElement("style");
    printStyle.innerHTML = `
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
    left: 50%;
    top: 50%;
    width: 38mm; /* Reduced from 40mm */
    height: 25mm;
    transform: translate(-50%, -50%);
    background: white;
    text-align: center;
    font-family: Arial, sans-serif;
    padding: 4mm 3mm; /* Adjusted left & right padding */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    page-break-after: avoid;
    border: 1px solid black; /* Optional border */
    overflow: visible; /* Ensures content is not cut */
  }
  .print-barcode-container h3 {
    font-size: 28px; /* Slightly reduced */
    font-weight: bold;
    margin-bottom: 3px;
  }
  svg {
    width: 22mm; /* Reduced width */
    height: 20mm; /* Adjusted height */
    display: block;
    margin: 0 auto;
    overflow: visible;
  }
  .print-barcode-container p {
    font-size: 10px; /* Reduced to fit */
    font-weight: bold;
    text-align: center;
    margin-top: 2px;
    letter-spacing: -0.5px; /* Slightly reduced spacing */
    word-spacing: -1px; /* Prevents cut-off effect */
    overflow: visible;
  }
}
`;

    document.body.appendChild(printContainer);
    document.head.appendChild(printStyle);
    window.print();

    setTimeout(() => {
      document.body.removeChild(printContainer);
    }, 500);
  };

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex justify-center items-center h-screen overflow-hidden">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        {/* ✅ Title */}
        <h2 className="text-2xl font-bold mb-4 text-center">
          <u>Reprint Label</u>
        </h2>

        {/* ✅ Path ID Input Field */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-left font-medium">
              Path ID:
            </label>
            <input
              type="text"
              value={pathId}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </form>

        {/* ✅ Display Patient Details if Available */}
        {patientData && (
          <div className="mt-6 p-4 bg-gray-100 rounded shadow-md">
            <h3 className="text-lg font-bold">Patient Details</h3>
            <p><b>Name:</b> {patientData.patientName}</p>
            <p><b>UHID:</b> {patientData.uhid}</p>
            <p><b>Age:</b> {patientData.age}</p>
            <p><b>Gender:</b> {patientData.gender}</p>
            <p><b>Path ID:</b> {patientData.pathId}</p>
          </div>
        )}

        {/* ✅ Show Barcode if Visible */}
        {barcodeVisible && (
          <div className="mt-4 flex flex-col items-center p-4 bg-white rounded shadow-md">
            <h3 className="text-xl font-bold mb-2">APH</h3>
            <svg ref={barcodeRef}></svg>
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
