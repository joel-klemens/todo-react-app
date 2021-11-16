import React from 'react'

export default function List({ list }) {
    return (
        <option value={list.id}>
            {list.name}
        </option>
    )
}
