import axios from 'axios';

// URL endpoint dari devChallenges.io (sesuai challenge)
const BOARD_LIST_URL = 'https://raw.githubusercontent.com/devchallenges-io/curriculum/refs/heads/main/4-frontend-libaries/challenges/group_1/data/task-manager/list.json';

// Daftar emoji logo yang tersedia
const EMOJI_LOGOS = [
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

/**
 * Mengambil semua data board dari API
 * @returns {Promise<Object>} boardsData - Objek dengan key boardId berisi detail board
 */
export const fetchAllBoards = async () => {
    try {
        // 1. Ambil daftar board
        const listResponse = await axios.get(BOARD_LIST_URL);
        const boardList = listResponse.data.boards;

        if (!boardList || !Array.isArray(boardList)) {
            throw new Error('Invalid board list format');
        }

        const boardsData = {};

        // 2. Ambil detail setiap board
        for (const boardInfo of boardList) {
            try {
                const detailResponse = await axios.get(boardInfo.url);
                const boardDetail = detailResponse.data;

                // Transformasi tasks menjadi kolom (Backlog, In Progress, In Review, Completed)
                const columns = {
                    'Backlog': [],
                    'In Progress': [],
                    'In Review': [],
                    'Completed': []
                };

                // Pastikan boardDetail.tasks ada dan berupa array
                if (boardDetail.tasks && Array.isArray(boardDetail.tasks)) {
                    boardDetail.tasks.forEach(task => {
                        // Validasi status task, jika tidak dikenal, default ke 'Backlog'
                        let status = task.status;
                        if (!columns.hasOwnProperty(status)) {
                            status = 'Backlog';
                        }

                        // Format task sesuai yang digunakan di komponen
                        const formattedTask = {
                            id: task.id?.toString() || Date.now().toString(),
                            name: task.name || 'Untitled Task',
                            status: status,
                            tags: Array.isArray(task.tags) ? task.tags : [],
                            coverImage: task.coverImage || null
                        };
                        columns[status].push(formattedTask);
                    });
                }

                // Pilih logo random dari daftar emoji
                const randomLogo = EMOJI_LOGOS[Math.floor(Math.random() * EMOJI_LOGOS.length)];

                boardsData[boardInfo.id] = {
                    id: boardInfo.id,
                    name: boardInfo.name || 'Default Board',
                    logoUrl: randomLogo,
                    columns: columns
                };
            } catch (error) {
                console.error(`Error fetching board detail for ${boardInfo.id}:`, error);
                // Jika satu board gagal, kita tetap lanjut ke board lain
                boardsData[boardInfo.id] = getEmptyBoard(boardInfo.id, boardInfo.name);
            }
        }

        // Jika tidak ada board sama sekali, gunakan fallback
        if (Object.keys(boardsData).length === 0) {
            return getFallbackBoards();
        }

        return boardsData;
    } catch (error) {
        console.error('Error fetching board list:', error);
        // Fallback jika API gagal total
        return getFallbackBoards();
    }
};

/**
 * Membuat board kosong (tanpa task) dengan format yang benar
 */
const getEmptyBoard = (id, name) => {
    return {
        id: id,
        name: name || 'Default Board',
        logoUrl: EMOJI_LOGOS[Math.floor(Math.random() * EMOJI_LOGOS.length)],
        columns: {
            'Backlog': [],
            'In Progress': [],
            'In Review': [],
            'Completed': []
        }
    };
};

/**
 * Data fallback jika API tidak dapat dijangkau
 * Sudah ditambahkan task "Default task" dengan tag "Concept"
 */
const getFallbackBoards = () => {
    return {
        'board-default': {
            id: 'board-default',
            name: 'Default Board',
            logoUrl: EMOJI_LOGOS[0],
            columns: {
                'Backlog': [
                    {
                        id: '7',
                        name: 'Default task',
                        status: 'Backlog',
                        tags: ['Concept'],
                        coverImage: null
                    },
                    {
                        id: '1',
                        name: 'Design System Implementation',
                        status: 'Backlog',
                        tags: ['Design', 'Front-end'],
                        coverImage: null
                    },
                    {
                        id: '2',
                        name: 'Write Documentation',
                        status: 'Backlog',
                        tags: ['Technical'],
                        coverImage: null
                    }
                ],
                'In Progress': [
                    {
                        id: '3',
                        name: 'API Integration',
                        status: 'In Progress',
                        tags: ['Technical'],
                        coverImage: null
                    }
                ],
                'In Review': [],
                'Completed': [
                    {
                        id: '4',
                        name: 'Setup Project',
                        status: 'Completed',
                        tags: [],
                        coverImage: null
                    }
                ]
            }
        },
        'board-extra': {
            id: 'board-extra',
            name: 'Development Roadmap',
            logoUrl: EMOJI_LOGOS[5],
            columns: {
                'Backlog': [
                    {
                        id: '5',
                        name: 'Research new tech stack',
                        status: 'Backlog',
                        tags: ['Technical'],
                        coverImage: null
                    }
                ],
                'In Progress': [],
                'In Review': [],
                'Completed': [
                    {
                        id: '6',
                        name: 'Initial prototype',
                        status: 'Completed',
                        tags: ['Design'],
                        coverImage: null
                    }
                ]
            }
        }
    };
};