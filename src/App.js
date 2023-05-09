import './App.css';
import { db } from './db';

function App() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const file = e.target.elements.file.files[0];
    const name = e.target.elements.name.value;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (e) => {
      const dataUrl = e.target.result;
      const icon = { name, dataUrl };
      await db.icons.put(icon);
      alert('Image saved to IndexedDB!');
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
