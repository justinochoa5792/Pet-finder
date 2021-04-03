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
    console.log(response.data.animals);
    setPet(response.data.animals);
  };

  const showAnimals = () => {
    return pet.map((pets) => {
      return (
        <div className="row">
          <div className="col-sm-6">
            <h4>{pets.name}</h4>
            <p className="text-secondary">Status: {pets.status}</p>
            <ul className="list-group">
              <li className="list-group-item"> {pets.gender}</li>
              <li className="list-group-item"> {pets.species}</li>
              <li className="list-group-item">
                {pets.description ? pets.description : "No Description"}
              </li>
              <li className="list-group-item">Shelter ID: {pets.id}</li>
              <li className="list-group-item">
                <a href={pets.url}>Click Here to Adopt</a>
              </li>
            </ul>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="App">
      <NavBar />
      <form onSubmit={handleSubmit}>
        <input
          className="form-control form-control-lg mt-3"
          type="text"
          placeholder="Search For a Pet"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <input
          className="form-control form-control-lg mt-3"
          type="text"
          placeholder="Enter Zip"
          onChange={(e) => {
            setZip(e.target.value);
          }}
        />
        <button
          className="btn btn-dark btn-lg btn-block mt-3"
          type="submit"
          value="submit"
        >
          Find
        </button>
      </form>
      {showAnimals()}
    </div>
  );
}

export default App;
