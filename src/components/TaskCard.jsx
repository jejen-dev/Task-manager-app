import React, { useState, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useBoards } from '../contexts/BoardsContext';
import TaskEditModal from './TaskEditModal';

const TaskCard = ({ task, index, columnId }) => {
    const { activeBoardId, moveTask } = useBoards();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const ref = useRef(null);

    const [{ isDragging }, dragRef] = useDrag({
        type: 'TASK',
        item: () => ({
            taskId: task.id,
            sourceColumnId: columnId,
            sourceIndex: index,
        }),
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    const [{ isOver }, dropRef] = useDrop({
        accept: 'TASK',
        hover: (item, monitor) => {
            if (!ref.current) return;

            const dragIndex = item.sourceIndex;
            const hoverIndex = index;
            const dragColumn = item.sourceColumnId;
            const hoverColumn = columnId;

            // Hanya proses jika dalam kolom yang sama
            if (dragColumn !== hoverColumn) return;
            if (dragIndex === hoverIndex) return;

            const hoverBoundingRect = ref.current.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            if (!clientOffset) return;
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            let newIndex = hoverIndex;
            // Drag ke bawah
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            // Drag ke atas
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
                newIndex = hoverIndex + 1;
            } else if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
                newIndex = hoverIndex;
            }

            // Panggil moveTask dengan kolom yang sama
            moveTask(activeBoardId, dragColumn, hoverColumn, dragIndex, newIndex);
            item.sourceIndex = newIndex;
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    dragRef(dropRef(ref));

    const tagColors = {
        'Concept': { bg: '#F9E4E3', text: '#B64B44' },
        'Technical': { bg: '#DEE9FC', text: '#5076E7' },
        'Design': { bg: '#FDFAC9', text: '#CDA24E' },
        'Front-end': { bg: '#E2FBE9', text: '#64AF6C' }
    };

    const truncateTaskName = (name) => {
        if (name.length > 100) return name.substring(0, 100) + '...';
        return name;
    };

    const handleClick = (e) => {
        if (!isDragging) setIsModalOpen(true);
    };

    return (
        <>
            <div
                ref={ref}
                onClick={handleClick}
                className={`bg-white dark:bg-[#191B1F] rounded-lg p-3 mb-3 shadow-sm cursor-grab hover:shadow-md transition-shadow 
                    ${isDragging ? 'opacity-50 cursor-grabbing' : ''} 
                    ${isOver ? 'border-2 border-blue-400' : ''}`}
            >
                {task.coverImage && <img src={task.coverImage} alt="Task cover" className="w-full h-32 object-cover rounded-md mb-2" />}
                <h4 className="text-sm font-medium text-black dark:text-white mb-2 break-words">{truncateTaskName(task.name)}</h4>
                {task.tags && task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {task.tags.map(tag => (
                            <span key={tag} className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: tagColors[tag]?.bg, color: tagColors[tag]?.text }}>{tag}</span>
                        ))}
                    </div>
                )}
            </div>
            {isModalOpen && <TaskEditModal task={task} onClose={() => setIsModalOpen(false)} />}
        </>
    );
};

export default TaskCard;
