import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { useBoards } from '../contexts/BoardsContext';
import Column from './Column';

// Definisi kolom yang tersedia (Backlog, In Progress, In Review, Completed)
const COLUMNS = [
    { id: 'Backlog', title: 'Backlog', color: '#70a3f3' },
    { id: 'In Progress', title: 'In Progress', color: '#f3ce49' },
    { id: 'In Review', title: 'In Review', color: '#b787f6' },
    { id: 'Completed', title: 'Completed', color: '#77db89' }
];

// Komponen utama yang menampilkan semua kolom dan mengatur drag-drop context
const BoardColumns = () => {
    const { boards, activeBoardId } = useBoards();
    const activeBoard = boards[activeBoardId];
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    // Deteksi apakah perangkat mendukung sentuhan (touch) untuk memilih backend drag-drop
    useEffect(() => {
        const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        setIsTouchDevice(isTouch);
    }, []);

    if (!activeBoard) {
        return <div className="text-center py-8">No board selected</div>;
    }

    // Pilih backend: TouchBackend untuk perangkat sentuh, HTML5Backend untuk mouse
    const Backend = isTouchDevice ? TouchBackend : HTML5Backend;

    return (
        <DndProvider backend={Backend} options={isTouchDevice ? { enableMouseEvents: true } : {}}>
            {/* Container dengan overflow horizontal untuk responsif */}
            <div className="w-full h-full bg-white dark:bg-[#191B1F] p-4 rounded-xl overflow-hidden">
                <div className="w-full h-full overflow-x-auto">
                    {/* Grid 4 kolom, tidak pernah wrap. min-w-[1280px] memicu scroll horizontal pada layar kecil */}
                    <div className="grid grid-cols-4 gap-0 h-full min-w-[1280px] lg:min-w-0">
                        {COLUMNS.map((column) => (
                            <Column
                                key={column.id}
                                columnId={column.id}
                                title={column.title}
                                tasks={activeBoard.columns[column.id] || []}
                                color={column.color}
                                activeBoardId={activeBoardId}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </DndProvider>
    );
};

export default BoardColumns;