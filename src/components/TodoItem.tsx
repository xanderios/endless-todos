import React from "react";
import { twMerge } from "tailwind-merge";
import { type Todo } from "~/pages";

type Props = {
  todo: Todo;
};

export function TodoItem({ todo }: Props) {
  const { text, completed } = todo;

  const handleKeypress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addNewTodo();
    }
  };

  const completeTodo = (id: number) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
      }
      return todo;
    });
    setTodos(newTodos);
  };

  const changeTodoText = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.text = event.currentTarget.value;
      }
      return todo;
    });
    setTodos(newTodos);
  };

  return (
    <li className="" key={todo.id}>
      <div className="flex gap-2">
        <input
          type="checkbox"
          onChange={() => {
            completeTodo(todo.id);
          }}
          checked={todo.completed}
        />
        <input
          disabled={todo.completed}
          onChange={(e) => changeTodoText(e, todo.id)}
          value={todo.text}
          className={twMerge(
            "border-none bg-transparent disabled:opacity-50",
            todo.completed && "line-through"
          )}
        />
      </div>
    </li>
  );
}
