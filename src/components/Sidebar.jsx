import React, { useState } from 'react';
import { useBoards } from '../contexts/BoardsContext';
import BoardList from './BoardList';

const Sidebar = ({ darkMode, setDarkMode }) => {
    const { boards, activeBoardId, setActiveBoardId, addBoard } = useBoards();
    const [showDetails, setShowDetails] = useState(false);

    // Daftar emoji logos
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

    const handleAddNewBoard = () => {
        const boardName = `Board ${Object.keys(boards).length + 1}`;
        const randomLogo = emojiLogos[Math.floor(Math.random() * emojiLogos.length)];
        addBoard(boardName, randomLogo);
    };

    return (
        <div className={`${showDetails ? 'w-72' : 'w-auto'} bg-dark-bg dark:bg-dark-bg rounded-xl flex flex-col p-4 h-full transition-all duration-300`}>
            <div className="flex flex-col h-full">
                {/* Tombol menu */}
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-white mb-6 self-start w-10 h-10 rounded-full bg-[#3A3E44] flex items-center justify-center"
                >
                    <img
                        src={showDetails ? "/resources/icons/Close_round.svg" : "/resources/icons/Menu.svg"}
                        alt="menu"
                        className="w-5 h-5"
                    />
                </button>

                {!showDetails ? (
                    // ========== MODE RINGKAS ==========
                    <>
                        {/* Daftar semua board sebagai ikon vertikal (tanpa highlight ring) */}
                        <div className="flex flex-col items-center gap-3 overflow-y-auto">
                            {Object.values(boards).map((board) => (
                                <button
                                    key={board.id}
                                    onClick={() => setActiveBoardId(board.id)}
                                    className="w-10 h-10 rounded-full opacity-70 hover:opacity-100 transition-opacity"
                                >
                                    <img
                                        src={board.logoUrl}
                                        alt={board.name}
                                        className="w-full h-full rounded-full"
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Tombol add board (tepat di bawah board terakhir) */}
                        <button
                            onClick={handleAddNewBoard}
                            className="flex justify-center my-4 w-full"
                        >
                            <img src="/resources/icons/Add_round_fill.svg" alt="add board" className="w-6 h-6" />
                        </button>

                        {/* Spacer untuk mendorong mode ke bawah */}
                        <div className="flex-1"></div>

                        {/* Ikon mode (klik untuk toggle) */}
                        <div className="flex justify-center">
                            <button onClick={() => setDarkMode(!darkMode)}>
                                {darkMode ? (
                                    <img src="/resources/icons/Moon_fill.svg" alt="dark" className="w-6 h-6" />
                                ) : (
                                    <img src="/resources/icons/Sun_fill.svg" alt="light" className="w-6 h-6" />
                                )}
                            </button>
                        </div>
                    </>
                ) : (
                    // ========== MODE DETAIL ==========
                    <>
                        <div className="mb-4">
                            <BoardList />
                        </div>

                        {/* Tombol Add new board dengan teks */}
                        <button
                            onClick={handleAddNewBoard}
                            className="flex items-center gap-2 text-white bg-[#3A3E44] p-2 rounded-lg mb-4 w-full justify-center"
                        >
                            <img src="/resources/icons/Add_round_fill.svg" alt="add" className="w-5 h-5" />
                            <span>Add new board</span>
                        </button>

                        <div className="flex-1"></div>

                        {/* Toggle mode (dua tombol) */}
                        <div className="bg-[#3A3E44] rounded-lg p-2 flex gap-2">
                            <button
                                onClick={() => setDarkMode(true)}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition ${darkMode ? 'bg-[#191B1F] text-white' : 'bg-transparent text-gray-400'
                                    }`}
                            >
                                <img src="/resources/icons/Moon_fill.svg" alt="dark" className="w-4 h-4" />
                                <span>Dark</span>
                            </button>
                            <button
                                onClick={() => setDarkMode(false)}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition ${!darkMode ? 'bg-[#191B1F] text-white' : 'bg-transparent text-gray-400'
                                    }`}
                            >
                                <img src="/resources/icons/Sun_fill.svg" alt="light" className="w-4 h-4" />
                                <span>Light</span>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Sidebar;