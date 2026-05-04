import React, { useState } from 'react';

const TaskColumn = ({ title, tasks, color, onAddTask }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newTaskName, setNewTaskName] = useState('');

    const colorDot = {
        blue: 'bg-blue-500',
        yellow: 'bg-yellow-500',
        purple: 'bg-purple-500',
        green: 'bg-green-500'
    };

    const handleAdd = () => {
        if (newTaskName.trim()) {
            onAddTask(newTaskName);
            setNewTaskName('');
            setIsAdding(false);
        }
    };

    return (
        <div className="w-80 bg-[#3A3E44] rounded-lg flex flex-col">
            <div className="p-4 border-b border-gray-600 flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${colorDot[color]}`}></div>
                <h3 className="text-white font-semibold">{title}</h3>
                <span className="text-gray-400 text-sm ml-auto">({tasks.length})</span>
            </div>

            <div className="flex-1 p-3 space-y-3">
                {tasks.length === 0 ? (
                    <div className="text-center text-[#7E878D] py-8">No tasks</div>
                ) : (
                    tasks.map(task => (
                        <div key={task.id} className="bg-[#191B1F] rounded-lg p-3 text-white">
                            {task.name}
                        </div>
                    ))
                )}

                {onAddTask && (
                    <div className="mt-3">
                        {!isAdding ? (
                            <button
                                onClick={() => setIsAdding(true)}
                                className="w-full bg-blue-100 text-blue-800 rounded-lg py-2 px-3 flex items-center justify-between hover:bg-blue-200 transition"
                            >
                                <span>Add new task card</span>
                                <img src="/resources/icons/Add_round.svg" alt="add" className="w-5 h-5" />
                            </button>
                        ) : (
                            <div className="bg-[#191B1F] rounded-lg p-3">
                                <input
                                    type="text"
                                    value={newTaskName}
                                    onChange={(e) => setNewTaskName(e.target.value)}
                                    placeholder="Task name"
                                    className="w-full bg-transparent text-white border border-gray-600 rounded px-2 py-1 mb-2"
                                    autoFocus
                                />
                                <div className="flex gap-2">
                                    <button onClick={handleAdd} className="bg-blue-600 text-white px-3 py-1 rounded">Add</button>
                                    <button onClick={() => setIsAdding(false)} className="bg-gray-600 text-white px-3 py-1 rounded">Cancel</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskColumn;