import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import TaskEditModal from './TaskEditModal';

const TaskCard = ({ task, index }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // !!PR!! Warna tag sesuai permintaan
    const tagColors = {
        'Concept': { bg: '#F9E4E3', text: '#B64B44' },
        'Technical': { bg: '#DEE9FC', text: '#5076E7' },
        'Design': { bg: '#FDFAC9', text: '#CDA24E' },
        'Front-end': { bg: '#E2FBE9', text: '#64AF6C' }
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
                        className={`bg-[#191B1F] rounded-lg p-3 mb-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow ${snapshot.isDragging ? 'opacity-50' : ''}`}
                    >
                        {task.coverImage && (
                            <img src={task.coverImage} alt="Task cover" className="w-full h-32 object-cover rounded-md mb-2" />
                        )}
                        <h4 className="text-sm font-medium text-white mb-2">{task.name}</h4>
                        {task.tags && task.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {task.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-xs px-2 py-1 rounded-full"
                                        style={{ backgroundColor: tagColors[tag]?.bg, color: tagColors[tag]?.text }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </Draggable>

            {isModalOpen && <TaskEditModal task={task} onClose={() => setIsModalOpen(false)} />}
        </>
    );
};

export default TaskCard;