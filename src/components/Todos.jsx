import React, { useReducer, useState } from 'react';
import { Input, Button } from 'antd';
import { HeartOutlined, SaveOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

const ACTIONS = {
  ADD_TODO: 'add_todo',
  TOGGLE_LIKE: 'toggle_like',
  TOGGLE_SAVE: 'toggle_save',
  DELETE_TODO: 'delete_todo',
};

function todoReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_TODO:
      return [...state, action.payload];
    case ACTIONS.TOGGLE_LIKE:
      return state.map(todo =>
        todo.id === action.payload.id ? { ...todo, isLiked: !todo.isLiked } : todo
      );
    case ACTIONS.TOGGLE_SAVE:
      return state.map(todo =>
        todo.id === action.payload.id ? { ...todo, isSaved: !todo.isSaved } : todo
      );
    case ACTIONS.DELETE_TODO:
      return state.filter(todo => todo.id !== action.payload.id);
    default:
      return state;
  }
}

export default function TodoApp() {
  const [todos, dispatch] = useReducer(todoReducer, []);
  const [input, setInput] = useState('');

  const handleAddTodo = e => {
    e.preventDefault();
    if (!input.trim()) return;

    const newTodo = {
      id: Date.now(),
      value: input,
      isLiked: false,
      isSaved: false,
    };

    dispatch({ type: ACTIONS.ADD_TODO, payload: newTodo });
    setInput('');
  };

  return (
    <div className="max-w-lg mx-auto py-10">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Todo List</h1>
        <div className="flex justify-center gap-6 mt-4">
          <BadgeIcon count={todos.filter(todo => todo.isLiked).length} icon={<HeartOutlined />} color="bg-red-500" />
          <BadgeIcon count={todos.filter(todo => todo.isSaved).length} icon={<SaveOutlined />} color="bg-green-500" />
        </div>
      </header>

      <form onSubmit={handleAddTodo} className="flex gap-4 mb-6">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add a new task..."
          allowClear 
          size="large"
          className="w-full"
        />
        <Button htmlType="submit" type="primary" size="large">
          Add
        </Button>
      </form>

      <ul className="space-y-4">
        {todos.map((todo, index) => (
          <TodoItem key={todo.id} todo={todo} dispatch={dispatch} index={index} />
        ))}
      </ul>
    </div>
  );
}

function BadgeIcon({ count, icon, color }) {
  return (
    <div className={`w-16 h-16 flex items-center justify-center rounded-full ${color} text-white shadow-md`}>
      <div className="text-2xl">{icon}</div>
      <div className="ml-2 text-lg font-semibold">{count}</div>
    </div>
  );
}

function TodoItem({ todo, dispatch, index }) {
  return (
    <li className="bg-slate-300 shadow-md rounded-lg p-4 flex justify-between items-center">
      <span className="text-gray-800 font-medium">{`${index + 1}. ${todo.value}`}</span> 
      <div className="flex items-center space-x-4">
        <Button
          type="text"
          icon={<HeartOutlined />}
          onClick={() => dispatch({ type: ACTIONS.TOGGLE_LIKE, payload: todo })}
          className={`${todo.isLiked ? 'text-red-500' : 'text-gray-400'}`}
        />
        <Button
          type="text"
          icon={<SaveOutlined />}
          onClick={() => dispatch({ type: ACTIONS.TOGGLE_SAVE, payload: todo })}
          className={`${todo.isSaved ? 'text-green-500' : 'text-gray-400'}`}
        />
        <Button
          type="text"
          icon={<EditOutlined />}
          className="text-blue-500"
        />
        <Button
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => dispatch({ type: ACTIONS.DELETE_TODO, payload: todo })}
          className="text-red-600"
        />
      </div>
    </li>
  );
}
