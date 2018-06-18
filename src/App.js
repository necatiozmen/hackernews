import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const isSearched = searchTerm => item =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
  }

  setSearchTopStories(results) {
    const  { hits, page } = results;
    const { searchKey } = this.state;

    const oldHits = page !== 0
    ? this.state.result.hits
    : [];

    const updatedHits = [
      ...oldHits,
      ...hits,
    ];

    this.setState({
      results: {
        ...results,
        [searchKey]:  { hits: updatedHits, page },
      },
    });
  }

  needsToSearchTopStories = searchTerm => {
      !this.state.results[searchTerm];
    };

  onSearchSubmit = (event) => {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }

    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  };

  fetchSearchTopStories(searchTerm, page = 0) {
    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(result => this._isMounted && this.setSearchTopStories(result.data))
      .catch(error => this._isMounted && this.setState({ error }));
  };

  componentDidMount() {
    this._isMounted = true;

    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
    this.setState({ searchKey: searchTerm });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onDismiss = (id) => {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);

    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page },
      },
    });

    this.setState({
      results:  { ...this.state.results, hits: updatedHits },
    });

  };

  onSearchChange (e) {
    this.setState({ searchTerm: e.target.value });
  }

  render() {
    const{ searchTerm, results, searchKey, error } = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (
      results &&
      results[searchKey] &&
      results[searchKey].hits
      ) || [];

    if (!results) { return null; }

    if (error) { return <p>Something went wrong</p>;};

    return (
      <div className="page">
        <div className="interactions">
        <Search
          value={searchTerm}
          onChange={(e) => this.onSearchChange(e)}
          onSubmit={this.onSearchSubmit}
        >
          Search
          </Search>
        </div>
        { results &&
           <Table
          list={ results.hits }
          onDismiss={this.onDismiss}
        />
      }
      <div className="interactions">
        <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
          More
        </Button>
      </div>
      { error
        ? <div className="interactions">
          <p>Something went wrong.</p>
        </div>
        : <Table
          list={list}
          onDismiss={this.onDismiss}
        />
      }
      </div>
    );
  }
}

const Search = ({ value, onChange, onSubmit, children }) =>
    <form onSubmit={onSubmit}>
      {children}
      <input
        type='text'
        value={value}
        onChange={onChange}
      />
      <button type="submit">
        {children}
      </button>
    </form>;

const Table = ({ list, onDismiss }) =>
    <div className="table">
    {list.map(item =>
       <div key ={item.objectID} className="table-row">
         <span style={{ width: '40%' }}>
           <a href={item.url}>{item.title}</a>
           </span>
           <span style={{ width: '30%' }}>
           {item.author}
           </span>
           <span style={{ width: '10%' }}>
           {item.num_comments}
           </span>
           <span style={{ width: '10%' }}>
           {item.points}
           </span>
           <span style={{ width: '10%' }}>
            <Button
              onClick={() => onDismiss(item.objectID)}
              className="button-inline"
              >
                Dismiss
            </Button>
          </span>
       </div>
    )}
  </div>;

const Button = ({ onClick, className = '', children }) =>
<button
  onClick={onClick}
  className={className}
  type='button'
  >
  {children}
</button>;

export default App;
