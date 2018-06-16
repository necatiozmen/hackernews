import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const list = [
{
  title: 'React',
  url: 'https://facebook.github.io/react/',
  author: 'Jordan Walke',
  num_comments: 3,
  points: 4,
  objectID: 0,
},
{
  title: 'Redux',
  url: 'https://github.com/reactjs/redux',
  author: 'Dan Abramov, Andrew Clark',
  num_comments: 2,
  points: 5,
  objectID: 1,
},
];

const isSearched = searchTerm => item =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list,
      searchTerm: '',
    };
    // this.onDismiss = this.onDismiss.bind(this);
  }

  onDismiss(id) {
    const updatedList = this.state.list.filter(item => item.objectID !== id);
    this.setState({ list: updatedList });
  }

  onSearchChange (e) {
    this.setState({ searchTerm: e.target.value });
  }

  render() {
    const{ searchTerm, list } = this.state;
    return (
      <div className="App">
        <Search
          value={searchTerm}
          onChange={(e) => this.onSearchChange(e)}
        >
          Search
          </Search>
        <Table
          list={ list }
          pattern={searchTerm}
          onDismiss={this.onDismiss}
        />
      </div>
    );
  }
}

const Search = ({ value, onChange, children }) =>
    <form>
      {children}
      <input
        type='text'
        value={value}
        onChange={onChange}
      />
    </form>

const Table = ({ list, pattern, onDismiss }) =>
    <div>
    {list.filter(isSearched(pattern)).map(item =>
       <div key ={item.objectID}>
          <span>{item.author}</span>
          <span>{item.num_comments}</span>
          <span>{item.points}</span><span>
            <Button
              onClick={() => this.onDismiss(item.objectID)}
              >
                Dismiss
            </Button>
          </span>
       </div>
    )}
    </div>
//
class Table extends Component {
  render() {
    const { list, pattern, onDismiss } = this.props;
    return (
      <div>
      {list.filter(isSearched(pattern)).map(item =>
         <div key ={item.objectID}>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span><span>
              <Button
                onClick={() => this.onDismiss(item.objectID)}
                >
                  Dismiss
              </Button>
            </span>
         </div>
      )}
      </div>
    );
  }
}

class Button extends Component {
  render() {
    const { onClick,
    className = '',
    children,
  } = this.props;

    return (
      <button
        onClick={onClick}
        className={className}
        type='button'
        >
        {children}
      </button>
    );
  }
}

export default App;
