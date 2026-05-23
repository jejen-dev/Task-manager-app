import React, { useState } from 'react';
import { useBoards } from '../contexts/BoardsContext';

const TAGS = ['Concept', 'Technical', 'Design', 'Front-end'];
const STATUSES = ['Backlog', 'In Progress', 'In Review', 'Completed'];

// Warna untuk setiap status
const statusColors = {
    'Backlog': '#70a3f3',
    'In Progress': '#f3ce49',
    'In Review': '#b787f6',
    'Completed': '#77db89'
};

const TaskEditModal = ({ task, onClose }) => {
    const { activeBoardId, updateTask } = useBoards();
    const [taskName, setTaskName] = useState(task.name);
    const [status, setStatus] = useState(task.status);
    const [selectedTags, setSelectedTags] = useState(task.tags || []);
    const [coverImage, setCoverImage] = useState(task.coverImage || null);
    const [loadingImage, setLoadingImage] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            if (selectedTags.length < 4) {
                setSelectedTags([...selectedTags, tag]);
            }
        }
    };

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
        if (!taskName.trim()) {
            alert('Task name is required');
            return;
        }
        updateTask(activeBoardId, task.id, {
            name: taskName,
            status,
            tags: selectedTags,
            coverImage
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-xl max-w-md w-full">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 pb-2">
                    <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">Task details</h2>
                    <button onClick={onClose} className="text-light-secondary dark:text-dark-secondary hover:text-gray-700 dark:hover:text-gray-300">
                        <img src="/resources/icons/Close_round.svg" alt="Close" className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 pt-1 pb-4 space-y-4">
                    {/* Cover Image Section - tanpa label */}
                    <div>
                        {coverImage ? (
                            <div className="mb-3">
                                <img src={coverImage} alt="Cover" className="w-full h-40 object-cover rounded-lg mb-2" />
                                <button
                                    onClick={removeCoverImage}
                                    className="text-sm text-red-500 hover:text-red-700"
                                >
                                    Remove Cover
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-2">
                                <span className="text-light-secondary dark:text-dark-secondary">No cover</span>
                            </div>
                        )}
                        <div className="flex gap-2">
                            <button
                                onClick={addRandomCoverImage}
                                disabled={loadingImage}
                                className="px-3 py-1 text-sm bg-accent-blue text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
                            >
                                {loadingImage ? 'Loading...' : 'Random Cover'}
                            </button>
                            <label className="px-3 py-1 text-sm bg-accent-blue text-white rounded-lg hover:bg-opacity-90 cursor-pointer">
                                Upload Cover
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleUploadCover}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Task Name */}
                    <div>
                        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">Task name</label>
                        <input
                            type="text"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            placeholder="Enter task name"
                            className="w-full px-3 py-2 border rounded-lg dark:bg-dark-card dark:border-gray-600 dark:text-dark-text"
                        />
                    </div>

                    {/* Status dengan custom dropdown (agar ada titik warna) */}
                    <div>
                        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">Status</label>
                        <div className="relative">
                            <button
                                onClick={() => setIsStatusOpen(!isStatusOpen)}
                                className="w-full flex items-center gap-2 px-3 py-2 border rounded-lg dark:bg-dark-card dark:border-gray-600 dark:text-dark-text text-left"
                            >
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: statusColors[status] }}></div>
                                <span>{status}</span>
                                <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {isStatusOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-light-card dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                                    {STATUSES.map(s => (
                                        <button
                                            key={s}
                                            onClick={() => {
                                                setStatus(s);
                                                setIsStatusOpen(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
                        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">Tags (max 4)</label>
                        <div className="flex flex-wrap gap-2">
                            {TAGS.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedTags.includes(tag)
                                            ? 'bg-accent-blue text-white'
                                            : 'bg-gray-200 dark:bg-gray-700 text-light-text dark:text-dark-text'
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer: Save (kiri) + Cancel (kanan) */}
                <div className="flex items-center gap-3 px-6 py-4 pt-2">
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2"
                        style={{ backgroundColor: '#3762e4' }}
                    >
                        <span>Save</span>
                        <img src="/resources/icons/Done_round.svg" alt="Save" className="w-5 h-5" />
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-light-secondary dark:text-dark-secondary border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                        Cancel
                    </button>
                    <div className="flex-1"></div>
                </div>
            </div>
        </div>
    );
};

export default TaskEditModal;