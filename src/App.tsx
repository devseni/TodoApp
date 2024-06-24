import { ChangeEvent, FormEvent, useEffect, useState } from "react";

interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
}

function App() {
    const [todos, setTodos] = useState<TodoItem[]>([]);
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (inputValue.trim()) {
            const newTodo = { id: crypto.randomUUID(), text: inputValue, completed: false };
            setTodos([...todos, newTodo]);
            setInputValue("");
            localStorage.setItem("todos", JSON.stringify([...todos, newTodo]));
        }
    };

    const handleDelete = (id: string) => {
        const storedTodos = localStorage.getItem("todos");
        if (storedTodos) {
            const updatedTodos = JSON.parse(storedTodos).filter((todo: TodoItem) => todo.id !== id);
            localStorage.setItem("todos", JSON.stringify(updatedTodos));
            setTodos(updatedTodos);
        }
    };

    const handleEdit = (id: string) => {
        const todoToEdit = todos.find((todo) => todo.id === id);
        if (todoToEdit) {
            const newText = prompt("Enter new todo text", todoToEdit.text);
            if (newText !== null) {
                const updatedTodos = todos.map((todo) =>
                    todo.id === id ? { ...todo, text: newText } : todo
                );
                setTodos(updatedTodos);
                localStorage.setItem("todos", JSON.stringify(updatedTodos));
            }
        }
    };

    const handleToggle = (id: string) => {
        const updatedTodos = todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        setTodos(updatedTodos);
        localStorage.setItem("todos", JSON.stringify(updatedTodos));
    };

    useEffect(() => {
        const storedTodos = localStorage.getItem("todos");
        if (storedTodos) {
            setTodos(JSON.parse(storedTodos));
        }
    }, []);

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="font-bold text-4xl mb-10">Todo App</h1>
                <form onSubmit={handleSubmit} className="mt-4 space-x-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Enter new todo"
                        className="border p-2 rounded-lg w-[450px]"
                    />
                    <button type="submit" className="bg-indigo-500 text-white px-3 py-2 rounded-lg">
                        Add Todo
                    </button>
                </form>

                <ul className="flex flex-col mt-4 justify-between items-center gap-2 w-[550px]">
                    {todos.map((todo) => (
                        <div
                            key={todo.id}
                            className="flex bg-slate-200 p-3 rounded-lg items-center justify-between w-full"
                        >
                            <div className="flex gap-3">
                                <input type="checkbox" onClick={() => handleToggle(todo.id)} />
                                <li
                                    className={`font-bold mr-12 ${
                                        todo.completed ? "line-through" : ""
                                    }`}
                                >
                                    {todo.text}
                                </li>
                            </div>
                            <div className="space-x-3">
                                <button
                                    onClick={() => handleEdit(todo.id)}
                                    className="bg-indigo-200 px-2 py-1 rounded-md"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(todo.id)}
                                    className="bg-red-200 px-2 py-1 rounded-md"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default App;
