import React, { useState, useEffect } from 'react';
import TaskColumn from './TaskColumn';

const initialColumns = {
    Backlog: [
        { id: '1', name: 'Default task' }
    ],
    'In Progress': [],
    'In Review': [],
    Completed: []
};

const columnConfig = [
    { id: 'Backlog', title: 'Backlog', color: 'blue' },
    { id: 'In Progress', title: 'In Progress', color: 'yellow' },
    { id: 'In Review', title: 'In Review', color: 'purple' },
    { id: 'Completed', title: 'Completed', color: 'green' }
];

const MainContent = () => {
    const [columns, setColumns] = useState(() => {
        const saved = localStorage.getItem('taskColumns');
        return saved ? JSON.parse(saved) : initialColumns;
    });

    // Reset board when add new board is clicked
    useEffect(() => {
        const handleReset = () => {
            setColumns(initialColumns);
        };
        window.addEventListener('resetBoard', handleReset);
        return () => window.removeEventListener('resetBoard', handleReset);
    }, []);

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem('taskColumns', JSON.stringify(columns));
    }, [columns]);

    const addTaskToBacklog = (taskName) => {
        if (!taskName.trim()) return;
        const newTask = {
            id: Date.now().toString(),
            name: taskName
        };
        setColumns(prev => ({
            ...prev,
            Backlog: [newTask, ...prev.Backlog]
        }));
    };

    return (
        <div className="flex-1 bg-[#3A3E44] rounded-xl p-4 overflow-x-auto">
            <div className="flex gap-4 min-w-max">
                {columnConfig.map(col => (
                    <TaskColumn
                        key={col.id}
                        title={col.title}
                        tasks={columns[col.id]}
                        color={col.color}
                        onAddTask={col.id === 'Backlog' ? addTaskToBacklog : null}
                    />
                ))}
            </div>
        </div>
    );
};

export default MainContent;