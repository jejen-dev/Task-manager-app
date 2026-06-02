import React, { useState, useRef, useEffect } from 'react';
import { useBoards } from '../contexts/BoardsContext';

// Daftar tag dan status yang tersedia
const TAGS = ['Concept', 'Technical', 'Design', 'Front-end'];
const STATUSES = ['Backlog', 'In Progress', 'In Review', 'Completed'];

// Warna untuk setiap status (lingkaran kecil)
const statusColors = {
    'Backlog': '#70a3f3',
    'In Progress': '#f3ce49',
    'In Review': '#b787f6',
    'Completed': '#77db89'
};

const tagColors = {
    'Concept': { bg: '#F9E4E3', text: '#B64B44' },
    'Technical': { bg: '#DEE9FC', text: '#5076E7' },
    'Design': { bg: '#FDFAC9', text: '#CDA24E' },
    'Front-end': { bg: '#E2FBE9', text: '#64AF6C' }
};

// Modal untuk mengedit detail task
const TaskEditModal = ({ task, onClose }) => {
    const { activeBoardId, updateTask } = useBoards();
    // State untuk nilai form
    const [taskName, setTaskName] = useState(task.name);
    const [status, setStatus] = useState(task.status);
    const [selectedTags, setSelectedTags] = useState(task.tags || []);
    const [coverImage, setCoverImage] = useState(task.coverImage || null);
    const [loadingImage, setLoadingImage] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isTagsOpen, setIsTagsOpen] = useState(false);
    const tagsDropdownRef = useRef(null);

    // State dan ref untuk kontrol tampilan tombol overlay pada cover image
    const [showCoverButtons, setShowCoverButtons] = useState(false);
    const coverContainerRef = useRef(null);

    // Toggle tag: tambah/hapus, batasi maksimal 4 tag
    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            if (selectedTags.length < 4) setSelectedTags([...selectedTags, tag]);
        }
    };

    // Tutup dropdown tags jika klik di luar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (tagsDropdownRef.current && !tagsDropdownRef.current.contains(event.target)) {
                setIsTagsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Menyembunyikan tombol overlay jika klik di luar area cover image
    useEffect(() => {
        const handleClickOutsideCover = (event) => {
            if (coverContainerRef.current && !coverContainerRef.current.contains(event.target)) {
                setShowCoverButtons(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutsideCover);
        return () => document.removeEventListener('mousedown', handleClickOutsideCover);
    }, []);

    // Menambahkan cover image random dari picsum
    const addRandomCoverImage = async () => {
        setLoadingImage(true);
        try {
            const randomId = Math.floor(Math.random() * 1000);
            const imageUrl = `https://picsum.photos/id/${randomId}/300/200`;
            setCoverImage(imageUrl);
        } catch (error) {
            alert('Failed to load image');
        } finally {
            setLoadingImage(false);
        }
    };

    // Upload cover image dari file lokal
    const handleUploadCover = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setCoverImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    // Hapus cover image
    const removeCoverImage = () => {
        setCoverImage(null);
        setShowCoverButtons(false);
    };

    // Simpan perubahan task
    const handleSave = () => {
        const trimmed = taskName.trim();
        if (trimmed === '') {
            alert('Task name is required');
            return;
        }
        if (trimmed.length > 100) {
            alert('Task name cannot exceed 100 characters');
            return;
        }
        updateTask(activeBoardId, task.id, {
            name: trimmed,
            status,
            tags: selectedTags,
            coverImage
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 -top-[20px] bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-[450px] sm:max-w-[520px] mx-auto">
                <div className="p-5 sm:p-8 space-y-5 sm:space-y-8">
                    <h2 className="text-xl font-semibold text-black dark:text-dark-text">Task details</h2>

                    {/* Bagian Cover Image */}
                    <div ref={coverContainerRef}>
                        {coverImage ? (
                            <div className="relative mb-4">
                                <img
                                    src={coverImage}
                                    alt="Cover"
                                    className="w-full h-36 sm:h-40 object-cover rounded-lg cursor-pointer"
                                    style={{ borderRadius: '8px' }}
                                    onClick={() => setShowCoverButtons(true)}
                                />
                                {showCoverButtons && (
                                    <div className="absolute inset-0 flex items-center justify-center gap-2 sm:gap-3 bg-black bg-opacity-50 rounded-lg">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addRandomCoverImage();
                                            }}
                                            disabled={loadingImage}
                                            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#3662E3] text-white rounded-full text-xs sm:text-sm disabled:opacity-50"
                                        >
                                            Random Cover
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeCoverImage();
                                            }}
                                            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#DD524C] text-white rounded-full text-xs sm:text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg h-36 sm:h-40 flex items-center justify-center mb-4">
                                <div className="flex gap-2 sm:gap-3">
                                    <button
                                        onClick={addRandomCoverImage}
                                        disabled={loadingImage}
                                        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#3662E3] text-white rounded-full text-xs sm:text-sm disabled:opacity-50"
                                    >
                                        Random Cover
                                    </button>
                                    <label className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#DD524C] text-white rounded-full text-xs sm:text-sm cursor-pointer">
                                        Upload Cover
                                        <input type="file" accept="image/*" onChange={handleUploadCover} className="hidden" />
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Task Name */}
                    <div>
                        <label className="block text-sm font-medium text-[#7E878D] mb-2">Task name</label>
                        <input
                            type="text"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            placeholder="Enter task name (max 100 chars)"
                            className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-dark-card border-gray-300 dark:border-gray-600 text-black dark:text-dark-text text-base focus:border-[#3662E3] focus:ring-1 focus:ring-[#3662E3] focus:outline-none"
                        />
                    </div>

                    {/* Status Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-[#7E878D] mb-2">Status</label>
                        <div className="relative">
                            <button
                                onClick={() => setIsStatusOpen(!isStatusOpen)}
                                className="w-full flex items-center gap-2 px-3 py-2 border rounded-xl bg-white dark:bg-dark-card border-gray-300 dark:border-gray-600 text-black dark:text-dark-text text-left focus:border-[#3662E3] focus:ring-1 focus:ring-[#3662E3] focus:outline-none text-sm sm:text-base"
                            >
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColors[status] }}></div>
                                <span>{status}</span>
                                <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {isStatusOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-[#191B1F] border border-gray-700 rounded-lg shadow-lg p-1">
                                    {STATUSES.map(s => (
                                        <button
                                            key={s}
                                            onClick={() => { setStatus(s); setIsStatusOpen(false); }}
                                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#3662E3] transition-colors text-white text-left rounded-md text-sm"
                                        >
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColors[s] }}></div>
                                            <span>{s}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tags Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-[#7E878D] mb-2">Tags</label>
                        <div className="relative" ref={tagsDropdownRef}>
                            <button
                                onClick={() => setIsTagsOpen(!isTagsOpen)}
                                className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-dark-card border-gray-300 dark:border-gray-600 text-left flex flex-wrap gap-1 items-center min-h-[42px] focus:border-[#3662E3] focus:ring-1 focus:ring-[#3662E3] focus:outline-none text-sm"
                            >
                                {selectedTags.length === 0 ? (
                                    <span className="text-gray-500 dark:text-dark-secondary">Select tags</span>
                                ) : (
                                    selectedTags.map(tag => (
                                        <span key={tag} className="inline-block px-2 py-1 rounded-md text-xs font-medium" style={{ backgroundColor: tagColors[tag]?.bg, color: tagColors[tag]?.text, borderRadius: '4px' }}>{tag}</span>
                                    ))
                                )}
                                <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {isTagsOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-[#191B1F] border border-gray-700 rounded-lg shadow-lg p-1 max-h-60 overflow-y-auto">
                                    {TAGS.map(tag => {
                                        const isSelected = selectedTags.includes(tag);
                                        return (
                                            <button
                                                key={tag}
                                                onClick={() => toggleTag(tag)}
                                                className="w-full text-left px-3 py-2 rounded-md transition-colors mb-1 last:mb-0 text-white text-sm"
                                                style={{ backgroundColor: isSelected ? tagColors[tag]?.bg : 'transparent', color: isSelected ? tagColors[tag]?.text : 'white' }}
                                                onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = '#3662E3'; }}
                                                onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
                                            >
                                                {tag}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tombol Save dan Cancel */}
                    <div className="flex gap-3 sm:gap-4 pt-2 sm:pt-4">
                        <button
                            onClick={handleSave}
                            className="flex-1 px-3 py-2 sm:px-4 bg-[#3662E3] text-white rounded-full text-sm sm:text-base flex items-center justify-center gap-2"
                        >
                            <span>Save</span>
                            <img src="/resources/icons/Done_round.svg" alt="check" className="w-4 h-4 filter brightness-0 invert" />
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 px-3 py-2 sm:px-4 text-[#7E878D] border border-gray-300 dark:border-gray-600 rounded-full text-sm sm:text-base"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskEditModal;