import React, { useState } from 'react';
import { useBoards } from '../contexts/BoardsContext';

const TAGS = ['Concept', 'Technical', 'Design', 'Front-end'];
const STATUSES = ['Backlog', 'In Progress', 'In Review', 'Completed'];

const TaskEditModal = ({ task, onClose }) => {
    const { boards, activeBoardId, updateTask } = useBoards();
    const [taskName, setTaskName] = useState(task.name);
    const [status, setStatus] = useState(task.status);
    const [selectedTags, setSelectedTags] = useState(task.tags || []);
    const [coverImage, setCoverImage] = useState(task.coverImage || null);
    const [loadingImage, setLoadingImage] = useState(false);

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
            // Using Lorem Picsum as fallback (works without API key)
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
            <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">Edit Task</h2>
                    <button
                        onClick={onClose}
                        className="text-light-secondary dark:text-dark-secondary hover:text-gray-700 dark:hover:text-gray-300"
                    >
                        <img src="/resources/icons/Close_round.svg" alt="Close" className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                            Task Name
                        </label>
                        <input
                            type="text"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg dark:bg-dark-card dark:border-gray-600 dark:text-dark-text"
                            placeholder="Enter task name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                            Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg dark:bg-dark-card dark:border-gray-600 dark:text-dark-text"
                        >
                            {STATUSES.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                            Tags (max 4)
                        </label>
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

                    <div>
                        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                            Cover Image
                        </label>
                        {coverImage && (
                            <div className="mb-3">
                                <img src={coverImage} alt="Cover" className="w-full h-40 object-cover rounded-lg mb-2" />
                                <button
                                    onClick={removeCoverImage}
                                    className="text-sm text-red-500 hover:text-red-700"
                                >
                                    Remove Image
                                </button>
                            </div>
                        )}
                        <button
                            onClick={addRandomCoverImage}
                            disabled={loadingImage}
                            className="w-full px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
                        >
                            {loadingImage ? 'Loading...' : coverImage ? 'Change Cover Image' : 'Add Cover Image'}
                        </button>
                    </div>
                </div>

                <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-light-secondary dark:text-dark-secondary hover:text-gray-700 dark:hover:text-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-accent-green text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2"
                    >
                        <img src="/resources/icons/Done_round.svg" alt="Save" className="w-5 h-5" />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskEditModal;