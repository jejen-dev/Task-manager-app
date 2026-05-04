import React, { createContext, useContext, useCallback } from 'react';

const BoardsContext = createContext();

export const useBoards = () => {
    const context = useContext(BoardsContext);
    if (!context) {
        throw new Error('useBoards must be used within BoardsProvider');
    }
    return context;
};

export const BoardsProvider = ({
    children,
    boards,
    setBoards,
    activeBoardId,
    setActiveBoardId
}) => {
    // Mendapatkan board aktif
    const getActiveBoard = useCallback(() => {
        return boards[activeBoardId];
    }, [boards, activeBoardId]);

    // Update board tertentu
    const updateBoard = useCallback((boardId, updatedBoard) => {
        setBoards(prev => ({
            ...prev,
            [boardId]: updatedBoard
        }));
    }, [setBoards]);

    // Memindahkan task antar kolom (drag & drop)
    const moveTask = useCallback((boardId, sourceCol, destCol, sourceIndex, destIndex) => {
        setBoards(prevBoards => {
            const board = prevBoards[boardId];
            if (!board) return prevBoards;

            const sourceTasks = [...board.columns[sourceCol]];
            const destTasks = sourceCol === destCol ? sourceTasks : [...board.columns[destCol]];
            const [movedTask] = sourceTasks.splice(sourceIndex, 1);

            // Update status task sesuai kolom tujuan
            const updatedTask = { ...movedTask, status: destCol };

            if (sourceCol === destCol) {
                sourceTasks.splice(destIndex, 0, updatedTask);
                return {
                    ...prevBoards,
                    [boardId]: {
                        ...board,
                        columns: {
                            ...board.columns,
                            [sourceCol]: sourceTasks
                        }
                    }
                };
            } else {
                destTasks.splice(destIndex, 0, updatedTask);
                return {
                    ...prevBoards,
                    [boardId]: {
                        ...board,
                        columns: {
                            ...board.columns,
                            [sourceCol]: sourceTasks,
                            [destCol]: destTasks
                        }
                    }
                };
            }
        });
    }, [setBoards]);

    // Menambah task baru ke kolom Backlog
    const addTask = useCallback((boardId, taskName) => {
        if (!taskName.trim()) return;

        const newTask = {
            id: Date.now().toString(),
            name: taskName,
            status: 'Backlog',
            tags: [],
            coverImage: null
        };

        setBoards(prevBoards => {
            const board = prevBoards[boardId];
            if (!board) return prevBoards;

            return {
                ...prevBoards,
                [boardId]: {
                    ...board,
                    columns: {
                        ...board.columns,
                        Backlog: [newTask, ...board.columns.Backlog]
                    }
                }
            };
        });
    }, [setBoards]);

    // Mengupdate task (edit nama, status, tags, coverImage)
    const updateTask = useCallback((boardId, taskId, updatedFields) => {
        setBoards(prevBoards => {
            const board = prevBoards[boardId];
            if (!board) return prevBoards;

            const columns = { ...board.columns };
            let taskFound = false;

            // Cari task di semua kolom
            for (const [status, tasks] of Object.entries(columns)) {
                const taskIndex = tasks.findIndex(t => t.id === taskId);
                if (taskIndex !== -1) {
                    const updatedTask = { ...tasks[taskIndex], ...updatedFields };
                    const newTasks = [...tasks];
                    newTasks[taskIndex] = updatedTask;
                    columns[status] = newTasks;
                    taskFound = true;
                    break;
                }
            }

            if (!taskFound) return prevBoards;

            return {
                ...prevBoards,
                [boardId]: {
                    ...board,
                    columns
                }
            };
        });
    }, [setBoards]);

    // Menambah board baru
    const addBoard = useCallback((boardName, logoUrl) => {
        const newBoardId = `board-${Date.now()}`;
        const newBoard = {
            id: newBoardId,
            name: boardName || 'Default Board',
            logoUrl: logoUrl || '/resources/emojis/board-logo-01.png',
            columns: {
                'Backlog': [],
                'In Progress': [],
                'In Review': [],
                'Completed': []
            }
        };

        setBoards(prev => ({
            ...prev,
            [newBoardId]: newBoard
        }));
        setActiveBoardId(newBoardId);
    }, [setBoards, setActiveBoardId]);

    // Menghapus board, tidak boleh jika hanya tersisa satu
    const deleteBoard = useCallback((boardId) => {
        const boardIds = Object.keys(boards);
        if (boardIds.length <= 1) {
            alert('Cannot delete the last board');
            return;
        }

        setBoards(prev => {
            const newBoards = { ...prev };
            delete newBoards[boardId];
            return newBoards;
        });

        if (activeBoardId === boardId) {
            const remainingBoardId = boardIds.find(id => id !== boardId);
            setActiveBoardId(remainingBoardId);
        }
    }, [boards, activeBoardId, setBoards, setActiveBoardId]);

    const value = {
        boards,
        activeBoardId,
        getActiveBoard,
        updateBoard,
        moveTask,
        addTask,
        updateTask,
        addBoard,
        deleteBoard,
        setActiveBoardId
    };

    return (
        <BoardsContext.Provider value={value}>
            {children}
        </BoardsContext.Provider>
    );
};