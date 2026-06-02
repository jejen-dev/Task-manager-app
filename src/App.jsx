import React, { useState, useEffect } from 'react';
import { BoardsProvider } from './contexts/BoardsContext';
import Sidebar from './components/Sidebar';
import BoardColumns from './components/BoardColumns';
import { fetchAllBoards } from './utils/api';
import LoadingSpinner from './components/LoadingSpinner';

// Komponen utama App
const App = () => {
    // DESAIN: Dark mode state, diambil dari localStorage (default true)
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved === 'dark' || (!saved && true);
    });
    const [boardsData, setBoardsData] = useState(null);
    const [activeBoardId, setActiveBoardId] = useState(null);
    const [loading, setLoading] = useState(true);

    // Efek untuk menerapkan dark mode class ke html dan simpan ke localStorage
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    // Efek awal: mengambil data board dari API atau fallback
    useEffect(() => {
        const loadBoards = async () => {
            setLoading(true);
            const data = await fetchAllBoards();
            setBoardsData(data);
            const firstBoardId = Object.keys(data)[0];
            setActiveBoardId(firstBoardId);
            setLoading(false);
        };
        loadBoards();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        // DESAIN: Container utama dengan min-height penuh, dark mode class
        <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
            {/* DESAIN: Flex container, padding 12px (p-3), background putih/gelap */}
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