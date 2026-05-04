import React, { createContext, useContext, useCallback } from 'react';

const BoardsContext = createContext();

export const useBoards = () => {
    const context = useContext(BoardsContext);
    if (!context) {
        throw new Error('useBoards must be used within BoardsProvider');
    }
    return context;
};

export const BoardsProvider = ({ children, boards, setBoards, activeBoardId, setActiveBoardId }) => {
    const getActiveBoard = useCallback(() => {
        return boards[activeBoardId];
    }, [boards, activeBoardId]);

    const updateBoard = useCallback((boardId, updatedBoard) => {
        setBoards(prev => ({
            ...prev,
            [boardId]: updatedBoard
        }));
    }, [setBoards]);

    const moveTask = useCallback((boardId, sourceCol, destCol, sourceIndex, destIndex) => {
        setBoards(prevBoards => {
            const board = prevBoards[boardId];
            const sourceTasks = [...board.columns[sourceCol]];
            const destTasks = sourceCol === destCol ? sourceTasks : [...board.columns[destCol]];
            const [movedTask] = sourceTasks.splice(sourceIndex, 1);

            // Update task status to match destination column
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

    const updateTask = useCallback((boardId, taskId, updatedFields) => {
        setBoards(prevBoards => {
            const board = prevBoards[boardId];
            const columns = { ...board.columns };

            // Find and update the task in its column
            for (const [status, tasks] of Object.entries(columns)) {
                const taskIndex = tasks.findIndex(t => t.id === taskId);
                if (taskIndex !== -1) {
                    const updatedTask = { ...tasks[taskIndex], ...updatedFields };
                    const newTasks = [...tasks];
                    newTasks[taskIndex] = updatedTask;
                    columns[status] = newTasks;
                    break;
                }
            }

            return {
                ...prevBoards,
                [boardId]: {
                    ...board,
                    columns
                }
            };
        });
    }, [setBoards]);

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
            const remainingBoardId = Object.keys(boards).find(id => id !== boardId);
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