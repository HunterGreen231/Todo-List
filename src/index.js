import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

import TodoItem from "./todo-item";
import "./styles.css";

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      todo: "",
      todos: []
    };
  }

  componentDidMount() {
    fetch("https://hg-todo-list-api.herokuapp.com/todos")
      .then(response => response.json())
      .then(data => {
        this.setState({
          todos: data
        });
      });
  }

  onChange = event => {
    this.setState({
      todo: event.target.value
    });
  };

  renderTodos = () => {
    return this.state.todos.map(item => {
      return (
        <TodoItem key={item.id} item={item} deleteItem={this.deleteItem} />
      );
    });
  };

  addTodo = event => {
    event.preventDefault();
    axios({
      method: "post",
      url: "https://hg-todo-list-api.herokuapp.com/add-todo",
      headers: { "content-type": "application/json" },
      data: {
        title: this.state.todo,
        done: false
      }
    })
      .then(data => {
        this.setState({
          todos: [...this.state.todos, data.data],
          todo: ""
        });
      })
      .catch(error => {
        console.log("An error happened: ", error);
      });
  };

  deleteItem = id => {
    fetch(`https://hg-todo-list-api.herokuapp.com/todo/${id}`, {
      method: "DELETE"
    })
      .then(
        this.setState({
          todos: this.state.todos.filter(item => {
            return item.id !== id;
          })
        })
      )
      .catch(error => {
        console.log("An error occured: ", error);
      });
  };

  render() {
    return (
      <div className="app">
        <h1>ToDo List</h1>
        <form className="add-todo" onSubmit={this.addTodo}>
          <input
            type="text"
            placeholder="Add Todo"
            onChange={this.onChange}
            value={this.state.todo}
          />
          <button type="submit">Add</button>
        </form>
        {this.renderTodos()}
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
