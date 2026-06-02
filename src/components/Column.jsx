import React, { useState, useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { useBoards } from '../contexts/BoardsContext';
import TaskCard from './TaskCard';

const Column = ({ columnId, title, tasks, color, activeBoardId }) => {
    const { addTask, moveTask } = useBoards();
    const [isAdding, setIsAdding] = useState(false);
    const [newTaskName, setNewTaskName] = useState('');
    const taskContainerRef = useRef(null);
    const [isOverflow, setIsOverflow] = useState(false);

    const [, dropRef] = useDrop({
        accept: 'TASK',
        canDrop: (item) => item.sourceColumnId !== columnId,
        drop: (item) => {
            const sourceCol = item.sourceColumnId;
            const destCol = columnId;
            const sourceIndex = item.sourceIndex;
            if (sourceCol !== destCol) {
                moveTask(activeBoardId, sourceCol, destCol, sourceIndex, tasks.length);
            }
            return { moved: true };
        },
    });

    const checkOverflow = () => {
        if (taskContainerRef.current) {
            const container = taskContainerRef.current;
            const overflow = container.scrollHeight > container.clientHeight;
            setIsOverflow(overflow);
        }
    };

    useEffect(() => {
        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        const observer = new ResizeObserver(() => checkOverflow());
        if (taskContainerRef.current) observer.observe(taskContainerRef.current);
        return () => {
            window.removeEventListener('resize', checkOverflow);
            observer.disconnect();
        };
    }, [tasks]);

    const handleAddTask = () => {
        const trimmed = newTaskName.trim();
        if (trimmed === '') {
            alert('Task name cannot be empty');
            return;
        }
        if (trimmed.length > 100) {
            alert('Task name cannot exceed 100 characters');
            return;
        }
        addTask(activeBoardId, trimmed);
        setNewTaskName('');
        setIsAdding(false);
    };

    let borderRadiusClass = '';
    if (columnId === 'Backlog') {
        borderRadiusClass = 'rounded-l-lg rounded-r-none';
    } else if (columnId === 'Completed') {
        borderRadiusClass = 'rounded-r-lg rounded-l-none';
    }

    let headerPaddingClass = '';
    let taskContainerPaddingClass = '';
    let footerPaddingClass = '';

    if (columnId === 'Backlog') {
        headerPaddingClass = 'pl-3 pr-0 pt-4 pb-5';
        taskContainerPaddingClass = 'pl-3 pr-0';
        footerPaddingClass = 'pl-3 pr-0';
    } else if (columnId === 'Completed') {
        headerPaddingClass = 'pl-0 pr-3 pt-4 pb-5';
        taskContainerPaddingClass = 'pl-0 pr-3';
        footerPaddingClass = 'pl-0 pr-3';
    } else {
        headerPaddingClass = 'px-0 pt-4 pb-5';
        taskContainerPaddingClass = 'px-0';
        footerPaddingClass = 'px-0';
    }
    // -------------------------------------------

    return (
        <div
            ref={dropRef}
            className={`bg-[#EEF4FC] dark:bg-[#3A3E44] flex flex-col overflow-hidden h-full ${borderRadiusClass}`}
            style={{ borderRadius: '12px', position: 'relative' }}
        >
            <div className={headerPaddingClass}>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
                    <h3 className="font-semibold text-black dark:text-white text-sm">{title}</h3>
                    <span className="text-sm text-black dark:text-white">({tasks.length})</span>
                </div>
            </div>

            <div
                ref={taskContainerRef}
                className={`${isOverflow ? 'flex-1' : ''} overflow-y-auto ${taskContainerPaddingClass} hide-scrollbar`}
                style={{ minHeight: 0 }}
            >
                <div className="space-y-5 pb-5">
                    {tasks.length === 0 ? (
                        <div className="text-left text-[#7E878D] bg-transparent">No tasks</div>
                    ) : (
                        tasks.map((task, index) => (
                            <TaskCard key={task.id} task={task} index={index} columnId={columnId} />
                        ))
                    )}
                </div>
            </div>

            <div className={`${isOverflow ? 'sticky bottom-0 bg-[#EEF4FC] dark:bg-[#3A3E44]' : ''} ${footerPaddingClass} pt-0 pb-4 ${isOverflow ? 'mt-5' : ''}`}>
                {columnId === 'Backlog' && !isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm"
                        style={{ backgroundColor: '#c3dbfb', color: '#2b4ecf' }}
                    >
                        <span>Add new task</span>
                        <img src="/resources/icons/Add_round.svg" alt="add" className="w-5 h-5" />
                    </button>
                )}
                {isAdding && columnId === 'Backlog' && (
                    <div className="bg-white dark:bg-[#191B1F] rounded-lg p-3">
                        <input
                            type="text"
                            value={newTaskName}
                            onChange={(e) => setNewTaskName(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTask(); } }}
                            placeholder="Task name (max 100 chars)"
                            className="w-full bg-transparent text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 mb-2 text-sm"
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <button onClick={handleAddTask} className="bg-blue-600 text-white px-3 py-1 rounded-md">Add</button>
                            <button onClick={() => setIsAdding(false)} className="bg-gray-600 text-white px-3 py-1 rounded-md">Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Column;