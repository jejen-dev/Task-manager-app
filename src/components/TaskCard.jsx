import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import TaskEditModal from './TaskEditModal';

const TaskCard = ({ task, index }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const tagColors = {
        'Concept': 'bg-accent-yellow-light text-accent-yellow',
        'Technical': 'bg-accent-blue-light text-accent-blue',
        'Design': 'bg-purple-100 text-purple-800',
        'Front-end': 'bg-accent-green-light text-accent-green'
    };

    return (
        <>
            <Draggable draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => setIsModalOpen(true)}
                        className={`bg-white dark:bg-gray-800 rounded-lg p-3 mb-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow ${snapshot.isDragging ? 'dragging' : ''
                            }`}
                    >
                        {task.coverImage && (
                            <img
                                src={task.coverImage}
                                alt="Task cover"
                                className="w-full h-32 object-cover rounded-md mb-2"
                            />
                        )}
                        <h4 className="text-sm font-medium text-light-text dark:text-dark-text mb-2">
                            {task.name}
                        </h4>
                        {task.tags && task.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {task.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className={`text-xs px-2 py-1 rounded-full ${tagColors[tag] || 'bg-gray-100 text-gray-700'}`}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </Draggable>

            {isModalOpen && (
                <TaskEditModal task={task} onClose={() => setIsModalOpen(false)} />
            )}
        </>
    );
};

export default TaskCard;