import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import About from "./About";
import "./index.css";

function App() {
  async function fetchAllPokemonData(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          resolve(data);
        });
    });
  }

  async function fetchPokemonData(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          resolve(data);
        });
    });
  }

  const [pokemonData, setPokemonData] = useState([]);
  const [nextUrl, setNextUrl] = useState("");
  const [prevUrl, setPrevUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const initialUrl = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=21";

  useEffect(() => {
    async function fetchData() {
      let response = await fetchAllPokemonData(initialUrl);
      setNextUrl(response.next);
      setPrevUrl(response.previous);
      await loadPokemons(response.results);
      setLoading(false);
      console.log(pokemonData);
    }
    fetchData();
  }, []);

  async function next() {
    setLoading(true);
    let data = await fetchAllPokemonData(nextUrl);
    await loadPokemons(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
  }

  async function prev() {
    if (!prevUrl) return;
    setLoading(true);
    let data = await fetchAllPokemonData(prevUrl);
    await loadPokemons(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
  }

  async function loadPokemons(data) {
    let _pokemonsData = await Promise.all(
      data.map(async (pokemon) => {
        let pokemonRecord = await fetchPokemonData(pokemon.url);
        return pokemonRecord;
      })
    );

    setPokemonData(_pokemonsData);
  }

  function handleCardClick(pokemon) {
    setSelectedPokemon(pokemon);
    setShowDetails(true);
  }

  function handelDetailClose() {
    setShowDetails(false);
    setSelectedPokemon(null);
  }

  function Card({ pokemon }) {
    return (
      <div className="Card">
        <div className="id">
          <h4>#{pokemon.id}</h4>
          <div className="name">
            <h2> REVERSE {pokemon.name}</h2>
            <div className="Img">
              <img src={pokemon.sprites.back_default} alt="" />
              <div className="Types">
                {pokemon.types.map((type) => {
                  return (
                    <div
                      className={`Card_type Card_type--${type.type.name}`}
                      key={type.type.name}
                    >
                      {type.type.name}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function Details({ pokemon, onClose }) {
    return (
      <div className="details-container">
        <div className="details-header">
          <h2> REVERSE {pokemon.name}</h2>
          <button onClick={onClose}>X</button>
        </div>
        <div className="details-body">
          <div className="details-images">

            <div className="image-wrapper">
              <h3>Normal Version</h3>
              <img src={pokemon.sprites.back_default} alt={pokemon.name} />
            </div>


            <div className="image-wrapper">
              <h3>Shiny Version</h3>
              <img src={pokemon.sprites.back_shiny} alt={pokemon.name} />
            </div>
          </div>


          <div className="details-types">
            {pokemon.types.map((type) => (
              <div
                key={type.type.name}
                className={`details-type details-type--${type.type.name}`}
              >
                {type.type.name}
              </div>
            ))}
          </div>


          <div className="Informations">
            <h3>Information</h3>
            <div>Height: {pokemon.height} Decimetres </div>
            <div>Weight: {pokemon.weight} Hectograms </div>
          </div>
        </div>
      </div>
    );
  }

  function Navigation() {
    const location = useLocation();
    let pageTitle = " THE REVERSE POKEDEX";
    if (location.pathname === "/about") {
      pageTitle = "About";
    }

    return <div className="navigation">{pageTitle}</div>;
  }

  return (
    <Router>
      <div>
        {loading ? (
          <h1> Loading... </h1>
        ) : (
          <>
            <div className="navigation">
              <Navigation />
            </div>
            <nav>
              <Link to="/">REVERSE POKEDEX</Link>

              <Link to="/about">About</Link>
            </nav>
            <Routes>
              <Route
                path="/"
                element={
                  <div className="grid-container">
                    {pokemonData.map((pokemon, index) => {
                      return (
                        <div
                          key={index}
                          onClick={() => handleCardClick(pokemon)}
                        >
                          <Card pokemon={pokemon} />
                        </div>
                      );
                    })}
                  </div>
                }
              />
              <Route path="/about" element={<About />} />
            </Routes>
            {showDetails && (
              <div className="details">
                <Details
                  pokemon={selectedPokemon}
                  onClose={handelDetailClose}
                />
              </div>
            )}
            <div className="navigation-buttons">
              <div className="prev-button">
                <button onClick={prev}>Previous</button>
              </div>
              <div className="next-button">
                <button onClick={next}>Next</button>
              </div>
            </div>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
