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

  const [barcode, setBarcode] = useState(""); // Store barcode
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

    if (!formData.pathId) {
      alert("Path ID is required.");
      return;
    }

    const generatedBarcode = formData.pathId;

    try {
      const response = await api.post("/api/patients/add-patient", {
        ...formData,
        barcode: generatedBarcode,
        date: currentDate,
        time: currentTime,
      });

      alert(response.data.message);

      setBarcode(formData.pathId);
      setBarcodeVisible(true);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert(
        error.response?.data?.error || "Failed to save data. Please try again."
      );
    }
  };

  const generateBarcode = () => {
    if (barcodeRef.current && barcode) {
      JsBarcode(barcodeRef.current, barcode, {
        format: "CODE128",
        lineColor: "#000",
        width: 2,
        height: 60, // Reduced height to fit
        displayValue: true,
      });
    }
  };

 const printBarcode = () => {
   document
     .querySelectorAll(".print-barcode-container")
     .forEach((el) => el.remove());

   const printContainer = document.createElement("div");
   printContainer.classList.add("print-barcode-container");

   // Add "APH" text at the top (Only once)
   const heading = document.createElement("h3");
   heading.textContent = "APH";
   heading.style.fontSize = "14px";
   heading.style.fontWeight = "bold";
   heading.style.textAlign = "center";
   heading.style.margin = "5px";
   printContainer.appendChild(heading);

   // Generate new barcode instead of cloning
   const barcodeSVG = document.createElementNS(
     "http://www.w3.org/2000/svg",
     "svg"
   );
   JsBarcode(barcodeSVG, barcode, {
     format: "CODE128",
     lineColor: "#000",
     width: 2.5,
     height: 40, // Adjusted height to fit perfectly
     displayValue: false, // Prevents duplicate numbers
     margin: 5, // Provides extra spacing for clean printing
   });

   // Append barcode
   printContainer.appendChild(barcodeSVG);

   // Path ID below barcode (Only once)
   const pathIdText = document.createElement("p");
   pathIdText.textContent = barcode;
   pathIdText.style.fontSize = "12px";
   pathIdText.style.fontWeight = "bold";
   pathIdText.style.marginTop = "5px"; // Adjusted spacing
   //   pathIdText.style.margin = "2px 2px  0";
   pathIdText.style.textAlign = "center";
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
        width: 40mm;
        height: 25mm;
        transform: translate(-50%, -50%);
        background: white;
        text-align: center;
        font-family: Arial, sans-serif;
        padding: 3mm;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        page-break-after: avoid;
        border: 1px solid black; /* Optional border to check alignment */
      }
      .print-barcode-container h3 {
        font-size: 30px;
        font-weight: bold;
        margin-bottom: 5px;
      }
      svg {
       width: 25mm; /* Adjusted barcode width */
        height: 25mm; /* Adjusted barcode height */
        display: block;
        margin: 0 auto;
      }
      .print-barcode-container p {
        font-size: 12px;
        font-weight: bold;
        text-align: center;
        margin-top: 5px;
      }
    }
  `;

   document.body.appendChild(printContainer);
   document.head.appendChild(printStyle);

   window.print();

   setTimeout(() => {
     document.body.removeChild(printContainer);
     document.head.removeChild(printStyle);
   }, 500);
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
            <h3 className="text-xl font-bold mb-4">APH</h3>
            <div id="barcode-container" className="text-center">
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
