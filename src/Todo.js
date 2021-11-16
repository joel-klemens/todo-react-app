import React from 'react'

export default function Todo({ todo, toggleTodo }) {
    //toggle the check mark next to the todo - calls to function in app.js 
    function todoCheck() {
        toggleTodo(todo.id) 
    }
    return (
        <div>
            <input type="checkbox" checked={todo.complete} onChange={todoCheck} /> 
            {todo.name}
        </div>
    )
}
