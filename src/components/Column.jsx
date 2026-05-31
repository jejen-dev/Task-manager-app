import React, { useState, useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { useBoards } from '../contexts/BoardsContext';
import TaskCard from './TaskCard';

// Komponen kolom (satu kolom dari kanban board)
const Column = ({ columnId, title, tasks, color, activeBoardId }) => {
    const { addTask, moveTask } = useBoards();
    const [isAdding, setIsAdding] = useState(false); // Mode input task baru
    const [newTaskName, setNewTaskName] = useState('');
    const taskContainerRef = useRef(null); // Referensi container daftar task
    const [isOverflow, setIsOverflow] = useState(false); // Apakah task overflow (scroll vertikal)

    // Drop target untuk menerima task dari kolom lain (antar kolom)
    const [, dropRef] = useDrop({
        accept: 'TASK',
        canDrop: (item) => {
            // Hanya izinkan drop jika kolom sumber berbeda (mencegah drop di kolom sendiri)
            return item.sourceColumnId !== columnId;
        },
        drop: (item) => {
            const sourceCol = item.sourceColumnId;
            const destCol = columnId;
            const sourceIndex = item.sourceIndex;
            if (sourceCol !== destCol) {
                // Pindahkan task ke kolom ini, letakkan di indeks terakhir (tasks.length)
                moveTask(activeBoardId, sourceCol, destCol, sourceIndex, tasks.length);
            }
            return { moved: true };
        },
    });

    // Fungsi untuk mengecek apakah container task overflow (scroll vertikal)
    const checkOverflow = () => {
        if (taskContainerRef.current) {
            const container = taskContainerRef.current;
            const overflow = container.scrollHeight > container.clientHeight;
            setIsOverflow(overflow);
        }
    };

    // Efek untuk memantau overflow saat tasks berubah atau resize
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

    // Tambah task baru ke kolom Backlog (hanya untuk kolom Backlog)
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

    // Tentukan border radius khusus untuk kolom pertama dan terakhir
    let borderRadiusClass = '';
    if (columnId === 'Backlog') {
        borderRadiusClass = 'rounded-l-lg rounded-r-none';
    } else if (columnId === 'Completed') {
        borderRadiusClass = 'rounded-r-lg rounded-l-none';
    }

    return (
        <div
            ref={dropRef}
            className={`
                bg-[#EEF4FC] dark:bg-[#3A3E44] 
                flex flex-col overflow-hidden h-full 
                ${borderRadiusClass}
                w-[320px] 
                lg:w-auto lg:flex-1
            `}
            style={{ position: 'relative' }} // penting untuk drop target di dalam overflow container
        >
            {/* Header kolom: warna, judul, jumlah task */}
            <div className="p-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                    <h3 className="font-semibold text-black dark:text-white">{title}</h3>
                    <span className="text-sm text-black dark:text-white">({tasks.length})</span>
                </div>
            </div>

            {/* Daftar task (scroll vertikal jika overflow) */}
            <div
                ref={taskContainerRef}
                className={`${isOverflow ? 'flex-1' : ''} overflow-y-auto p-3 hide-scrollbar`}
                style={{ minHeight: 0 }}
            >
                {tasks.length === 0 ? (
                    <div className="text-left text-[#7E878D] bg-transparent">No tasks</div>
                ) : (
                    tasks.map((task, index) => (
                        <TaskCard key={task.id} task={task} index={index} columnId={columnId} />
                    ))
                )}
            </div>

            {/* Bagian add task (hanya untuk kolom Backlog) */}
            <div className={`${isOverflow ? 'sticky bottom-0 bg-[#EEF4FC] dark:bg-[#3A3E44]' : ''}`} style={{ padding: '0.75rem', paddingTop: 0 }}>
                {columnId === 'Backlog' && !isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-full flex items-center justify-between px-4 py-2 rounded-lg"
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
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddTask();
                                }
                            }}
                            placeholder="Task name (max 100 chars)"
                            className="w-full bg-transparent text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded px-2 py-1 mb-2"
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <button onClick={handleAddTask} className="bg-blue-600 text-white px-3 py-1 rounded">Add</button>
                            <button onClick={() => setIsAdding(false)} className="bg-gray-600 text-white px-3 py-1 rounded">Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Column;