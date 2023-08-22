import React, {
  createContext,
  useState,
  type ReactNode,
  useContext,
} from "react";

export interface Todo {
  text: string;
  completed: boolean;
  id: number;
  children: Todo[];
}

interface todosContextData {
  todos: Todo[];
  newTodoInput: string;
  handleNewTodoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addNewTodo: () => void;
  changeTodoText: (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => void;
  completeTodo: (id: number) => void;
  indentTodo: (id: number) => void;
}

interface TodosProviderProps {
  children: ReactNode;
}

export const TodosContext = createContext({} as todosContextData);

export function TodosProvider({ children }: TodosProviderProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoInput, setNewTodoInput] = useState("");

  const addNewTodo = () => {
    if (newTodoInput.trim() === "") return;

    const newTodo: Todo = {
      completed: false,
      text: newTodoInput,
      id: Date.now(),
      children: [],
    };
    setTodos([...todos, newTodo]);
    setNewTodoInput("");
  };

  const handleNewTodoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoInput(e.currentTarget.value);
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

  const indentTodo = (id: number) => {
    const newTodos: Todo[] = [...todos]; // Create a copy of the todos array

    // Find the todo to be indented and its parent todo
    const childIndex = newTodos.findIndex((todo) => todo.id === id);

    if (childIndex === -1) return; // Todo not found
    if (childIndex === 0) return; // Already at the top, can't be indented

    const childTodo = newTodos.splice(childIndex, 1)[0]; // Remove the child todo from the array

    // Indent by adding the child todo as a child todo of the previous todo
    const parentIndex = childIndex - 1;
    newTodos[parentIndex]?.children.push(childTodo!);

    // Update the todos state
    setTodos(newTodos);
  };

  return (
    <TodosContext.Provider
      value={{
        todos,
        newTodoInput,
        handleNewTodoChange,
        addNewTodo,
        changeTodoText,
        completeTodo,
        indentTodo,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
}

export const useTodos = () => useContext(TodosContext);
