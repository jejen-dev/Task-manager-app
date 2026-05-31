import React, { useState } from 'react';

// Daftar path logo board yang tersedia (13 pilihan)
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

// Komponen modal untuk menambah board baru
const AddBoardModal = ({ onClose, onAddBoard }) => {
    // State nama board
    const [boardName, setBoardName] = useState('');
    // State logo yang dipilih (default logo pertama)
    const [selectedLogo, setSelectedLogo] = useState(emojiLogos[0]);

    // Fungsi submit: validasi dan panggil onAddBoard dari parent
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
        // Panggil fungsi addBoard yang diberikan dari props
        onAddBoard(trimmedName, selectedLogo);
        onClose(); // Tutup modal setelah berhasil
    };

    // Handler perubahan input nama board
    const handleOnChangeName = (e) => {
        console.dir(e); // Log event untuk debugging (boleh dihapus)
        setBoardName(e.target.value);
    }

    // Handler tombol Enter pada input
    const handleEnterName = (event) => {
        if (event.key === 'Enter') {
            console.log('Tombol Enter ditekan di React!');
            event.preventDefault(); // Mencegah submit default form
            handleSubmit();
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-xl max-w-md w-full">
                {/* Header modal: judul dan tombol close */}
                <div className="flex justify-between items-center p-4 pb-2">
                    <h2 className="text-xl font-semibold text-black dark:text-dark-text">New board</h2>
                    <button onClick={onClose} className="text-black dark:text-dark-secondary hover:text-gray-700 dark:hover:text-gray-300">
                        <img src="/resources/icons/Close_round.svg" alt="Close" className="w-6 h-6 filter dark:invert-0 invert" />
                    </button>
                </div>

                {/* Body modal: form input nama dan pilihan logo */}
                <div className="p-4 pt-0 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-black dark:text-dark-text mb-2">Board name</label>
                        <input
                            type="text"
                            value={boardName}
                            onChange={handleOnChangeName}
                            onKeyDown={handleEnterName}
                            placeholder="Enter board name"
                            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-dark-card border-gray-300 dark:border-gray-600 text-black dark:text-dark-text"
                            autoFocus // Fokus otomatis saat modal terbuka
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-black dark:text-dark-text mb-2">Logo</label>
                        {/* Baris pertama: 8 logo */}
                        <div className="flex flex-wrap gap-1 mb-1">
                            {emojiLogos.slice(0, 8).map((logo, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedLogo(logo)}
                                    className="w-12 h-12 rounded-full overflow-hidden focus:outline-none"
                                >
                                    <img
                                        src={logo}
                                        alt={`Logo ${idx + 1}`}
                                        className={`w-full h-full object-cover transition-all ${selectedLogo === logo
                                            ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-dark-card'
                                            : 'opacity-40 hover:opacity-100'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        {/* Baris kedua: 5 logo */}
                        <div className="flex flex-wrap gap-1">
                            {emojiLogos.slice(8, 13).map((logo, idx) => (
                                <button
                                    key={idx + 8}
                                    onClick={() => setSelectedLogo(logo)}
                                    className="w-12 h-12 rounded-full overflow-hidden focus:outline-none"
                                >
                                    <img
                                        src={logo}
                                        alt={`Logo ${idx + 9}`}
                                        className={`w-full h-full object-cover transition-all ${selectedLogo === logo
                                            ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-dark-card'
                                            : 'opacity-40 hover:opacity-100'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer modal: tombol Create board dan Cancel */}
                <div className="flex items-center gap-3 p-4 pt-2">
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2"
                    >
                        <span>Create board</span>
                        <img src="/resources/icons/Done_round.svg" alt="Create" className="w-5 h-5" />
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-black dark:text-dark-secondary border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                        Cancel
                    </button>
                    <div className="flex-1"></div>
                </div>
            </div>
        </div>
    );
};

export default AddBoardModal;