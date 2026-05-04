import React, { useState } from 'react';
import { useBoards } from '../contexts/BoardsContext';

const AddTaskButton = () => {
    const { addTask, activeBoardId } = useBoards();
    const [isAdding, setIsAdding] = useState(false);
    const [taskName, setTaskName] = useState('');

    const handleAddTask = () => {
        if (taskName.trim()) {
            addTask(activeBoardId, taskName);
            setTaskName('');
            setIsAdding(false);
        }
    };

    if (!isAdding) {
        return (
            <button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
                <img src="/resources/icons/Add_round.svg" alt="Add" className="w-5 h-5" />
                Add New Task
            </button>
        );
    }

    return (
        <div className="bg-light-card dark:bg-dark-card rounded-lg p-4 shadow-md">
            <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Task name"
                className="w-full px-3 py-2 mb-3 border rounded-lg dark:bg-dark-card dark:border-gray-600 dark:text-dark-text"
                autoFocus
            />
            <div className="flex gap-2">
                <button
                    onClick={handleAddTask}
                    className="px-4 py-2 bg-accent-green text-white rounded-lg hover:bg-opacity-90"
                >
                    Add Task
                </button>
                <button
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-lg"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default AddTaskButton;