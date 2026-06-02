import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { useBoards } from '../contexts/BoardsContext';
import Column from './Column';

// Definisi kolom kanban: id, judul, dan warna titik status sesuai spesifikasi
// Warna: Backlog #70A3F3, In Progress #F3CE49, In Review #B787F5, Completed #77DB89
const COLUMNS = [
    { id: 'Backlog', title: 'Backlog', color: '#70a3f3' },
    { id: 'In Progress', title: 'In Progress', color: '#f3ce49' },
    { id: 'In Review', title: 'In Review', color: '#b787f5' },
    { id: 'Completed', title: 'Completed', color: '#77db89' }
];

// Komponen utama board columns, mengatur drag-drop context dan layout task column
const BoardColumns = () => {
    const { boards, activeBoardId } = useBoards();
    const activeBoard = boards[activeBoardId];
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    // Deteksi perangkat sentuh untuk memilih backend yang sesuai
    useEffect(() => {
        const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        setIsTouchDevice(isTouch);
    }, []);

    if (!activeBoard) {
        return <div className="text-center py-8">No board selected</div>;
    }

    // Pilih backend: TouchBackend untuk sentuh, HTML5Backend untuk mouse
    const Backend = isTouchDevice ? TouchBackend : HTML5Backend;

    return (
        <DndProvider backend={Backend} options={isTouchDevice ? { enableMouseEvents: true } : {}}>
            {/* DESAIN: Task column container. Margin kiri 12px (ml-3) agar jarak ke sidebar 12px.
                 Background #191B1F (dark) atau putih, border radius 12px, overflow hidden. */}
            <div className="flex-1 h-full bg-white dark:bg-[#191B1F] rounded-xl ml-3 overflow-hidden">
                {/* DESAIN: Container overflow horizontal (scroll) jika kolom tidak muat. Padding 12px (p-3) */}
                <div className="w-full h-full overflow-x-auto p-0 bg-[#EEF4FC] dark:bg-[#3A3E44]">
                    {/* DESAIN: Grid 4 kolom dengan gap antar kolom 12px (gap-3). Min width 1024px agar scroll muncul di layar kecil */}
                    <div className="grid grid-cols-4 gap-3 h-full min-w-[1024px]">
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