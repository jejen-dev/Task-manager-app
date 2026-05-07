// src/components/Sidebar.jsx
import React from 'react';
import { useBoards } from '../contexts/BoardsContext';
import BoardList from './BoardList';

const Sidebar = ({ darkMode, setDarkMode }) => {
    const { activeBoardId, boards } = useBoards();
    const activeBoard = boards[activeBoardId];

    return (
        <div className="w-72 bg-dark-bg dark:bg-dark-card rounded-xl flex flex-col p-4 h-full">
            {/* Bagian atas (board aktif dan daftar board) */}
            <div className="flex-1 flex flex-col min-h-0">
                {/* Tombol close (opsional) */}
                <button className="text-white mb-6 self-start">
                    <img src="/resources/icons/Close_round.svg" alt="close" className="w-6 h-6" />
                </button>

                {/* Board yang sedang aktif */}
                <div className="border border-blue-500 bg-transparent rounded-lg p-3 flex items-center gap-3 mb-3">
                    <img src={activeBoard?.logoUrl} alt="board logo" className="w-8 h-8 rounded-full" />
                    <span className="text-white font-medium">{activeBoard?.name}</span>
                </div>

                {/* BoardList akan discroll di dalam container ini */}
                <div className="flex-1 min-h-0">
                    <BoardList />
                </div>
            </div>

            {/* Toggle tema (tetap di bawah, tidak terdorong) */}
            <div className="bg-[#3A3E44] rounded-lg p-2 flex gap-2 mt-4">
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
        </div>
    );
};

export default Sidebar;