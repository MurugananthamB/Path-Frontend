// import React, { useState, useRef } from "react";
// import JsBarcode from "jsbarcode";


// const Home = () => {
//   const [formData, setFormData] = useState({
//     pathId: "",
//     uhid: "",
//     patientName: "",
//     age: "",
//     gender: "",
//     date: "",
//     time: "",
//   });
//   const [barcodeVisible, setBarcodeVisible] = useState(false);
//   const barcodeRef = useRef(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Get the current date and time
//     const now = new Date();
//     const currentDate = now.toISOString().split("T")[0]; // Format: YYYY-MM-DD

//     // Format time to 12-hour format
//     const hours = now.getHours();
//     const minutes = now.getMinutes();
//     const seconds = now.getSeconds();
//     const ampm = hours >= 12 ? "PM" : "AM";
//     const formattedHours = hours % 12 || 12; // Convert 0 hours to 12 for 12-hour format
//     const formattedTime = `${formattedHours
//       .toString()
//       .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
//       .toString()
//       .padStart(2, "0")} ${ampm}`;

//     try {
//       const response = await fetch(
//         "http://localhost:5000/api/patients/add-patient",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             ...formData,
//             date: currentDate,
//             time: formattedTime,
//           }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to save patient data");
//       }

//       const data = await response.json();
//       alert(data.message);

//       // Generate barcode
//       generateBarcode(formData.pathId);

//       // Show barcode popup
//       setBarcodeVisible(true);

//       // Clear form
//       setFormData({
//         pathId: "",
//         uhid: "",
//         patientName: "",
//         age: "",
//         gender: "",
//       });
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Failed to save data. Please try again.");
//     }
//   };

//   const generateBarcode = (text) => {
//     if (barcodeRef.current) {
//       JsBarcode(barcodeRef.current, text || "EMPTY", {
//         format: "CODE39", // 3 of 9 Barcode format
//         lineColor: "#000",
//         width: 2,
//         height: 100,
//         displayValue: true,
//       });
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen overflow-hidden">
//       <form
//         className="bg-white p-8 rounded shadow-lg w-full max-w-md"
//         onSubmit={handleSubmit}
//       >
//         <h2 className="text-2xl font-bold mb-4 text-center">
//           <u>Patient Information</u>
//         </h2>

//         {/* Form Fields */}
//         <div className="space-y-4">
//           {[
//             { name: "pathId", label: "Path ID", type: "text" },
//             { name: "uhid", label: "UHID", type: "text" },
//             { name: "patientName", label: "Patient Name", type: "text" },
//             { name: "age", label: "Age", type: "number" },
//           ].map((field) => (
//             <div key={field.name}>
//               <label className="block text-gray-700 text-left font-medium">
//                 {field.label}:
//               </label>
//               <input
//                 type={field.type}
//                 name={field.name}
//                 value={formData[field.name]}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>
//           ))}

//           {/* Gender Field */}
//           <div>
//             <label className="block text-gray-700 text-left font-medium">
//               Gender:
//             </label>
//             <select
//               name="gender"
//               value={formData.gender}
//               onChange={handleChange}
//               className="w-full px-3 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             >
//               <option value="">Select</option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//               <option value="other">Other</option>
//             </select>
//           </div>
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="w-full mt-6 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
//         >
//           Submit
//         </button>
//       </form>

//       {/* Barcode Popup */}
//       {barcodeVisible && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-8 rounded shadow-lg text-center">
//             <h3 className="text-xl font-bold mb-4">Generated Barcode</h3>
//             <svg ref={barcodeRef}></svg>
//             <button
//               className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//               onClick={() => setBarcodeVisible(false)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;




// Perfection Code





// import React, { useState, useRef, useEffect } from "react";
// import JsBarcode from "jsbarcode";

// const Home = () => {
//   const [formData, setFormData] = useState({
//     pathId: "",
//     uhid: "",
//     patientName: "",
//     age: "",
//     gender: "",
//   });
//   const [barcodeVisible, setBarcodeVisible] = useState(false);
//   const barcodeRef = useRef(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Get the current date and time
//     const now = new Date();
//     const currentDate = now.toISOString().split("T")[0]; // Format: YYYY-MM-DD
//     const currentTime = now.toLocaleTimeString([], { hour12: true });

//     try {
//       const response = await fetch(
//         "http://localhost:5000/api/patients/add-patient",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             ...formData,
//             date: currentDate,
//             time: currentTime,
//           }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to save patient data");
//       }

//       const data = await response.json();
//       alert(data.message);

//       // Generate barcode
//       setBarcodeVisible(true);
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Failed to save data. Please try again.");
//     }
//   };

//   const generateBarcode = () => {
//     if (barcodeRef.current && formData.pathId) {
//       JsBarcode(barcodeRef.current, formData.pathId, {
//         format: "CODE39",
//         lineColor: "#000",
//         width: 2,
//         height: 100,
//         displayValue: true,
//       });
//     }
//   };

//   useEffect(() => {
//     if (barcodeVisible) {
//       generateBarcode();
//     }
//   }, [barcodeVisible]);

//   return (
//     <div className="flex justify-center items-center h-screen overflow-hidden">
//       <form
//         className="bg-white p-8 rounded shadow-lg w-full max-w-md"
//         onSubmit={handleSubmit}
//       >
//         <h2 className="text-2xl font-bold mb-4 text-center">
//           <u>Patient Information</u>
//         </h2>

//         <div className="space-y-4">
//           {[
//             { name: "pathId", label: "Path ID", type: "text" },
//             { name: "uhid", label: "UHID", type: "text" },
//             { name: "patientName", label: "Patient Name", type: "text" },
//             { name: "age", label: "Age", type: "number" },
//           ].map((field) => (
//             <div key={field.name}>
//               <label className="block text-gray-700 text-left font-medium">
//                 {field.label}:
//               </label>
//               <input
//                 type={field.type}
//                 name={field.name}
//                 value={formData[field.name]}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>
//           ))}

//           <div>
//             <label className="block text-gray-700 text-left font-medium">
//               Gender:
//             </label>
//             <select
//               name="gender"
//               value={formData.gender}
//               onChange={handleChange}
//               className="w-full px-3 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             >
//               <option value="">Select</option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//               <option value="other">Other</option>
//             </select>
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="w-full mt-6 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
//         >
//           Submit
//         </button>
//       </form>

//  {barcodeVisible && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-8 rounded shadow-lg text-center">
//             <h3 className="text-xl font-bold mb-4">Generated Barcode</h3>
//             <div id="barcode-container">
//               <svg ref={barcodeRef}></svg>
//             </div>
//             <div className="mt-4 space-x-4">
//               <button
//                 className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//                 onClick={printBarcode}
//               >
//                 Print
//               </button>
//               <button
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                 onClick={() => setBarcodeVisible(false)}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;


// import React, { useState, useRef, useEffect } from "react";
// import JsBarcode from "jsbarcode";

// const Home = () => {
//   const [formData, setFormData] = useState({
//     pathId: "",
//     uhid: "",
//     patientName: "",
//     age: "",
//     gender: "",
//   });
//   const [barcodeVisible, setBarcodeVisible] = useState(false);
//   const barcodeRef = useRef(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const now = new Date();
//     const currentDate = now.toISOString().split("T")[0];
//     const currentTime = now.toLocaleTimeString([], { hour12: true });

//     try {
//       const response = await fetch(
//         "https://path-backend.onrender.com/api/patients/add-patient",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             ...formData,
//             date: currentDate,
//             time: currentTime,
//           }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to save patient data");
//       }

//       const data = await response.json();
//       alert(data.message);

//       setBarcodeVisible(true);
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Failed to save data. Please try again.");
//     }
//   };

//   const generateBarcode = () => {
//     if (barcodeRef.current && formData.pathId) {
//       JsBarcode(barcodeRef.current, formData.pathId, {
//         format: "CODE39",
//         lineColor: "#000",
//         width: 2,
//         height: 100,
//         displayValue: true,
//       });
//     }
//   };

//   const printBarcode = () => {
//     const barcodeContainer = document.getElementById("barcode-container");
//     if (barcodeContainer) {
//       const printWindow = window.open("", "_blank");
//       printWindow.document.write(`
//         <html>
//           <head>
//             <title>Print Barcode</title>
//             <style>
//               body {
//                 display: flex;
//                 justify-content: center;
//                 align-items: center;
//                 height: 100vh;
//                 margin: 0;
//               }
//             </style>
//           </head>
//           <body>${barcodeContainer.innerHTML}</body>
//         </html>
//       `);
//       printWindow.document.close();
//       printWindow.print();
//     }
//   };

//   useEffect(() => {
//     if (barcodeVisible) {
//       generateBarcode();
//     }
//   }, [barcodeVisible]);

//   return (
//     <div className="flex justify-center items-center h-screen overflow-hidden">
//       <form
//         className="bg-white p-8 rounded shadow-lg w-full max-w-md"
//         onSubmit={handleSubmit}
//       >
//         <h2 className="text-2xl font-bold mb-4 text-center">
//           <u>Patient Information</u>
//         </h2>

//         <div className="space-y-4">
//           {[
//             { name: "pathId", label: "Path ID", type: "text" },
//             { name: "uhid", label: "UHID", type: "text" },
//             { name: "patientName", label: "Patient Name", type: "text" },
//             { name: "age", label: "Age", type: "number" },
//           ].map((field) => (
//             <div key={field.name}>
//               <label className="block text-gray-700 text-left font-medium">
//                 {field.label}:
//               </label>
//               <input
//                 type={field.type}
//                 name={field.name}
//                 value={formData[field.name]}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>
//           ))}

//           <div>
//             <label className="block text-gray-700 text-left font-medium">
//               Gender:
//             </label>
//             <select
//               name="gender"
//               value={formData.gender}
//               onChange={handleChange}
//               className="w-full px-3 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             >
//               <option value="">Select</option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//               <option value="other">Other</option>
//             </select>
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="w-full mt-6 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
//         >
//           Submit
//         </button>
//       </form>

//       {barcodeVisible && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-8 rounded shadow-lg text-center">
//             <h3 className="text-xl font-bold mb-4">Generated Barcode</h3>
//             <div id="barcode-container">
//               <svg ref={barcodeRef}></svg>
//             </div>
//             <div className="mt-4 space-x-4">
//               <button
//                 className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//                 onClick={printBarcode}
//               >
//                 Print
//               </button>
//               <button
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                 onClick={() => setBarcodeVisible(false)}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;


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
    const barcodeContainer = document.getElementById("barcode-container");
    if (barcodeContainer) {
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Barcode</title>
            <style>
              body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
              }
            </style>
          </head>
          <body>${barcodeContainer.innerHTML}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
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
            <div id="barcode-container">
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
