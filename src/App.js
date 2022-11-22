import { useState, useRef, useEffect } from "react";
import "./style-sheets/App.css";
import TodoList from "./TodoList";
import TodoListList from "./TodoListList";
import { v4 as uuidv4 } from "uuid";

//local storage keys for the to do lists and to do list items
const LOCAL_STORAGE_KEY_items = "todoListItem";
const LOCAL_STORAGE_KEY_lists = "todoListList";

function App() {
    //the list of to do items currently selected
    const [selected, setSelected] = useState();
    //list of to do lists
    const [todoListList, setTodoListList] = useState([]);
    //list of to do items
    const [todoList, setTodoList] = useState([]);
    //list of to do items that will display
    const [todoListDisplay, setTodoListDisplay] = useState([]);
    const todoListNameRef = useRef();
    const todoNameRef = useRef();

    //when the app first runs get current list of items from the local storage
    useEffect(() => {
        const storedTodoListList = JSON.parse(
            localStorage.getItem(LOCAL_STORAGE_KEY_lists)
        );
        //console.log("lists list: ",storedTodoListList)
        if (storedTodoListList) setTodoListList(storedTodoListList);
    }, []);

    //when there is a change to todoListList re-render the list
    useEffect(() => {
        localStorage.setItem(
            LOCAL_STORAGE_KEY_lists,
            JSON.stringify(todoListList)
        );
        //console.log("lists list: ",todoListList)
    }, [todoListList]);

    //when the app first runs get current list of items from the local storage
    useEffect(() => {
        const storedTodoList = JSON.parse(
            localStorage.getItem(LOCAL_STORAGE_KEY_items)
        );
        if (storedTodoList) setTodoList(storedTodoList);
    }, []);

    //when there is a change to todoList re-render the list
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY_items, JSON.stringify(todoList));
    }, [todoList]);

    //add a new list of todo items
    function addList(e) {
        const name = todoListNameRef.current.value;
        //we don't want to add empty todo item
        if (name === "") return;
        setTodoListList((prevTodoListList) => {
            return [...prevTodoListList, { id: uuidv4(), name: name }];
        });
        //clear out the input field
        todoListNameRef.current.value = null;
    }

    //clear a list from list of lists
    function deleteList(e) {
        const newTodoListList = todoListList.filter(
            (todoListList) => todoListList.id !== selected.id
        );
        //console.log("filtered lists list: ", newTodoListList)
        setTodoListList(newTodoListList);
        setSelected(false);
    }

    //get the selected list to show items
    const getSelected = (e) => {
        const newTodoListList = [...todoListList];
        const list = newTodoListList.find(
            (todoList) => todoList.id === e.target.value
        );
        //const tempDisplay = todoList.
        if (list) {
            //console.log('changed list selection: ',list)
            //set selected list
            setSelected(list);
            //render the items that have this parent id
            const tempDisplay = todoList.filter(
                (todoList) => todoList.listId === list.id
            );
            //console.log('display list: ', tempDisplay)
            setTodoListDisplay(tempDisplay);
        }
        //If we switch back to the default selection then hide the todo list section
        if (e.target.value === "1") {
            setSelected(false);
        }
    };

    //add the new todo item to the existing list
    function addTodo(e) {
        const name = todoNameRef.current.value;
        //the item needs to be added to both lists so we need to add the id to both
        const tempId = uuidv4();
        //check if name exists then add item to full todo list
        if (name === "") return;
        setTodoList((prevTodoList) => {
            return [
                ...prevTodoList,
                {
                    id: tempId,
                    listId: selected.id,
                    name: name,
                    complete: false,
                },
            ];
        });
        //we also want to add this to the list that is on display
        if (name === "") return;
        setTodoListDisplay((prevTodoListDisplay) => {
            return [
                ...prevTodoListDisplay,
                {
                    id: tempId,
                    listId: selected.id,
                    name: name,
                    complete: false,
                },
            ];
        });
        //clear out the input field
        todoNameRef.current.value = null;
    }

    //clear the todo's that have been completed (are checkmarked)
    function clearTodo(e) {
        const newTodoList = todoList.filter((todo) => !todo.complete);
        const newTodoListDisplay = todoListDisplay.filter(
            (todo) => !todo.complete
        );
        setTodoList(newTodoList);
        setTodoListDisplay(newTodoListDisplay);
    }

    //toggle the checkmark next to the todo item
    function toggleTodo(id) {
        //make change in to do list and todo list on display
        const newTodoList = [...todoList];
        const todo = newTodoList.find((todo) => todo.id === id);
        if (todo) {
            todo.complete = !todo.complete;
            setTodoList(newTodoList);
            const newTodoListDisplay = newTodoList.filter(
                (todoList) => todoList.listId === selected.id
            );
            setTodoListDisplay(newTodoListDisplay);
        }
    }

    return (
        <div className="App">
            <div className="App-header">
                <h1>To-Do Organizer</h1>
                <div className="todo-lists-list">
                    <h2>Create new list</h2>
                    <input ref={todoListNameRef} type="text" />
                    <div className="todo-lists-list-buttons">
                        <button onClick={addList}>Add List</button>
                    </div>
                    <div className="todo-list-lists">
                        <select
                            defaultValue={1}
                            onChange={(e) => getSelected(e)}
                        >
                            <option value={1}>To-do lists</option>
                            <TodoListList todoListList={todoListList} />
                        </select>
                        <button onClick={deleteList}>Delete List</button>
                    </div>
                </div>
                {selected ? (
                    <div className="todo-list">
                        <h2>Add new item to list</h2>
                        <input ref={todoNameRef} type="text" />
                        <div className="todo-list-buttons">
                            <button onClick={addTodo}>Add Item</button>
                            <button onClick={clearTodo}>Clear Item</button>
                        </div>
                        <div className="todo-list-items">
                            <div>
                                Items left to complete (
                                {
                                    todoListDisplay.filter(
                                        (todo) => !todo.complete
                                    ).length
                                }
                                ):{" "}
                            </div>
                            <hr className="style-one" />
                            <TodoList
                                todoList={todoListDisplay}
                                toggleTodo={toggleTodo}
                            />
                        </div>
                    </div>
                ) : (
                    <div>Select a to do list to view items</div>
                )}
            </div>
        </div>
    );
}

export default App;
