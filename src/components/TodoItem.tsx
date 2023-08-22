import React from "react";
import { twMerge } from "tailwind-merge";
import { type Todo, useTodos } from "~/contexts/TodosContext";

type Props = {
  todo: Todo;
  indentLevel: number;
};

export function TodoItem({ todo, indentLevel }: Props) {
  const { completeTodo, changeTodoText, indentTodo } = useTodos();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      indentTodo(todo.id);
    }
  };

  return (
    <li style={{ marginLeft: `${indentLevel * 20}px` }} key={todo.id}>
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
          onKeyDown={(event) => handleKeyDown(event)}
          onChange={(event) => changeTodoText(event, todo.id)}
          value={todo.text}
          className={twMerge(
            "border-none bg-transparent disabled:opacity-50",
            todo.completed && "line-through"
          )}
        />
      </div>
      {todo.children.length >= 1 && (
        <ul>
          {todo.children.map((nestedTodo) => (
            <TodoItem
              key={nestedTodo.id}
              todo={nestedTodo}
              indentLevel={indentLevel + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
