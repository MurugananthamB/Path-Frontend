import React, { useState, useRef, useEffect } from "react";
import JsBarcode from "jsbarcode";
import api from "../API/api"; // Import the axios instance

const Home = () => {
  const [formData, setFormData] = useState({
    pathId: "",
    uhid: "",
    patientName: "",
    age: "",
    gender: "",
  });
  const [barcodeVisible, setBarcodeVisible] = useState(false);
  const barcodeRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];
    const currentTime = now.toLocaleTimeString([], { hour12: true });

    try {
      const response = await api.post("/api/patients/add-patient", {
        ...formData,
        date: currentDate,
        time: currentTime,
      });

      alert(response.data.message); // Notify the user of success
      setBarcodeVisible(true); // Display barcode
    } catch (error) {
      console.error("Error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to save data. Please try again."
      );
    }
  };

  const generateBarcode = () => {
    if (barcodeRef.current && formData.pathId) {
      JsBarcode(barcodeRef.current, formData.pathId, {
        format: "CODE39",
        lineColor: "#000",
        width: 2,
        height: 100,
        displayValue: true,
      });
    }
  };

const printBarcode = () => {
  const barcodeContainer = document.querySelector("#barcode-container"); // Select the barcode div
  if (barcodeContainer) {
    // Clone the barcode content
    const printContent = barcodeContainer.cloneNode(true);

    // Create a print-specific container
    const printContainer = document.createElement("div");
    printContainer.classList.add("print-barcode-container");

    printContainer.appendChild(printContent); // Use the existing structure

    // Add optimized print styles to fit within one page
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
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: auto;
          height: auto;
          display: flex;
          justify-content: center;
          align-items: center;
          background: white;
        }

        #barcode-container {
          text-align: center;
          padding: 10px;
          border: 2px solid black;
          width: max-content;
          height: max-content;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        svg {
          max-width: 100%;
        }

        /* Ensure only one page is used */
        html, body {
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        /* Prevent extra blank pages */
        .print-barcode-container {
          max-height: 100vh;
        }
      }
    `;

    // Append the style and barcode content for printing
    document.body.appendChild(printContainer);
    document.head.appendChild(printStyle);

    // Trigger the print
    window.print();

    // Remove the print elements after printing
    setTimeout(() => {
      document.body.removeChild(printContainer);
      document.head.removeChild(printStyle);
    }, 500);
  } else {
    alert("Barcode not found!");
  }
};



  useEffect(() => {
    if (barcodeVisible) {
      generateBarcode();
    }
  }, [barcodeVisible]);

  return (
    <div className="flex justify-center items-center h-screen overflow-hidden">
      <form
        className="bg-white p-8 rounded shadow-lg w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          <u>Patient Information</u>
        </h2>

        <div className="space-y-4">
          {[
            { name: "pathId", label: "Path ID", type: "text" },
            { name: "uhid", label: "UHID", type: "text" },
            { name: "patientName", label: "Patient Name", type: "text" },
            { name: "age", label: "Age", type: "number" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-gray-700 text-left font-medium">
                {field.label}:
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          ))}

          <div>
            <label className="block text-gray-700 text-left font-medium">
              Gender:
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>

      {barcodeVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg text-center">
            <h3 className="text-xl font-bold mb-4">Generated Barcode</h3>
            <div id="barcode-container" className="text-center">
              {/* Logo and Hospital Name */}
              <div className="flex items-center justify-center mb-2">
                <span className="text-lg font-bold">APH</span>
              </div>
              {/* Barcode SVG */}
              <svg ref={barcodeRef}></svg>
            </div>
            <div className="mt-4 space-x-4">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={printBarcode}
              >
                Print
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => setBarcodeVisible(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
