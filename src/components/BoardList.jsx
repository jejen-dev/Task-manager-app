import React from 'react';
import { useBoards } from '../contexts/BoardsContext';

const BoardList = () => {
    const { boards, activeBoardId, setActiveBoardId, deleteBoard } = useBoards();

    const handleDelete = (boardId, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this board?')) {
            deleteBoard(boardId);
        }
    };

    const truncateBoardName = (name) => {
        if (name.length > 25) {
            return name.substring(0, 25) + '...';
        }
        return name;
    };

    return (
        <div className="space-y-2">
            {Object.values(boards).map((board) => (
                <div
                    key={board.id}
                    onClick={() => setActiveBoardId(board.id)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${activeBoardId === board.id
                        ? 'bg-accent-blue-light dark:bg-accent-blue bg-opacity-60 dark:bg-opacity-30'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img src={board.logoUrl} alt={board.name} className="w-8 h-8 rounded-full flex-shrink-0" />
                        <span className="text-black dark:text-dark-text font-medium break-words flex-1 min-w-0">
                            {truncateBoardName(board.name)}
                        </span>
                    </div>
                    {Object.keys(boards).length > 1 && (
                        <button onClick={(e) => handleDelete(board.id, e)} className="text-red-500 hover:text-red-700 opacity-50 hover:opacity-100 transition-opacity flex-shrink-0">
                            <img src="/resources/icons/Close_round.svg" alt="Delete" className="w-4 h-4 filter dark:invert-0 invert" />
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default BoardList;