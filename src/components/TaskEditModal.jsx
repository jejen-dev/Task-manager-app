import React, { useState, useRef, useEffect } from 'react';
import { useBoards } from '../contexts/BoardsContext';

const TAGS = ['Concept', 'Technical', 'Design', 'Front-end'];
const STATUSES = ['Backlog', 'In Progress', 'In Review', 'Completed'];

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

const TaskEditModal = ({ task, onClose }) => {
    const { activeBoardId, updateTask } = useBoards();
    const [taskName, setTaskName] = useState(task.name);
    const [status, setStatus] = useState(task.status);
    const [selectedTags, setSelectedTags] = useState(task.tags || []);
    const [coverImage, setCoverImage] = useState(task.coverImage || null);
    const [loadingImage, setLoadingImage] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isTagsOpen, setIsTagsOpen] = useState(false);
    const tagsDropdownRef = useRef(null);

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            if (selectedTags.length < 4) {
                setSelectedTags([...selectedTags, tag]);
            }
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (tagsDropdownRef.current && !tagsDropdownRef.current.contains(event.target)) {
                setIsTagsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const addRandomCoverImage = async () => {
        setLoadingImage(true);
        try {
            const randomId = Math.floor(Math.random() * 1000);
            const imageUrl = `https://picsum.photos/id/${randomId}/300/200`;
            setCoverImage(imageUrl);
        } catch (error) {
            console.error('Error fetching image:', error);
            alert('Failed to load image');
        } finally {
            setLoadingImage(false);
        }
    };

    const handleUploadCover = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeCoverImage = () => {
        setCoverImage(null);
    };

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-xl max-w-md w-full">
                <div className="flex justify-between items-center px-6 py-4 pb-2">
                    <h2 className="text-xl font-semibold text-black dark:text-dark-text">Task details</h2>
                    <button onClick={onClose} className="text-black dark:text-dark-secondary hover:text-gray-700 dark:hover:text-gray-300">
                        <img src="/resources/icons/Close_round.svg" alt="Close" className="w-6 h-6 filter dark:invert-0 invert" />
                    </button>
                </div>

                <div className="px-6 pt-1 pb-4 space-y-4">
                    {/* Cover Image Section */}
                    <div>
                        {coverImage ? (
                            <div className="mb-3">
                                <img src={coverImage} alt="Cover" className="w-full h-40 object-cover rounded-lg mb-2" />
                                <button onClick={removeCoverImage} className="text-sm text-red-500 hover:text-red-700">Remove Cover</button>
                            </div>
                        ) : (
                            <div className="text-center py-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-2">
                                <span className="text-black dark:text-dark-secondary">No cover</span>
                            </div>
                        )}
                        <div className="flex gap-2">
                            <button onClick={addRandomCoverImage} disabled={loadingImage} className="px-3 py-1 text-sm bg-accent-blue text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50">
                                {loadingImage ? 'Loading...' : 'Random Cover'}
                            </button>
                            <label className="px-3 py-1 text-sm bg-accent-blue text-white rounded-lg hover:bg-opacity-90 cursor-pointer">
                                Upload Cover
                                <input type="file" accept="image/*" onChange={handleUploadCover} className="hidden" />
                            </label>
                        </div>
                    </div>

                    {/* Task Name */}
                    <div>
                        <label className="block text-sm font-medium text-black dark:text-dark-text mb-2">Task name</label>
                        <input
                            type="text"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            placeholder="Enter task name (max 100 chars)"
                            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-dark-card border-gray-300 dark:border-gray-600 text-black dark:text-dark-text"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-black dark:text-dark-text mb-2">Status</label>
                        <div className="relative">
                            <button
                                onClick={() => setIsStatusOpen(!isStatusOpen)}
                                className="w-full flex items-center gap-2 px-3 py-2 border rounded-lg bg-white dark:bg-dark-card border-gray-300 dark:border-gray-600 text-black dark:text-dark-text text-left"
                            >
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: statusColors[status] }}></div>
                                <span>{status}</span>
                                <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {isStatusOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                                    {STATUSES.map(s => (
                                        <button
                                            key={s}
                                            onClick={() => { setStatus(s); setIsStatusOpen(false); }}
                                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-black dark:text-dark-text"
                                        >
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: statusColors[s] }}></div>
                                            <span>{s}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-black dark:text-dark-text mb-2">Tags</label>
                        <div className="relative" ref={tagsDropdownRef}>
                            <button
                                onClick={() => setIsTagsOpen(!isTagsOpen)}
                                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-dark-card border-gray-300 dark:border-gray-600 text-left flex flex-wrap gap-1 items-center min-h-[42px]"
                            >
                                {selectedTags.length === 0 ? <span className="text-gray-500 dark:text-dark-secondary">Select tags</span> : selectedTags.map(tag => (
                                    <span key={tag} className="inline-block px-2 py-1 rounded-md text-xs font-medium" style={{ backgroundColor: tagColors[tag]?.bg, color: tagColors[tag]?.text }}>{tag}</span>
                                ))}
                                <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {isTagsOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-1">
                                    {TAGS.map(tag => {
                                        const isSelected = selectedTags.includes(tag);
                                        return (
                                            <button
                                                key={tag}
                                                onClick={() => toggleTag(tag)}
                                                className="w-full text-left px-3 py-2 rounded-md transition-colors mb-1 last:mb-0"
                                                style={{ backgroundColor: isSelected ? tagColors[tag]?.bg : (tagColors[tag]?.bg + '80'), color: tagColors[tag]?.text }}
                                                onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = tagColors[tag]?.bg; }}
                                                onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = tagColors[tag]?.bg + '80'; }}
                                            >
                                                <span className="text-sm font-medium">{tag}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 px-6 py-4 pt-2">
                    <button onClick={handleSave} className="px-4 py-2 text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2" style={{ backgroundColor: '#3762e4' }}>
                        <span>Save</span>
                        <img src="/resources/icons/Done_round.svg" alt="Save" className="w-5 h-5" />
                    </button>
                    <button onClick={onClose} className="px-4 py-2 text-black dark:text-dark-secondary border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">Cancel</button>
                    <div className="flex-1"></div>
                </div>
            </div>
        </div>
    );
};

export default TaskEditModal;