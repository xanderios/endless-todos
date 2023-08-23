import React, {
  createContext,
  useState,
  type ReactNode,
  useContext,
} from "react";

import todosMock from "~/mock/todos";

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  children: Array<number>;
  parentId?: number | null;
}

interface todosContextData {
  todos: Map<number, Todo>;
  addTodo: (parentId: number | null, text: string) => void;
  editTodo: <K extends keyof Todo>(
    todoId: number,
    key: K,
    value: Todo[K]
  ) => void;
  deleteTodo: (todoId: number) => void;
  indentTodo: (todoId: number) => void;
  unindentTodo: (todoId: number) => void;
}

interface TodosProviderProps {
  children: ReactNode;
}

export const TodosContext = createContext({} as todosContextData);

export function TodosProvider({ children }: TodosProviderProps) {
  // const [todos, setTodos] = useState<Map<number, Todo>>(new Map());
  const [todos, setTodos] = useState<Map<number, Todo>>(todosMock);

  const getTodo = (todoId: number): Todo | undefined => {
    const todo = todos.get(todoId);
    return todo;
  };

  const getParentTodo = (todo: Todo): Todo | undefined => {
    if (!todo?.parentId) return;
    const parent = todos.get(todo?.parentId);
    return parent;
  };

  const addTodo = (parentId: number | null, text: string) => {
    const newTodo: Todo = {
      completed: false,
      text,
      id: Date.now(),
      children: [],
      parentId: parentId ?? null,
    };

    if (parentId) {
      const parentTodo = todos.get(parentId);
      if (!parentTodo) return;
      parentTodo.children.push(newTodo.id);
      todos.set(parentId, parentTodo);
    }
    todos.set(newTodo.id, newTodo);
    setTodos(new Map(todos));
    // sortTodos();
  };

  const editTodo = <K extends keyof Todo>(
    todoId: number,
    key: K,
    value: Todo[K]
  ) => {
    const todo = getTodo(todoId);
    if (!todo) return;

    if (key === "completed" && todo.children.length > 0) {
      todo.children.forEach((childId) => {
        const child = todos.get(childId);
        if (!child) return;
        editTodo(child?.id, "completed", value as boolean);
      });

      // sortTodos();
    }

    todo[key] = value;
    todos.set(todoId, todo);
    setTodos(new Map(todos));
  };

  const deleteTodo = (todoId: number) => {
    const todo = getTodo(todoId);

    if (todo?.parentId) {
      const parentTodo = getParentTodo(todo);
      if (!parentTodo) return;

      const indexInsideParent = parentTodo.children.indexOf(todoId);

      const updatedParentChildren = [...parentTodo.children];
      updatedParentChildren.splice(indexInsideParent, 1);
      todos.set(parentTodo.id, {
        ...parentTodo,
        children: updatedParentChildren,
      });
    } else {
      todos.delete(todoId);
    }

    setTodos(new Map(todos));
  };

  const indentTodo = (todoId: number) => {
    // get todo
    const todo = getTodo(todoId);
    if (!todo) return;

    let children: number[] = [];

    if (todo.parentId) {
      // update parent children to remove todo
      const parentTodo = getParentTodo(todo);
      if (!parentTodo) return;

      deleteTodo(todoId);

      children = parentTodo.children;
    } else {
      children = Array.from(todos.values())
        .filter((todo) => !todo.parentId)
        .map((todo) => todo.id);
    }

    // get todo index
    const indexOfTodo = children.indexOf(todoId);

    // get new parent (previous todo)
    if (indexOfTodo < 1) return;
    const parentId = children[indexOfTodo - 1];
    if (!parentId) return;
    const newParent = todos.get(parentId);
    if (!newParent) return;

    // update new parent children
    const updatedNewParentChildren = [...newParent.children];
    updatedNewParentChildren.push(todoId);
    todos.set(newParent.id, {
      ...newParent,
      children: updatedNewParentChildren,
    });

    // update todo
    const updatedTodo: Todo = { ...todo, parentId: newParent.id };
    todos.set(todoId, updatedTodo);

    setTodos(new Map(todos));
  };

  const unindentTodo = (todoId: number) => {
    // get todo
    const todo = getTodo(todoId);
    if (!todo) return;

    // get parent todo
    if (!todo.parentId) return;
    const parentTodo = getParentTodo(todo);
    if (!parentTodo) return;

    // remove todo from parent children
    const indexInsideParent = parentTodo.children.indexOf(todoId);

    const updatedParentChildren = [...parentTodo?.children];
    updatedParentChildren.splice(indexInsideParent, 1);
    todos.set(parentTodo.id, {
      ...parentTodo,
      children: updatedParentChildren,
    });

    // add todo to new parent children or root
    if (!parentTodo?.parentId) {
      todos.set(todoId, todo);
      todo.parentId = null;
    } else {
      todo.parentId = parentTodo.parentId;
      const newParentTodo = todos.get(parentTodo.parentId);
      if (!newParentTodo) return;
      const updatedNewParentChildren = [...newParentTodo.children];
      updatedNewParentChildren.push(todoId);
      todos.set(newParentTodo.id, {
        ...newParentTodo,
        children: updatedNewParentChildren,
      });
    }

    setTodos(new Map(todos));
  };

  return (
    <TodosContext.Provider
      value={{
        todos,
        addTodo,
        editTodo,
        deleteTodo,
        indentTodo,
        unindentTodo,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
}

export const useTodos = () => useContext(TodosContext);
