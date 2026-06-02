import React, { useState, useEffect } from 'react';
import { BoardsProvider } from './contexts/BoardsContext';
import Sidebar from './components/Sidebar';
import BoardColumns from './components/BoardColumns';
import { fetchAllBoards } from './utils/api';
import LoadingSpinner from './components/LoadingSpinner';

/**
 * Kunci untuk menyimpan data board dan ID board aktif ke localStorage.
 */
const STORAGE_KEY_BOARDS = 'task-manager-boards';
const STORAGE_KEY_ACTIVE_BOARD = 'task-manager-active-board';

/**
 * Komponen utama aplikasi.
 * Mengelola mode gelap (dark mode), pengambilan data board dari API atau localStorage,
 * serta penyimpanan data board secara lokal.
 */
const App = () => {
    // State mode gelap: baca dari localStorage, default true (gelap)
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved === 'dark' || (!saved && true);
    });

    // State untuk menyimpan seluruh data board (objek dengan key boardId)
    const [boardsData, setBoardsData] = useState(null);
    // State untuk ID board yang sedang aktif
    const [activeBoardId, setActiveBoardId] = useState(null);
    // State indikator loading
    const [loading, setLoading] = useState(true);

    /**
     * Efek: menerapkan class 'dark' pada elemen html dan menyimpan preferensi ke localStorage.
     */
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    /**
     * Efek awal: memuat data board dari localStorage (jika ada) atau dari API.
     * Setelah data tersedia, loading diset false.
     */
    useEffect(() => {
        const loadData = async () => {
            const storedBoards = localStorage.getItem(STORAGE_KEY_BOARDS);
            const storedActiveBoard = localStorage.getItem(STORAGE_KEY_ACTIVE_BOARD);

            if (storedBoards && storedActiveBoard) {
                try {
                    const boards = JSON.parse(storedBoards);
                    setBoardsData(boards);
                    setActiveBoardId(storedActiveBoard);
                    setLoading(false);
                    return;
                } catch (error) {
                    console.error('Gagal membaca localStorage:', error);
                }
            }

            // Jika tidak ada di localStorage, ambil dari API
            const data = await fetchAllBoards();
            setBoardsData(data);
            const firstBoardId = Object.keys(data)[0];
            setActiveBoardId(firstBoardId);
            setLoading(false);
        };

        loadData();
    }, []);

    /**
     * Efek: menyimpan boardsData dan activeBoardId ke localStorage setiap kali berubah.
     */
    useEffect(() => {
        if (boardsData && activeBoardId) {
            localStorage.setItem(STORAGE_KEY_BOARDS, JSON.stringify(boardsData));
            localStorage.setItem(STORAGE_KEY_ACTIVE_BOARD, activeBoardId);
        }
    }, [boardsData, activeBoardId]);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
            <div className="flex h-screen p-3 bg-white dark:bg-dark-bg">
                <BoardsProvider
                    boards={boardsData}
                    setBoards={setBoardsData}
                    activeBoardId={activeBoardId}
                    setActiveBoardId={setActiveBoardId}
                >
                    <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />
                    <BoardColumns />
                </BoardsProvider>
            </div>
        </div>
    );
};

export default App;