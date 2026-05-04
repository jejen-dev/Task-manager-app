import React, { useState } from 'react';

const Sidebar = ({ darkMode, setDarkMode }) => {
    const [boardName, setBoardName] = useState('Default Board');
    const [boardLogo, setBoardLogo] = useState('/resources/emojis/board-logo-01.png');

    const handleAddNewBoard = () => {
        // Simulate adding a new board (reset to default)
        const newName = 'Default Board';
        const emojis = [
            '/resources/emojis/board-logo-01.png',
            '/resources/emojis/board-logo-02.png',
            '/resources/emojis/board-logo-03.png',
        ];
        const randomLogo = emojis[Math.floor(Math.random() * emojis.length)];
        setBoardName(newName);
        setBoardLogo(randomLogo);
        // In a full app, you'd also reset tasks. Here we let MainContent reset via localStorage or state.
        // For simplicity, we'll trigger a custom event or use context. We'll manage tasks in MainContent with a key.
        window.dispatchEvent(new CustomEvent('resetBoard'));
    };

    return (
        <div className="w-72 bg-[#191B1F] rounded-xl flex flex-col justify-between p-4">
            <div>
                <button className="text-white mb-6">
                    <img src="/resources/icons/Close_round.svg" alt="close" className="w-6 h-6" />
                </button>

                <div className="border border-blue-500 bg-transparent rounded-lg p-3 flex items-center gap-3 mb-3">
                    <img src={boardLogo} alt="board logo" className="w-8 h-8 rounded-full" />
                    <span className="text-white font-medium">{boardName}</span>
                </div>

                <button
                    onClick={handleAddNewBoard}
                    className="w-full flex items-center gap-3 p-3 text-gray-400 hover:text-white transition"
                >
                    <img src="/resources/icons/Add_round.svg" alt="add" className="w-5 h-5" />
                    <span>Add new board</span>
                </button>
            </div>

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
        </div>
    );
};

export default Sidebar;