import React, { useState } from 'react';
import { useBoards } from '../contexts/BoardsContext';
import BoardList from './BoardList';
import AddBoardModal from './AddBoardModal';

// Komponen Sidebar (menu kiri aplikasi)
const Sidebar = ({ darkMode, setDarkMode }) => {
    const { boards, activeBoardId, setActiveBoardId, addBoard } = useBoards();
    const [showDetails, setShowDetails] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleAddBoard = (boardName, logoUrl) => {
        addBoard(boardName, logoUrl);
    };

    return (
        <>
            <div className={`${showDetails ? 'w-[272px]' : 'w-auto'} bg-white dark:bg-dark-bg rounded-xl flex flex-col h-full`}>
                <div className="flex flex-col h-full px-0 py-0">
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="text-black dark:text-white mt-1 mb-7 w-10 h-10 rounded-full bg-[#EEF4FC] dark:bg-[#3A3E44] flex items-center justify-center flex-shrink-0 p-2"
                        style={{ borderRadius: '50%' }}
                    >
                        <img
                            src={showDetails ? "/resources/icons/Close_round.svg" : "/resources/icons/Menu.svg"}
                            alt="menu"
                            className="w-6 h-6 filter dark:invert-0 invert"
                        />
                    </button>

                    {!showDetails ? (
                        // Mode ringkas: hanya icon board, tombol tambah board, dan dark mode toggle
                        <>
                            <div className="flex flex-col items-center gap-3 overflow-y-auto hide-scrollbar p-1">
                                {Object.values(boards).map((board) => (
                                    <button
                                        key={board.id}
                                        onClick={() => setActiveBoardId(board.id)}
                                        className={`w-10 h-10 rounded-full transition-all ${activeBoardId === board.id ? 'ring-2 ring-[#3662E3] ring-offset-2 ring-offset-white dark:ring-offset-dark-bg' : ''}`}
                                    >
                                        <img src={board.logoUrl} alt={board.name} className="w-full h-full rounded-full" />
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => setShowModal(true)} className="flex justify-center my-3 w-full">
                                <img src="/resources/icons/Add_round_fill.svg" alt="add board" className="w-6 h-6 filter dark:invert-0 invert" />
                            </button>
                            <div className="flex-1"></div>
                            <div className="flex justify-center">
                                <button onClick={() => setDarkMode(!darkMode)} className="mb-1">
                                    {darkMode ? (
                                        <img src="/resources/icons/Moon_fill.svg" alt="dark" className="w-6 h-6 filter dark:invert-0 invert" />
                                    ) : (
                                        <img src="/resources/icons/Sun_fill.svg" alt="light" className="w-6 h-6 filter dark:invert-0 invert" />
                                    )}
                                </button>
                            </div>
                        </>
                    ) : (
                        // Mode detail - struktur diubah agar tombol tidak sticky dan urutan sama dengan mode ringkas
                        <>
                            {/* !!!!!!GUUUBBBLKKK!!!!!! Hapus flex-1 dari BoardList, cukup overflow auto */}
                            <div className="overflow-y-auto hide-scrollbar relative">
                                <BoardList />
                            </div>
                            {/* !!!!!!GUUUBBBLKKK!!!!!! Tombol Add new board di luar scroll, tanpa sticky */}
                            <div className="pt-2 pb-2">
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="flex items-center gap-3 text-black dark:text-white bg-transparent pl-3 pr-3 py-3 rounded-lg w-full justify-start"
                                >
                                    <img src="/resources/icons/Add_round_fill.svg" alt="add" className="w-6 h-6 filter dark:invert-0 invert" />
                                    <span>Add new board</span>
                                </button>
                            </div>
                            {/* !!!!!!GUUUBBBLKKK!!!!!! Spacer agar toggle turun saat board sedikit */}
                            <div className="flex-1"></div>
                            {/* Toggle mode terang/gelap */}
                            <div className="bg-[#EEF4FC] dark:bg-[#3A3E44] rounded-lg p-1 flex gap-1 w-full h-12 mt-2">
                                <button
                                    onClick={() => setDarkMode(true)}
                                    className={`flex-1 flex items-center justify-center gap-1 rounded-md transition ${darkMode ? 'bg-white dark:bg-[#191B1F] text-black dark:text-white' : 'bg-transparent text-gray-600 dark:text-gray-400'}`}
                                    style={{ borderRadius: '8px', width: '130px', height: '39px' }}
                                >
                                    <img src="/resources/icons/Moon_fill.svg" alt="dark" className="w-6 h-6 filter dark:invert-0 invert" />
                                    <span className="text-sm">Dark</span>
                                </button>
                                <button
                                    onClick={() => setDarkMode(false)}
                                    className={`flex-1 flex items-center justify-center gap-1 rounded-md transition ${!darkMode ? 'bg-white dark:bg-[#191B1F] text-black dark:text-white' : 'bg-transparent text-gray-600 dark:text-gray-400'}`}
                                    style={{ borderRadius: '8px', width: '130px', height: '39px' }}
                                >
                                    <img src="/resources/icons/Sun_fill.svg" alt="light" className="w-6 h-6 filter dark:invert-0 invert" />
                                    <span className="text-sm">Light</span>
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