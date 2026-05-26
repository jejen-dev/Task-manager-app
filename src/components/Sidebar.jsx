
import React, { useState } from 'react';
import { useBoards } from '../contexts/BoardsContext';
import BoardList from './BoardList';
import AddBoardModal from './AddBoardModal';

const Sidebar = ({ darkMode, setDarkMode }) => {
    const { boards, activeBoardId, setActiveBoardId, addBoard } = useBoards();
    const [showDetails, setShowDetails] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleAddBoard = (boardName, logoUrl) => {
        addBoard(boardName, logoUrl);
    };

    return (
        <>
            <div className={`${showDetails ? 'w-72' : 'w-auto'} bg-dark-bg dark:bg-dark-bg rounded-xl flex flex-col p-4 h-full transition-all duration-300`}>
                <div className="flex flex-col h-full">
                    <button onClick={() => setShowDetails(!showDetails)} className="text-white mb-6 self-start w-10 h-10 rounded-full bg-[#3A3E44] flex items-center justify-center">
                        <img src={showDetails ? "/resources/icons/Close_round.svg" : "/resources/icons/Menu.svg"} alt="menu" className="w-5 h-5" />
                    </button>

                    {!showDetails ? (
                        // Mode ringkas (tidak berubah)
                        <>
                            <div className="flex flex-col items-center gap-3 overflow-y-auto hide-scrollbar">
                                {Object.values(boards).map((board) => (
                                    <button key={board.id} onClick={() => setActiveBoardId(board.id)} className={`w-10 h-10 rounded-full transition-opacity ${activeBoardId === board.id ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}>
                                        <img src={board.logoUrl} alt={board.name} className="w-full h-full rounded-full" />
                                    </button>
                                ))}
                            </div>

                            <button onClick={() => setShowModal(true)} className="flex justify-center my-4 w-full">
                                <img src="/resources/icons/Add_round_fill.svg" alt="add board" className="w-6 h-6" />
                            </button>
                            <div className="flex-1"></div>
                            <div className="flex justify-center">
                                <button onClick={() => setDarkMode(!darkMode)}>
                                    {darkMode ? <img src="/resources/icons/Moon_fill.svg" alt="dark" className="w-6 h-6" /> : <img src="/resources/icons/Sun_fill.svg" alt="light" className="w-6 h-6" />}
                                </button>
                            </div>
                        </>
                    ) : (
                        // Mode detail
                        <>
                            {/* Area scroll untuk BoardList dan tombol Add new board */}
                            <div className="flex-1 overflow-y-auto hide-scrollbar mb-4 relative">
                                <BoardList />
                                <div className="sticky bottom-0 bg-dark-bg dark:bg-dark-bg pt-2">
                                    <button onClick={() => setShowModal(true)} className="flex items-center gap-2 text-white bg-[#3A3E44] p-2 rounded-lg mt-4 w-full justify-center">
                                        <img src="/resources/icons/Add_round_fill.svg" alt="add" className="w-5 h-5" />
                                        <span>Add new board</span>
                                    </button>
                                </div>
                            </div>
                            {/* Toggle mode - di luar area scroll, tidak ikut scroll */}
                            <div className="bg-[#3A3E44] rounded-lg p-2 flex gap-2">
                                <button onClick={() => setDarkMode(true)} className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition ${darkMode ? 'bg-[#191B1F] text-white' : 'bg-transparent text-gray-400'}`}>
                                    <img src="/resources/icons/Moon_fill.svg" alt="dark" className="w-4 h-4" />
                                    <span>Dark</span>
                                </button>
                                <button onClick={() => setDarkMode(false)} className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition ${!darkMode ? 'bg-[#191B1F] text-white' : 'bg-transparent text-gray-400'}`}>
                                    <img src="/resources/icons/Sun_fill.svg" alt="light" className="w-4 h-4" />
                                    <span>Light</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>


            {showModal && <AddBoardModal onClose={() => setShowModal(false)} onAddBoard={handleAddBoard} />}
        </>
    );
};

export default Sidebar;