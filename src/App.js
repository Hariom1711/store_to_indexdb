import { db } from './db';
import Compressor from 'compressorjs';

function App() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const file = e.target.elements.file.files[0];
    const name = e.target.elements.name.value;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (e) => {
      const dataUrl = e.target.result;
      new Compressor(file, {
        quality: 0.6, // You can adjust the quality here
        success: async (compressedResult) => {
          const compressedDataUrl = await toDataUrl(compressedResult);
          const icon = { name, dataUrl: compressedDataUrl };
          await db.icons.put(icon);
          alert('Image saved to IndexedDB!');
        },
        error: (error) => {
          console.log(error.message);
        },
      });
    };
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const name = e.target.elements.name.value;
    const icon = await db.icons.get(name);
    if (icon) {
      const img = document.getElementById('img');
      img.src = icon.dataUrl;
      alert('Image found in IndexedDB!');
    } else {
      alert('Image not found in IndexedDB!');
    }
  };

  const toDataUrl = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.readAsDataURL(file);
    });
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
      <img id="img" src="" alt="" width={300} height={300} />
    </div>
  );
}

export default App;
