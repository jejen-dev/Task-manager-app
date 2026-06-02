import React, { useState } from 'react';

const emojiLogos = [
    '/resources/emojis/board-logo-01.png',
    '/resources/emojis/board-logo-02.png',
    '/resources/emojis/board-logo-03.png',
    '/resources/emojis/board-logo-04.png',
    '/resources/emojis/board-logo-05.png',
    '/resources/emojis/board-logo-06.png',
    '/resources/emojis/board-logo-07.png',
    '/resources/emojis/board-logo-08.png',
    '/resources/emojis/board-logo-09.png',
    '/resources/emojis/board-logo-10.png',
    '/resources/emojis/board-logo-11.png',
    '/resources/emojis/board-logo-12.png',
    '/resources/emojis/board-logo-13.png'
];

const AddBoardModal = ({ onClose, onAddBoard }) => {
    const [boardName, setBoardName] = useState('');
    const [selectedLogo, setSelectedLogo] = useState(emojiLogos[0]);

    const handleSubmit = () => {
        const trimmedName = boardName.trim();
        if (trimmedName === '') {
            alert('Board name cannot be empty');
            return;
        }
        if (trimmedName.length > 25) {
            alert('Board name cannot exceed 25 characters');
            return;
        }
        onAddBoard(trimmedName, selectedLogo);
        onClose();
    };

    const handleOnChangeName = (e) => setBoardName(e.target.value);
    const handleEnterName = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-[450px] mx-auto">
                <div className="p-5 sm:p-8 space-y-5 sm:space-y-8">
                    <h2 className="text-xl font-semibold text-black dark:text-dark-text">New board</h2>

                    <div>
                        <label className="block text-sm font-medium text-[#7E878D] mb-2">Board name</label>
                        <input
                            type="text"
                            value={boardName}
                            onChange={handleOnChangeName}
                            onKeyDown={handleEnterName}
                            placeholder="Enter board name"
                            className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-dark-card border-gray-300 dark:border-gray-600 text-black dark:text-dark-text text-base focus:border-[#3662E3] focus:ring-1 focus:ring-[#3662E3] focus:outline-none"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#7E878D] mb-2">Logo</label>
                        <div className="grid grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6">
                            {emojiLogos.map((logo, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedLogo(logo)}
                                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full focus:outline-none transition-all ${selectedLogo === logo
                                        ? 'ring-2 ring-[#3662E3] ring-offset-2 ring-offset-white dark:ring-offset-dark-card'
                                        : ''
                                        }`}
                                >
                                    <img
                                        src={logo}
                                        alt={`Logo ${idx + 1}`}
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 sm:gap-4 pt-2 sm:pt-4">
                        <button
                            onClick={handleSubmit}
                            className="flex-1 px-3 py-2 sm:px-4 bg-[#3662E3] text-white rounded-full hover:bg-opacity-90 text-sm sm:text-base flex items-center justify-center gap-2"
                        >
                            <span>Create board</span>
                            <img src="/resources/icons/Done_round.svg" alt="check" className="w-4 h-4 filter brightness-0 invert" />
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 px-3 py-2 sm:px-4 text-[#7E878D] border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-sm sm:text-base"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddBoardModal;