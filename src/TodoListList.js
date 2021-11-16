import React from 'react'
import List from './List';

export default function TodoListList({ todoListList }) {
    return (
        todoListList.map(list => {
            return <List key={list.id} list={list} /> 
        })
    )
}