import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useBoards } from '../contexts/BoardsContext';
import Column from './Column';

const COLUMNS = [
    { id: 'Backlog', title: 'Backlog', color: '#70a3f3' },
    { id: 'In Progress', title: 'In Progress', color: '#f3ce49' },
    { id: 'In Review', title: 'In Review', color: '#b787f6' },
    { id: 'Completed', title: 'Completed', color: '#77db89' }
];

const BoardColumns = () => {
    const { boards, activeBoardId, moveTask, addTask } = useBoards();
    const activeBoard = boards[activeBoardId];

    if (!activeBoard) {
        return <div className="text-center py-8">No board selected</div>;
    }

    const handleDragEnd = (result) => {
        const { destination, source } = result;
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
            <div className="grid grid-cols-4 gap-0 h-full w-full bg-[#191B1F] p-4 rounded-xl">
                {COLUMNS.map((column) => (
                    <Column
                        key={column.id}
                        columnId={column.id}
                        title={column.title}
                        tasks={activeBoard.columns[column.id] || []}
                        color={column.color}
                        onAddTask={column.id === 'Backlog' ? addTask : null}
                        activeBoardId={activeBoardId}
                    />
                ))}
            </div>
        </DragDropContext>
    );
};

export default BoardColumns;