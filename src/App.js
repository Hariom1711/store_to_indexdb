import React, { useState } from "react";
import "./App.css";
import Compressor from "compressorjs";

function App() {
  const [imageData, setImageData] = useState("");

  const handleChange = (e) => {
    const file = e.target.files[0];
    new Compressor(file, {
      quality: 0.6,
      success: (compressedResult) => {
        const reader = new FileReader();
        reader.readAsDataURL(compressedResult);
        reader.onload = (event) => {
          setImageData(event.target.result);
        };
      },
      error: (error) => {
        console.log("Error occurred while compressing image: ", error);
      },
    });
  };

  const saveToIndexDB = () => {
    const request = window.indexedDB.open("MyDatabase", 1);
    request.onerror = (event) => {
      console.log("Database error: ", event.target.errorCode);
    };
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(["MyObjectStore"], "readwrite");
      const objectStore = transaction.objectStore("MyObjectStore");
      const data = { image: imageData };
      const request = objectStore.add(data);
      request.onsuccess = (event) => {
        console.log("Image added to IndexedDB");
      };
      request.onerror = (event) => {
        console.log("Error occurred while adding image to IndexedDB: ", event.target.errorCode);
      };
    };
  };

  return (
    <div className="App">
      <h1>Image Compression and Storage</h1>
      <input type="file" accept="image/*" onChange={handleChange} />
      <button onClick={saveToIndexDB} disabled={!imageData}>
        Save to IndexedDB
      </button>
      {imageData && (
        <div>
          <img src={imageData} alt="Selected" style={{ maxWidth: "300px" }} />
        </div>
      )}
    </div>
  );
}

export default App;
