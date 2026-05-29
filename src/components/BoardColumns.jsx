import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useBoards } from '../contexts/BoardsContext';
import Column from './Column';

const COLUMNS = [
    { id: 'Backlog', title: 'Backlog', color: '#70a3f3' },
    { id: 'In Progress', title: 'In Progress', color: '#f3ce49' },
    { id: 'In Review', title: 'In Review', color: '#b787f6' },
    { id: 'Completed', title: 'Completed', color: '#77db89' }
];

const BoardColumns = () => {
    const { boards, activeBoardId, moveTask } = useBoards();
    const activeBoard = boards[activeBoardId];

    if (!activeBoard) {
        return <div className="text-center py-8">No board selected</div>;
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="grid grid-cols-4 gap-0 h-full w-full bg-white dark:bg-[#191B1F] p-4 rounded-xl">
                {COLUMNS.map((column) => (
                    <Column
                        key={column.id}
                        columnId={column.id}
                        title={column.title}
                        tasks={activeBoard.columns[column.id] || []}
                        color={column.color}
                        activeBoardId={activeBoardId}
                    />
                ))}
            </div>
        </DndProvider>
    );
};

export default BoardColumns;