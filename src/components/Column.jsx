import React, { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';

const Column = ({ columnId, title, tasks, color, onAddTask, activeBoardId }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newTaskName, setNewTaskName] = useState('');

    const handleAddTask = () => {
        if (newTaskName.trim() && onAddTask) {
            onAddTask(activeBoardId, newTaskName);
            setNewTaskName('');
            setIsAdding(false);
        }
    };

    let borderRadiusClass = '';
    if (columnId === 'Backlog') {
        borderRadiusClass = 'rounded-l-lg rounded-r-none';
    } else if (columnId === 'Completed') {
        borderRadiusClass = 'rounded-r-lg rounded-l-none';
    } else {
        borderRadiusClass = 'rounded-none';
    }

    return (
        <div className={`bg-[#3A3E44] flex flex-col overflow-hidden h-full ${borderRadiusClass}`}>
            {/* Header kolom dengan titik warna */}
            <div className="p-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                    <h3 className="font-semibold text-white">{title}</h3>
                    <span className="text-sm text-white">
                        ({tasks.length})
                    </span>
                </div>
            </div>

            <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 p-3 transition-colors ${snapshot.isDraggingOver ? 'bg-gray-700' : ''}`}
                    >
                        {tasks.length === 0 ? (
                            <div className="text-left text-[#7E878D] bg-transparent">
                                No tasks
                            </div>
                        ) : (
                            tasks.map((task, index) => (
                                <TaskCard key={task.id} task={task} index={index} />
                            ))
                        )}
                        {provided.placeholder}

                        {/* Tombol Add new task khusus untuk kolom Backlog */}
                        {onAddTask && !isAdding && (
                            <button
                                onClick={() => setIsAdding(true)}
                                className="mt-3 w-full flex items-center justify-between px-4 py-2 rounded-lg"
                                style={{ backgroundColor: '#c3dbfb', color: '#2b4ecf' }}
                            >
                                <span>Add new task</span>
                                <img src="/resources/icons/Add_round.svg" alt="add" className="w-5 h-5" />
                            </button>
                        )}

                        {isAdding && onAddTask && (
                            <div className="mt-3 bg-[#191B1F] rounded-lg p-3">
                                <input
                                    type="text"
                                    value={newTaskName}
                                    onChange={(e) => setNewTaskName(e.target.value)}
                                    placeholder="Task name"
                                    className="w-full bg-transparent text-white border border-gray-600 rounded px-2 py-1 mb-2"
                                    autoFocus
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleAddTask}
                                        className="bg-blue-600 text-white px-3 py-1 rounded"
                                    >
                                        Add
                                    </button>
                                    <button
                                        onClick={() => setIsAdding(false)}
                                        className="bg-gray-600 text-white px-3 py-1 rounded"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default Column;