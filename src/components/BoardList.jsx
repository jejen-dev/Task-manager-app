// src/components/BoardList.jsx
import React, { useState } from 'react';
import { useBoards } from '../contexts/BoardsContext';

const BoardList = () => {
    const { boards, activeBoardId, setActiveBoardId, addBoard, deleteBoard } = useBoards();
    const [isCreating, setIsCreating] = useState(false);
    const [newBoardName, setNewBoardName] = useState('');

    const emojiLogos = [
        '/resources/emojis/board-logo-01.png',
        '/resources/emojis/board-logo-02.png',
        '/resources/emojis/board-logo-03.png',
        '/resources/emojis/board-logo-04.png',
        '/resources/emojis/board-logo-05.png',
        '/resources/emojis/board-logo-06.png',
        '/resources/emojis/board-logo-07.png',
        '/resources/emojis/board-logo-08.png',
        '/resources/emojis/board-logo-09.png',
        '/resources/emojis/board-logo-10.png',
        '/resources/emojis/board-logo-11.png',
        '/resources/emojis/board-logo-12.png',
        '/resources/emojis/board-logo-13.png'
    ];

    const handleAddBoard = () => {
        if (newBoardName.trim()) {
            const randomLogo = emojiLogos[Math.floor(Math.random() * emojiLogos.length)];
            addBoard(newBoardName, randomLogo);
            setNewBoardName('');
            setIsCreating(false);
        }
    };

    const handleDeleteBoard = (boardId, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this board?')) {
            deleteBoard(boardId);
        }
    };

    return (
        <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-md p-4 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-light-text dark:text-dark-text">Boards</h2>
                <button
                    onClick={() => setIsCreating(true)}
                    className="text-light-secondary dark:text-dark-secondary hover:text-accent-blue dark:hover:text-accent-blue-light transition-colors"
                >
                    <img src="/resources/icons/Add_round_fill.svg" alt="Add board" className="w-5 h-5" />
                </button>
            </div>

            {isCreating && (
                <div className="mb-4 p-3 bg-light-bg dark:bg-dark-bg rounded-lg">
                    <input
                        type="text"
                        value={newBoardName}
                        onChange={(e) => setNewBoardName(e.target.value)}
                        placeholder="Board name"
                        className="w-full px-3 py-2 mb-2 border rounded-lg dark:bg-dark-card dark:border-gray-600 dark:text-dark-text"
                        autoFocus
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleAddBoard}
                            className="px-3 py-1 bg-accent-blue text-white rounded-lg hover:bg-opacity-90"
                        >
                            Create
                        </button>
                        <button
                            onClick={() => setIsCreating(false)}
                            className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded-lg"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Area scroll daftar board */}
            <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
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
                        <button
                            onClick={(e) => handleDeleteBoard(board.id, e)}
                            className="text-red-500 hover:text-red-700 opacity-50 hover:opacity-100 transition-opacity"
                        >
                            <img src="/resources/icons/Close_round.svg" alt="Delete" className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BoardList;