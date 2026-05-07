import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useBoards } from '../contexts/BoardsContext';
import Column from './Column';

const COLUMNS = [
    { id: 'Backlog', title: 'Backlog', color: 'accent-red' },
    { id: 'In Progress', title: 'In Progress', color: 'accent-blue' },
    { id: 'In Review', title: 'In Review', color: 'accent-yellow' },
    { id: 'Completed', title: 'Completed', color: 'accent-green' }
];

const BoardColumns = () => {
    const { boards, activeBoardId, moveTask } = useBoards();
    const activeBoard = boards[activeBoardId];

    if (!activeBoard) {
        return <div className="text-center py-8">No board selected</div>;
    }

    const handleDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        moveTask(
            activeBoardId,
            source.droppableId,
            destination.droppableId,
            source.index,
            destination.index
        );
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            {/* Grid 4 kolom, tanpa overflow horizontal */}
            <div className="grid grid-cols-4 gap-4 h-full w-full">
                {COLUMNS.map((column) => (
                    <Column
                        key={column.id}
                        columnId={column.id}
                        title={column.title}
                        tasks={activeBoard.columns[column.id] || []}
                        color={column.color}
                    />
                ))}
            </div>
        </DragDropContext>
    );
};

export default BoardColumns;