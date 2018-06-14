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

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list,
    };
  }

  render() {
    const helloWorld = 'Welcome to Road to Learn React';
    const name = 'Necati';
    const surname = 'Ozmen';
    return (
      <div className="App">
        {list.map(item =>
       <div key ={item.objectID}>
          <span>{item.author}</span>
          <span>{item.num_comments}</span>
          <span>{item.points}</span><span>
            <button
              onClick={() => this.onDismiss(item.objectID)}
              type="button"
              >
                Dismiss
            </button>
          </span>
       </div>
        )}

      </div>
    );
  }
}

export default App;
