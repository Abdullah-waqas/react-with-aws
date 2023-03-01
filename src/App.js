import React, { useCallback, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

const debounce = (func, t) => {
  let timer;
  return function (...args) {
    const context = this;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      func.apply(context, args);
    }, t);
  };
};

const fetchPeople = () => {
  return fetch('https://swapi.dev/api/people').then((res) => res.json());
};

const fetchPeopleByName = (name) => {
  return fetch(`https://swapi.dev/api/people/?search=${name}`).then((res) =>
    res.json()
  );
};

const useGetPeople = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);

  const getPeople = async () => {
    try {
      setLoading(true);
      const data = await fetchPeople();
      setPeople(data.results);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  useEffect(() => {
    getPeople();
  }, []);

  const getPeopleByName = async (name) => {
    try {
      setLoading(true);
      const data = await fetchPeopleByName(name);
      setPeople(data.results);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
    // fetchPeopleByName.then((json) => {
    //   console.log(json);
    //   setPeople(json.results);
    // });
  };

  return {
    people,
    loading,
    getPeopleByName
  };
};

function App() {
  const { people, getPeopleByName, loading } = useGetPeople();

  const handleChange = (value) => {
    if (!value.trim().length) {
      return;
    }
    getPeopleByName(value);
  };

  const optimizedFn = useCallback(debounce(handleChange, 500), []);

  return (
    <div className="App">
      <input
        type="text"
        className="search"
        placeholder="Enter something here..."
        onChange={(e) => optimizedFn(e.target.value)}
      />
      {loading && <div>Loading....</div>}
      {people.length > 0 && (
        <div className="autocomplete">
          {people.map((el, i) => (
            <div key={i} className="autocompleteItems">
              <span>{el.name}</span>
            </div>
          ))}
        </div>
      )}
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and hello save to reload......==
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
