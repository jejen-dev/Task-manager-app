import React, { useState } from 'react';
import { useBoards } from '../contexts/BoardsContext';
import BoardList from './BoardList';
import AddBoardModal from './AddBoardModal';

// Komponen Sidebar (menu kiri aplikasi)
const Sidebar = ({ darkMode, setDarkMode }) => {
    const { boards, activeBoardId, setActiveBoardId, addBoard } = useBoards();
    const [showDetails, setShowDetails] = useState(false); // Mode ringkas (false) atau detail (true)
    const [showModal, setShowModal] = useState(false); // Menampilkan modal AddBoardModal

    // Fungsi untuk menambah board (dipanggil dari modal)
    const handleAddBoard = (boardName, logoUrl) => {
        addBoard(boardName, logoUrl);
    };

    return (
        <>
            {/* Sidebar container: lebar responsif, mode detail: w-72 (normal) mengecil jadi w-56 di bawah 450px */}
            <div className={`${showDetails ? 'w-72 max-[450px]:w-56' : 'w-auto'} bg-white dark:bg-dark-bg rounded-xl flex flex-col p-4 h-full`}>
                <div className="flex flex-col h-full">
                    {/* Tombol toggle mode ringkas/detail */}
                    <button onClick={() => setShowDetails(!showDetails)} className="text-black dark:text-white mb-6 self-start w-10 h-10 rounded-full bg-[#EEF4FC] dark:bg-[#3A3E44] flex items-center justify-center flex-shrink-0">
                        <img src={showDetails ? "/resources/icons/Close_round.svg" : "/resources/icons/Menu.svg"} alt="menu" className="w-5 h-5 filter dark:invert-0 invert" />
                    </button>

                    {!showDetails ? (
                        // Mode ringkas: hanya icon board, tombol tambah board, dan dark mode toggle
                        <>
                            <div className="flex flex-col items-center gap-3 overflow-y-auto hide-scrollbar">
                                {Object.values(boards).map((board) => (
                                    <button key={board.id} onClick={() => setActiveBoardId(board.id)} className={`w-10 h-10 rounded-full transition-opacity ${activeBoardId === board.id ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}>
                                        <img src={board.logoUrl} alt={board.name} className="w-full h-full rounded-full" />
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => setShowModal(true)} className="flex justify-center my-4 w-full">
                                <img src="/resources/icons/Add_round_fill.svg" alt="add board" className="w-6 h-6 filter dark:invert-0 invert flex-shrink-0" />
                            </button>
                            <div className="flex-1"></div>
                            <div className="flex justify-center">
                                <button onClick={() => setDarkMode(!darkMode)}>
                                    {darkMode ? (
                                        <img src="/resources/icons/Moon_fill.svg" alt="dark" className="w-6 h-6 filter dark:invert-0 invert" />
                                    ) : (
                                        <img src="/resources/icons/Sun_fill.svg" alt="light" className="w-6 h-6 filter dark:invert-0 invert" />
                                    )}
                                </button>
                            </div>
                        </>
                    ) : (
                        // Mode detail: daftar board dengan nama lengkap, tombol tambah board, dan toggle dark/light mode
                        <>
                            <div className="flex-1 overflow-y-auto hide-scrollbar mb-4 relative">
                                <BoardList />
                                <div className="sticky bottom-0 bg-[opacity] dark:bg-[opacity] pt-2">
                                    <button onClick={() => setShowModal(true)} className="flex items-center gap-2 text-black dark:text-white bg-[#EEF4FC] dark:bg-[#3A3E44] p-2 rounded-lg mt-4 w-full justify-center">
                                        <img src="/resources/icons/Add_round_fill.svg" alt="add" className="w-5 h-5 filter dark:invert-0 invert" />
                                        <span>Add new board</span>
                                    </button>
                                </div>
                            </div>
                            <div className="bg-[#EEF4FC] dark:bg-[#3A3E44] rounded-lg p-2 flex gap-2">
                                <button onClick={() => setDarkMode(true)} className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition ${darkMode ? 'bg-white dark:bg-[#191B1F] text-black dark:text-white' : 'bg-transparent text-gray-600 dark:text-gray-400'}`}>
                                    <img src="/resources/icons/Moon_fill.svg" alt="dark" className="w-4 h-4 filter dark:invert-0 invert" />
                                    <span>Dark</span>
                                </button>
                                <button onClick={() => setDarkMode(false)} className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition ${!darkMode ? 'bg-white dark:bg-[#191B1F] text-black dark:text-white' : 'bg-transparent text-gray-600 dark:text-gray-400'}`}>
                                    <img src="/resources/icons/Sun_fill.svg" alt="light" className="w-4 h-4 filter dark:invert-0 invert" />
                                    <span>Light</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Modal tambah board */}
            {showModal && <AddBoardModal onClose={() => setShowModal(false)} onAddBoard={handleAddBoard} />}
        </>
    );
};

export default Sidebar;