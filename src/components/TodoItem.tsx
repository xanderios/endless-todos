import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { type Todo, useTodos } from "~/contexts/TodosContext";

type Props = {
  todo: Todo;
  index: number;
};

export function TodoItem({ todo, index }: Props) {
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
      <div className="group mb-2 flex items-center gap-2 md:opacity-50 md:transition-opacity md:hover:opacity-100">
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
        {todo.parentId && (
          <button
            className="rounded-md bg-charcoal-800/50 p-1 md:opacity-0 md:transition-opacity md:group-hover:opacity-100"
            aria-label="outdent todo"
            onClick={() => unindentTodo(todo.id)}
            title="Outdent Todo"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              height="1em"
              className="h-4 w-4"
              viewBox="0 0 256 512"
            >
              <path d="M9.4 278.6c-12.5-12.5-12.5-32.8 0-45.3l128-128c9.2-9.2 22.9-11.9 34.9-6.9s19.8 16.6 19.8 29.6l0 256c0 12.9-7.8 24.6-19.8 29.6s-25.7 2.2-34.9-6.9l-128-128z" />
            </svg>
          </button>
        )}
        {index >= 1 && (
          <button
            className="rounded-md bg-green-500/50 p-1 md:opacity-0 md:transition-opacity md:group-hover:opacity-100"
            aria-label="indent todo"
            onClick={() => indentTodo(todo.id)}
            title="Indent Todo"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              height="1em"
              className="h-4 w-4"
              viewBox="0 0 384 512"
            >
              <path d="M350 334.5c3.8 8.8 2 19-4.6 26l-136 144c-4.5 4.8-10.8 7.5-17.4 7.5s-12.9-2.7-17.4-7.5l-136-144c-6.6-7-8.4-17.2-4.6-26s12.5-14.5 22-14.5h88l0-192c0-17.7-14.3-32-32-32H32C14.3 96 0 81.7 0 64V32C0 14.3 14.3 0 32 0l80 0c70.7 0 128 57.3 128 128l0 192h88c9.6 0 18.2 5.7 22 14.5z" />
            </svg>
          </button>
        )}
        <button
          className="rounded-md bg-red-500/50 p-1 md:opacity-0 md:transition-opacity md:group-hover:opacity-100"
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
        {todo.children.map((childId, childIndex) => {
          const childTodo = todos.get(childId);

          if (childTodo) {
            return (
              <TodoItem
                key={childTodo.id}
                todo={childTodo}
                index={childIndex}
              />
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
