import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { type Todo, useTodos } from "~/contexts/TodosContext";

type Props = {
  todo: Todo;
};

export function TodoItem({ todo }: Props) {
  const { editTodo, todos, indentTodo, unindentTodo } = useTodos();
  const [editedText, setEditedText] = useState(todo?.text ?? "");

  const handleEditTodo = () => {
    editTodo(todo.id, "text", editedText);
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
      <div className="mb-2 flex items-center gap-2 opacity-50 transition-opacity hover:opacity-100">
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
            "border-none bg-transparent focus:outline-none disabled:opacity-50",
            todo.completed && "line-through"
          )}
        />
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
