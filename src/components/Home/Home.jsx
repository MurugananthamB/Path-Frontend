import React, { useState, useRef, useEffect } from "react";
import JsBarcode from "jsbarcode";
import { useNavigate } from "react-router-dom";
import api from "../API/api";

const Home = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pathId: "",
    uhid: "",
    patientName: "",
    age: "",
    gender: "",
  });
  const [prefixes, setPrefixes] = useState([]);
  const [selectedPrefix, setSelectedPrefix] = useState("");
  const [fullPathId, setFullPathId] = useState("");
  const [barcodeVisible, setBarcodeVisible] = useState(false);
  const barcodeRef = useRef(null);
  const [savedPrefix, setSavedPrefix] = useState("");

  useEffect(() => {
    const fetchPrefixes = async () => {
      try {
        const response = await api.get("/api/master/get-prefixes");
        setPrefixes(response.data);
      } catch (error) {
        console.error("Failed to fetch prefixes:", error);
        alert("Error loading prefix options");
      }
    };
    fetchPrefixes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ✅ Triggered only by search icon click
  const handleUHIDSearch = async () => {
    const uhid = formData.uhid?.trim();
    if (!uhid) {
      alert("Please enter UHID");
      return;
    }

    try {
      const res = await api.get(`/api/bbpatient/uhid/${uhid}`);
      if (res.status === 200 && res.data) {
        const { name, age, gender } = res.data;

        const genderMap = {
          M: "Male",
          F: "Female",
          O: "Other",
        };
        const mappedGender = genderMap[gender?.toUpperCase()] || "Other";

        setFormData((prev) => ({
          ...prev,
          patientName: name || "",
          age: age?.toString() || "",
          gender: mappedGender,
        }));
      } else {
        alert("UHID not found in Backbone.");
      }
    } catch (error) {
      console.error("UHID fetch error:", error.message);
      alert("Error fetching UHID details.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];
    const currentTime = now.toLocaleTimeString([], { hour12: true });

    const storedUserId =
      localStorage.getItem("userId") || sessionStorage.getItem("userId");

    if (!storedUserId) {
      alert("User ID not found. Please log in again.");
      navigate("/");
      return;
    }

    const userId = String(storedUserId);

    if (
      ![
        selectedPrefix,
        formData.pathId,
        formData.uhid,
        formData.patientName,
        formData.age,
        formData.gender,
      ].every(Boolean)
    ) {
      alert("All fields, including prefix and user ID, are required.");
      return;
    }

    const ageValue = parseInt(formData.age, 10);
    if (isNaN(ageValue) || ageValue < 0 || ageValue > 99) {
      alert("Age must be between 0 and 99.");
      return;
    }

    const combinedID = `${selectedPrefix}${formData.pathId}`;
    setFullPathId(combinedID);
    setSavedPrefix(selectedPrefix);

    try {
      await api.post("/api/patients/add-patient", {
        prefix: selectedPrefix,
        pathId: formData.pathId,
        uhid: formData.uhid,
        patientName: formData.patientName,
        age: formData.age,
        gender: formData.gender,
        barcode: combinedID,
        date: currentDate,
        time: currentTime,
        userId,
      });

      setBarcodeVisible(true);

      setFormData({
        pathId: "",
        uhid: "",
        patientName: "",
        age: "",
        gender: "",
      });
      setSelectedPrefix("");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert(
        error.response?.data?.error || "Failed to save data. Please try again."
      );
    }
  };

  // ✅ First preview barcode uses same settings
  const generateBarcode = () => {
    if (barcodeRef.current && fullPathId) {
      const pathIdWithoutPrefix = fullPathId.replace(savedPrefix, "");
      JsBarcode(barcodeRef.current, pathIdWithoutPrefix, {
        format: "CODE128",
        lineColor: "#000",
        width: 2.5, // Same as print
        height: 80, // Same as print
        displayValue: false,
        margin: 0,
      });
    }
  };

  useEffect(() => {
    if (barcodeVisible) {
      generateBarcode();
    }
  }, [barcodeVisible]);

  // ✅ Your Exact Print Function - NO CHANGE
  const printBarcode = () => {
    if (!fullPathId) {
      alert("Barcode data missing. Please try again.");
      return;
    }

    const pathIdWithoutPrefix = fullPathId.replace(savedPrefix, "");

    // Remove old containers
    document
      .querySelectorAll(".print-barcode-container")
      .forEach((el) => el.remove());

    // Main container
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

    // HEADER - APH Prefix
    const heading = document.createElement("div");
    heading.textContent = `APH - ${savedPrefix}`;
    heading.style.fontSize = "18px";
    heading.style.fontWeight = "900";
    heading.style.fontFamily = "Arial, sans-serif";
    heading.style.textAlign = "center";
    heading.style.marginTop = "2mm";
    heading.style.marginBottom = "2mm";
    heading.style.color = "#000";
    printContainer.appendChild(heading);

    // BARCODE SVG - NO CHANGE
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

    // PATH ID Text BELOW barcode
    const pathIdText = document.createElement("div");
    pathIdText.textContent = pathIdWithoutPrefix;
    pathIdText.style.fontSize = "24px";
    pathIdText.style.fontWeight = "700";
    pathIdText.style.marginTop = "2mm";
    pathIdText.style.textAlign = "center";
    pathIdText.style.fontFamily = "Arial, sans-serif";
    printContainer.appendChild(pathIdText);

    // PRINT STYLE
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

    document.head.appendChild(printStyle);
    document.body.appendChild(printContainer);

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
      {/* Form Section */}
      <form
        className="bg-white p-8 rounded shadow-lg w-full max-w-md"
        onSubmit={handleSubmit}
      >
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

        <h2 className="text-2xl font-bold mb-4 text-center">
          <u>Patient Information</u>
        </h2>

        <div className="space-y-4">
          {/* Prefix + PathID */}
          <div className="flex items-center space-x-2">
            <div className="w-1/3">
              <label className="block text-gray-700 text-left font-medium">
                Prefix:
              </label>
              <select
                value={selectedPrefix}
                onChange={(e) => setSelectedPrefix(e.target.value)}
                className="w-full px-2 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select</option>
                {prefixes.map((prefix) => (
                  <option key={prefix._id} value={prefix.prefix}>
                    {prefix.prefix}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-2/3">
              <label className="block text-gray-700 text-left font-medium">
                Path ID:
              </label>
              <input
                type="text"
                name="pathId"
                value={formData.pathId}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 text-left font-medium mb-1">
              UHID:
            </label>
            <div className="relative">
              <input
                type="number"
                name="uhid"
                value={formData.uhid}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // ⛔ stop form submit
                    handleUHIDSearch(); // ✅ fetch data instead
                  }
                }}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter UHID"
                required
              />
              <div className="absolute inset-y-0 right-3 flex items-center">
                <button
                  type="button"
                  onClick={handleUHIDSearch}
                  className="text-gray-500 hover:text-blue-600"
                  title="Search"
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85zm-5.242 1.398a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Patient Name + Age */}
          {[
            { name: "patientName", label: "Patient Name", type: "text" },
            { name: "age", label: "Age", type: "number", maxLength: 2 },
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
                maxLength={field.maxLength || undefined}
                required
              />
            </div>
          ))}

          {/* Read-only Gender */}
          <div>
            <label className="block text-gray-700 text-left font-medium">
              Gender:
            </label>
            <input
              type="text"
              name="gender"
              value={formData.gender}
              readOnly
              className="w-full px-3 py-2 mt-2 border border-gray-300 rounded bg-gray-100 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
        <button
          type="button"
          className="w-full mt-4 bg-green-500 text-white py-2 rounded hover:bg-green-600"
          onClick={() => navigate("/reprint")}
        >
          Reprint Label
        </button>
      </form>

      {/* First Preview Modal */}
      {barcodeVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h3 className="text-lg font-bold mb-2">APH - {savedPrefix}</h3>
            <div id="barcode-container" className="text-center">
              <svg ref={barcodeRef}></svg>
            </div>
            <p className="text-base font-bold mt-1">
              {fullPathId.replace(savedPrefix, "")}
            </p>

            <div className="mt-4 flex justify-center items-center gap-4 bg-gray-100 p-3 rounded-lg shadow-md">
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
