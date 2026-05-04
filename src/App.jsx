import React, { useState, useEffect } from 'react';
import { BoardsProvider } from './contexts/BoardsContext';
import Sidebar from './components/Sidebar';
import BoardColumns from './components/BoardColumns';
import { fetchAllBoards } from './utils/api';
import LoadingSpinner from './components/LoadingSpinner';

const App = () => {
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved === 'dark' || (!saved && true);
    });
    const [boardsData, setBoardsData] = useState(null);
    const [activeBoardId, setActiveBoardId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

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
        <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
            <div className="flex h-screen p-3 gap-3 bg-light-bg dark:bg-dark-bg">
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