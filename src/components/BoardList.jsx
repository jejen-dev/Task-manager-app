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

    return (
        <div className="space-y-2">
            {Object.values(boards).map((board) => (
                <div
                    key={board.id}
                    onClick={() => setActiveBoardId(board.id)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${activeBoardId === board.id
                        ? 'bg-accent-blue-light dark:bg-accent-blue bg-opacity-20 dark:bg-opacity-20'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <img src={board.logoUrl} alt={board.name} className="w-8 h-8 rounded-full" />
                        <span className="text-light-text dark:text-dark-text font-medium">{board.name}</span>
                    </div>
                    {Object.keys(boards).length > 1 && (
                        <button
                            onClick={(e) => handleDelete(board.id, e)}
                            className="text-red-500 hover:text-red-700 opacity-50 hover:opacity-100 transition-opacity"
                        >
                            <img src="/resources/icons/Close_round.svg" alt="Delete" className="w-4 h-4" />
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default BoardList;