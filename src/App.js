import './App.css';
import { db } from './db';
import lzutf8 from 'lzutf8';

function App() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const file = e.target.elements.file.files[0];
    const name = e.target.elements.name.value;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (e) => {
      const dataUrl = e.target.result;
      const icon = { name };
      const compressedDataUrl = await compressDataUrl(dataUrl);
      icon.dataUrl = compressedDataUrl;
      await db.icons.put(icon);
      alert('Image saved to IndexedDB!');
    };
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const name = e.target.elements.name.value;
    const icon = await db.icons.get(name);
    if (icon) {
      const decompressedDataUrl = await decompressDataUrl(icon.dataUrl);
      const img = document.getElementById('img');
      img.src = decompressedDataUrl;
      alert('Image found in IndexedDB!');
    } else {
      alert('Image not found in IndexedDB!');
    }
  };

  const compressDataUrl = async (dataUrl) => {
    const binaryString = await fetch(dataUrl).then(res => res.blob()).then(blob => new Promise(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.readAsBinaryString(blob);
    }));
    const compressed = lzutf8.compress(binaryString, { outputEncoding: "StorageBinaryString" });
    const compressedDataUrl = 'data:image/jpeg;base64,' + btoa(compressed);
    return compressedDataUrl;
  };

  const decompressDataUrl = async (compressedDataUrl) => {
    const compressed = atob(compressedDataUrl.split(',')[1]);
    const decompressed = lzutf8.decompress(compressed, { inputEncoding: "StorageBinaryString" });
    const blob = new Blob([decompressed], { type: 'image/jpeg' });
    const dataUrl = URL.createObjectURL(blob);
    return dataUrl;
  };

  return (
    <div className="App">
      <h1>IndexedDB Image Storage</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Icon Name:</label>
        <input type="text" id="name" name="name" />
        <br />
        <label htmlFor="file">Icon Image:</label>
        <input type="file" id="file" name="file" />
        <br />
        <button type="submit">Save Image</button>
      </form>
      <br />
      <form onSubmit={handleSearch}>
        <label htmlFor="name">Search Icon:</label>
        <input type="text" id="name" name="name" />
        <button type="submit">Search</button>
      </form>
      <br />
      <img id="img" src="" alt="" width={300} height={300}/>
    </div>
  );
}

export default App;
