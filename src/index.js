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
      todos: [],
      todoCompletionBarPercentage: 20,
      todosLength: 0,
      todosDone: 0
    };
  }

  componentWillMount() {
    fetch("http://localhost:5000/todos")
      .then(response => response.json())
      .then(data => {
        let todosLength = data.length;
        let todosDone = this.checkDoneAmount(data);

        this.setState({
          todos: data,
          todosLength: data.length,
          todosDone: this.checkDoneAmount(this.state.todos)
        });

        this.calculateCompletionBarPercentage(todosDone, todosLength);
      });
  }

  checkDoneAmount(data) {
    let doneAmount = 0;

    for (let todo of data) {
      if (todo.done) doneAmount++;
    }
    return doneAmount;
  }

  calculateCompletionBarPercentage(todosDone, todosLength) {
    let completionDecimal = todosDone / todosLength;
    completionDecimal = completionDecimal * 100;

    this.setState({
      todoCompletionBarPercentage: completionDecimal.toFixed(2)
    })
  }

  updateCompletionBarPercentage() {
    let completionDecimal = this.state.todosDone / this.state.todosLength;
    completionDecimal = completionDecimal * 100;

    this.setState({
      todoCompletionBarPercentage: completionDecimal.toFixed(2)
    })

    console.log(this.state.todoCompletionBarPercentage);
    console.log(completionDecimal.toFixed(2));
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

    this.updateCompletionBarPercentage();

    axios({
      method: "post",
      url: "http://localhost:5000/add-todo",
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
    fetch(`http://localhost:5000/todo/${id}`, {
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
        <div className="completion-bar-goals-wrapper">
          <div className="completion-bar-wrapper">
            <div className="completion-bar" style={{width: this.state.todoCompletionBarPercentage + '%'}}>{this.state.todoCompletionBarPercentage + '%'}</div>
          </div>
        </div>
        <div className="todo-wrapper">
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
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
