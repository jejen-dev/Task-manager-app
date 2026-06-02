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
        if (name.length > 25) return name.substring(0, 25) + '...';
        return name;
    };

    return (
        <div className="space-y-2">
            {Object.values(boards).map((board) => (
                <div
                    key={board.id}
                    onClick={() => setActiveBoardId(board.id)}
                    className={`flex items-center justify-between w-[272px] h-12 rounded-[45px] cursor-pointer transition-all ${activeBoardId === board.id
                        ? 'bg-transparent border border-[#3662E3]'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                >
                    <div className="flex items-center gap-3 flex-1 min-w-0 pl-2 pr-2">
                        <img src={board.logoUrl} alt={board.name} className="w-8 h-8 rounded-full flex-shrink-0" />
                        <span className="text-black dark:text-dark-text font-medium text-sm py-[15px] pl-2.5 truncate">
                            {truncateBoardName(board.name)}
                        </span>
                    </div>
                    {Object.keys(boards).length > 1 && (
                        <button onClick={(e) => handleDelete(board.id, e)} className="text-red-950 dark:text-red-950 hover:text-red-800 dark:hover:text-red-800 flex-shrink-0 mr-2">
                            <img src="/resources/icons/Close_round.svg" alt="Delete" className="w-4 h-4" brightness="0" />
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default BoardList;