import React, { createContext, useContext, useCallback } from 'react';

const BoardsContext = createContext();

/**
 * Hook untuk mengakses context Boards.
 * @throws {Error} Jika digunakan di luar BoardsProvider.
 */
export const useBoards = () => {
    const context = useContext(BoardsContext);
    if (!context) {
        throw new Error('useBoards must be used within BoardsProvider');
    }
    return context;
};

/**
 * Provider untuk state board, mencakup data board, board aktif, dan berbagai operasi.
 */
export const BoardsProvider = ({
    children,
    boards,
    setBoards,
    activeBoardId,
    setActiveBoardId
}) => {
    /**
     * Mengembalikan objek board yang sedang aktif.
     */
    const getActiveBoard = useCallback(() => {
        return boards[activeBoardId];
    }, [boards, activeBoardId]);

    /**
     * Memperbarui data sebuah board berdasarkan boardId.
     */
    const updateBoard = useCallback((boardId, updatedBoard) => {
        setBoards(prev => ({
            ...prev,
            [boardId]: updatedBoard
        }));
    }, [setBoards]);

    /**
     * Memindahkan task antar kolom (drag & drop).
     * Memperbarui status task sesuai kolom tujuan.
     */
    const moveTask = useCallback((boardId, sourceCol, destCol, sourceIndex, destIndex) => {
        setBoards(prevBoards => {
            const board = prevBoards[boardId];
            if (!board) return prevBoards;

            const sourceTasks = [...board.columns[sourceCol]];
            const destTasks = sourceCol === destCol ? sourceTasks : [...board.columns[destCol]];
            const [movedTask] = sourceTasks.splice(sourceIndex, 1);

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

    /**
     * Menambahkan task baru ke kolom 'Backlog' pada board yang ditentukan.
     */
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

    /**
     * Memperbarui task: mencari task berdasarkan ID, menghapus dari kolom asal,
     * lalu menambahkannya ke kolom berdasarkan status baru (jika status berubah).
     */
    const updateTask = useCallback((boardId, taskId, updatedFields) => {
        setBoards(prevBoards => {
            const board = prevBoards[boardId];
            if (!board) return prevBoards;

            const columns = { ...board.columns };
            let taskToUpdate = null;
            let oldStatus = null;

            for (const [status, tasks] of Object.entries(columns)) {
                const taskIndex = tasks.findIndex(t => t.id === taskId);
                if (taskIndex !== -1) {
                    taskToUpdate = { ...tasks[taskIndex], ...updatedFields };
                    oldStatus = status;
                    const newTasks = [...tasks];
                    newTasks.splice(taskIndex, 1);
                    columns[status] = newTasks;
                    break;
                }
            }

            if (!taskToUpdate) return prevBoards;

            const newStatus = updatedFields.status !== undefined ? updatedFields.status : oldStatus;

            if (!columns[newStatus]) {
                columns[newStatus] = [];
            }
            columns[newStatus] = [...columns[newStatus], taskToUpdate];

            return {
                ...prevBoards,
                [boardId]: {
                    ...board,
                    columns
                }
            };
        });
    }, [setBoards]);

    /**
     * Menambahkan board baru dengan nama dan logo (emoji) tertentu.
     * Board baru akan otomatis menjadi board aktif.
     */
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

    /**
     * Menghapus board berdasarkan ID.
     * Tidak mengizinkan penghapusan jika hanya tersisa satu board.
     */
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