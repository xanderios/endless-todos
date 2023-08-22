import React, {
  createContext,
  useState,
  type ReactNode,
  useContext,
} from "react";

interface todosContextData {}

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
    };
    setTodos([...todos, newTodo]);
    setNewTodoInput("");
  };

  const handleKeypress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addNewTodo();
    }
  };

  const handleNewTodoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoInput(e.currentTarget.value);
  };

  return <TodosContext.Provider value={{}}>{children}</TodosContext.Provider>;
}

export const useTodos = () => useContext(TodosContext);
