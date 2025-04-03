import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JsBarcode from "jsbarcode";
import api from "../API/api";

const Reprint = () => {
  const navigate = useNavigate();
  const [pathId, setPathId] = useState("");
  const [patientData, setPatientData] = useState(null);
  const [barcodeVisible, setBarcodeVisible] = useState(false);
  const barcodeRef = useRef(null);

  const handleChange = (e) => {
    setPathId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pathId) {
      alert("Please enter a Path ID.");
      return;
    }

    try {
      const encodedPathID = encodeURIComponent(pathId);
      const response = await api.get(
        `/api/patients/get-patient/${encodedPathID}`
      );

      if (response.data) {
        setPatientData(response.data);
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

  // ✅ Preview barcode settings (same as print)
  useEffect(() => {
    if (barcodeVisible && patientData) {
      const pathIdWithoutPrefix = patientData.barcode.replace(
        patientData.prefix,
        ""
      );

      JsBarcode(barcodeRef.current, pathIdWithoutPrefix, {
        format: "CODE128",
        lineColor: "#000",
        width: 2.5,
        height: 80,
        displayValue: false,
        margin: 0,
      });
    }
  }, [barcodeVisible, patientData]);

  // ✅ Print Barcode Function (fixed)
  const printBarcode = () => {
    if (!patientData) {
      alert("Barcode data missing. Please try again.");
      return;
    }

    const pathIdWithoutPrefix = patientData.barcode.replace(
      patientData.prefix,
      ""
    );

    // Remove old containers
    document
      .querySelectorAll(".print-barcode-container")
      .forEach((el) => el.remove());

    const printContainer = document.createElement("div");
    printContainer.className = "print-barcode-container";
    printContainer.style.display = "flex";
    printContainer.style.flexDirection = "column";
    printContainer.style.alignItems = "center";
    printContainer.style.justifyContent = "flex-start";
    printContainer.style.width = "63.5mm";
    printContainer.style.height = "38.1mm";
    printContainer.style.background = "white";
    printContainer.style.margin = "0";
    printContainer.style.padding = "0";

    // Header
    const heading = document.createElement("div");
    heading.textContent = `APH - ${patientData.prefix}`;
    heading.style.fontSize = "18px";
    heading.style.fontWeight = "900";
    heading.style.fontFamily = "Arial, sans-serif";
    heading.style.textAlign = "center";
    heading.style.marginTop = "2mm";
    heading.style.marginBottom = "2mm";
    heading.style.color = "#000";
    printContainer.appendChild(heading);

    // Barcode SVG
    const barcodeSVG = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    JsBarcode(barcodeSVG, pathIdWithoutPrefix, {
      format: "CODE128",
      lineColor: "#000",
      width: 2.5,
      height: 80,
      displayValue: false,
      margin: 0,
    });
    barcodeSVG.style.margin = "0";
    barcodeSVG.style.padding = "0";
    printContainer.appendChild(barcodeSVG);

    // Path ID text
    const pathIdText = document.createElement("div");
    pathIdText.textContent = pathIdWithoutPrefix;
    pathIdText.style.fontSize = "16px";
    pathIdText.style.fontWeight = "700";
    pathIdText.style.marginTop = "2mm";
    pathIdText.style.textAlign = "center";
    pathIdText.style.fontFamily = "Arial, sans-serif";
    printContainer.appendChild(pathIdText);

    // Print Style
    const printStyle = document.createElement("style");
    printStyle.innerHTML = `
      @media print {
        @page { size: 63.5mm 38.1mm; margin: 0; }
        body * { visibility: hidden; }
        .print-barcode-container, .print-barcode-container * { visibility: visible; }
        .print-barcode-container {
          width: 63.5mm;
          height: 38.1mm;
          position: fixed;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          background: white;
          text-align: center;
          padding: 0;
          margin: 0;
        }
        svg {
          width: 90% !important;
          height: 80px !important;
          margin: 0;
          padding: 0;
        }
      }
    `;
    document.body.appendChild(printContainer);
    document.head.appendChild(printStyle);

    setTimeout(() => {
      window.print();
      setTimeout(() => {
        document.body.removeChild(printContainer);
      }, 500);
    }, 500);
  };

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  const handleReport = () => {
    navigate("/report", { replace: true });
  };


  return (
    <div className="flex justify-center items-center h-screen overflow-hidden">
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
      
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          <u>Reprint Label</u>
        </h2>

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
          <button
            type="button"
            className="w-full mt-4 bg-gray-500 text-white py-2 rounded"
            onClick={() => navigate("/home")}
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
              <b> Prefix :</b> {patientData.prefix}
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
