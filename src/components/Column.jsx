import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';

const Column = ({ columnId, title, tasks, color }) => {
    const colorMap = {
        'accent-red': 'border-accent-red',
        'accent-blue': 'border-accent-blue',
        'accent-yellow': 'border-accent-yellow',
        'accent-green': 'border-accent-green'
    };

    return (
        <div className={`bg-light-card dark:bg-dark-card rounded-lg shadow-md border-t-4 ${colorMap[color]} overflow-hidden`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-light-text dark:text-dark-text">{title}</h3>
                    <span className="text-sm text-light-secondary dark:text-dark-secondary bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                        {tasks.length}
                    </span>
                </div>
            </div>

            <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`p-3 min-h-[500px] max-h-[70vh] overflow-y-auto transition-colors ${snapshot.isDraggingOver ? 'bg-gray-50 dark:bg-gray-800' : ''
                            }`}
                    >
                        {tasks.map((task, index) => (
                            <TaskCard key={task.id} task={task} index={index} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default Column;