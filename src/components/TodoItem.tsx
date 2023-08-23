import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { type Todo, useTodos } from "~/contexts/TodosContext";

type Props = {
  todo: Todo;
};

export function TodoItem({ todo }: Props) {
  const { todos, editTodo, deleteTodo, indentTodo, unindentTodo } = useTodos();
  const [editedText, setEditedText] = useState(todo?.text ?? "");

  const handleEditTodo = () => {
    editTodo(todo.id, "text", editedText);
  };

  const handleDeleteTodo = () => {
    deleteTodo(todo.id);
  };

  const handleToggleComplete = () => {
    editTodo(todo.id, "completed", !todo.completed);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Tab") {
      event.preventDefault();
      if (event.shiftKey) {
        // console.log("Shift + Tab");
        unindentTodo(todo.id);
      }
      if (!event.shiftKey) {
        // console.log("Tab");
        indentTodo(todo.id);
      }
    }
  };

  return (
    <div>
      <div className="group mb-2 flex items-center gap-2 opacity-50 transition-opacity hover:opacity-100">
        <input
          type="checkbox"
          onChange={handleToggleComplete}
          checked={todo.completed}
          className="h-4 w-4"
        />
        <input
          type="text"
          disabled={todo.completed}
          onChange={(e) => setEditedText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleEditTodo}
          value={editedText}
          className={twMerge(
            "w-full border-none bg-transparent focus:outline-none disabled:opacity-50",
            todo.completed && "line-through"
          )}
        />
        <button
          className="rounded-md bg-red-500 p-1 opacity-0 transition-opacity group-hover:opacity-100"
          aria-label="delete"
          onClick={handleDeleteTodo}
          title="Delete Todo"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            height="1em"
            className="h-4 w-4"
            viewBox="0 0 384 512"
          >
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </button>
      </div>

      <div className="ml-4">
        {todo.children.map((childId) => {
          const childTodo = todos.get(childId);

          if (childTodo) {
            return <TodoItem key={childTodo.id} todo={childTodo} />;
          }

          return null;
        })}
      </div>
    </div>
  );
}
