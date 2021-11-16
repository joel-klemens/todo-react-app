import { useState, useRef, useEffect} from 'react';
import './style-sheets/App.css';
import TodoList from './TodoList';
import TodoListList from './TodoListList';
import {v4 as uuidv4} from 'uuid';

const LOCAL_STORAGE_KEY = 'todoListItem'
const LOCAL_STORAGE_KEY_lists = 'todoListList'


function App() {
  const [selected, setSelected] = useState([])
  const [todoListList, setTodoListList] = useState([]) 
  const [todoList, setTodoList] = useState([])
  const todoListNameRef = useRef()
  const todoNameRef = useRef()

  //when the app first runs get current list of items from the local storage 
  useEffect(() => {
    const storedTodoListList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_lists))
    console.log("list list: ",storedTodoListList)
    if(storedTodoListList) setTodoListList(storedTodoListList)
  }, [])

  //when there is a change to todoListList re-render the list 
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_lists, JSON.stringify(todoListList))
    console.log("list list: ",todoListList)
  }, [todoListList])

  //when the app first runs get current list of items from the local storage 
  useEffect(() => {
    const storedTodoList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
    if(storedTodoList) setTodoList(storedTodoList)
  }, [])

  //when there is a change to todoList re-render the list 
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todoList))
  }, [todoList])

  //add a new list of todo items
  function addList(e){
    const name = todoListNameRef.current.value
    //we don't want to add empty todo item
    if (name === '') return
    setTodoListList(prevTodoListList => {
      return [...prevTodoListList, {id: uuidv4(), name: name}]
    })
    //clear out the input field
    todoListNameRef.current.value = null 
  }

  //clear a list from list of lists 
  function clearList(e){

  }

  //get the selected list to show items
  const getSelected = (e) => {
    const newTodoListList = [...todoListList]
    const todoList = newTodoListList.find(todoList => todoList.id === e.target.value)
    if(todoList) console.log('changed list selection: ',todoList)
    //here we want to set the select list and then load the to do list items based on matching listID 
    //when creating a to-do item this listID will be added to it 
  }

  //add the new todo item to the existing list 
  function addTodo(e) {
    const name = todoNameRef.current.value
    //we don't want to add empty todo item
    if (name === '') return
    setTodoList(prevTodoList => {
      return [...prevTodoList, {id: uuidv4(), listId: '1', name: name, complete: false}]
    })
    //clear out the input field
    todoNameRef.current.value = null 
  }

  //clear the todo's that have been completed (are checkmarked)
  function clearTodo(e) {
    const newTodoList = todoList.filter(todo => !todo.complete)
    setTodoList(newTodoList); 
  }

  //toggle the checkmark next to the todo item 
  function toggleTodo(id) {
    const newTodoList = [...todoList]
    const todo  = newTodoList.find(todo => todo.id === id)
    todo.complete = !todo.complete
    setTodoList(newTodoList) 
  }

  return (
    <div className="App">
      <div className="App-header">
        <h1>To-Do Organizer</h1>
        <div className="todo-lists-list">
        <h2>Enter name of a new list</h2>
          <input ref={todoListNameRef} type="text" /> 
          <div className="todo-lists-list-buttons">
            <button onClick={addList}>Add</button>
            <button onClick={clearList}>Clear</button>  
          </div>
          <div>Select a list to view items</div>
          <div className="todo-list-lists">
            <select defaultValue="Select a to-do list" onChange={e => getSelected(e)}>
              <TodoListList todoListList={todoListList} /> 
            </select>
          </div>
        </div>
        <div className="todo-list">
          <h2>Add new item to list</h2>
          <input ref={todoNameRef} type="text" /> 
          <div className="todo-list-buttons">
            <button onClick={addTodo}>Add</button>
            <button onClick={clearTodo}>Clear</button>  
          </div>
          <div>Items left to complete {todoList.filter(todo => !todo.complete).length}: </div>
          <div className="todo-list-items">
            <TodoList todoList={todoList} toggleTodo={toggleTodo}/> 
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
