import { useState } from "react";
import Axios from "axios";
import "./App.css";
import NavBar from "./NavBar";

function App() {
  const [search, setSearch] = useState("");
  const [zip, setZip] = useState("");
  const [pet, setPet] = useState([]);

  let token;
  // get the token first
  fetch("https://api.petfinder.com/v2/oauth2/token", {
    body: `grant_type=client_credentials&client_id=${process.env.REACT_APP_KEY}&client_secret=${process.env.REACT_APP_SECRET}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => {
      token = data.access_token;
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await Axios.get(
      `https://api.petfinder.com/v2/animals/?type=${search}&location=${zip}&callback=callback`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);
    setSearch(response.data);
  };

  return (
    <div className="App">
      <NavBar />
      <h1>Hello World</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search For a Pet"
          onChange={(evt) => {
            setSearch(evt.target.name);
          }}
        />
        <input
          type="text"
          value={zip}
          placeholder="Enter Zip"
          onChange={(evt) => {
            setZip(evt.target.value);
          }}
        />
        <button type="submit" value="submit">
          Button
        </button>
      </form>
    </div>
  );
}

export default App;
