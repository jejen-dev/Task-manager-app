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
            <div className="overflow-x-auto pb-4">
                <div className="flex gap-4 min-w-min" style={{ minWidth: 'min-content' }}>
                    {COLUMNS.map((column) => (
                        <div key={column.id} className="w-80 flex-shrink-0">
                            <Column
                                columnId={column.id}
                                title={column.title}
                                tasks={activeBoard.columns[column.id] || []}
                                color={column.color}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </DragDropContext>
    );
};

export default BoardColumns;