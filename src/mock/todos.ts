import { type Todo } from "~/contexts/TodosContext";

const todos = new Map<number, Todo>([
  [
    1692777006717,
    {
      id: 1692777006717,
      text: "Refactor Code",
      completed: false,
      children: [],
      parentId: null,
    },
  ],
  [
    1692777006718,
    {
      id: 1692777006718,
      text: "Study",
      completed: false,
      children: [1692777007668, 1692777011471, 1692777011910],
      parentId: null,
    },
  ],
  [
    1692777007668,
    {
      id: 1692777007668,
      text: "Study Typescript",
      completed: false,
      children: [],
      parentId: 1692777006718,
    },
  ],
  [
    1692777011471,
    {
      id: 1692777011471,
      text: "Study Prisma",
      completed: false,
      children: [],
      parentId: 1692777006718,
    },
  ],
  [
    1692777011910,
    {
      id: 1692777011910,
      text: "Study Data Structures",
      completed: false,
      children: [],
      parentId: 1692777006718,
    },
  ],
]);

export default todos;
