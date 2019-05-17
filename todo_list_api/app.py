from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

app = Flask(__name__)

basedir = os.path.abspath(os.path.dirname(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(basedir, "app.sqlite")

CORS(app)

db = SQLAlchemy(app)

class Todo(db.Model):
    __tablename__="todos"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    done = db.Column(db.Boolean)
    
    def __init__(self, title, done):
        self.title = title
        self.done = done

@app.route("/todos", methods=["GET"])
def get_todos():
    all_todos = db.session.query(Todo.id, Todo.title, Todo.done).all()
    return jsonify(all_todos)

@app.route("/add-todo", methods=["POST"])
def add_todo():
    if request.content_type == "application/json":
        post_data = request.get_json()

        title = post_data.get("title")
        done = post_data.get("done")

        record = Todo(title,done)
        db.session.add(record)
        db.session.commit()
        return jsonify([record.id, record.title, record.done]) 
    return jsonify("An error occured. Only post application/json")

@app.route("/todo/<id>", methods=["PUT"])
def update_todo(id):
    if request.content_type == "application/json":
        put_data = request.get_json()

        new_title = put_data.get("title")
        new_done = put_data.get("done")

        record = db.session.query(Todo).get(id)
        print("Record: ", record)
        record.title = new_title
        record.done = new_done

        db.session.commit()
        return jsonify("Update successfull!")
    return jsonify("!Update failed!")

@app.route("/todo/<id>", methods=["DELETE"])
def delete_todo(id):
    record = db.session.query(Todo).get(id)
    db.session.delete(record)
    db.session.commit()

    return jsonify("Record Deleted!")

if __name__ == "__main__":
    app.debug = True
    app.run()