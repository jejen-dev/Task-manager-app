import axios from 'axios';

/**
 * URL endpoint daftar board dari devChallenges.io.
 */
const BOARD_LIST_URL = 'https://raw.githubusercontent.com/devchallenges-io/curriculum/refs/heads/main/4-frontend-libaries/challenges/group_1/data/task-manager/list.json';

/**
 * Daftar path emoji logo yang tersedia untuk board.
 */
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
 * Mengambil semua data board dari API.
 * - Ambil daftar board dari BOARD_LIST_URL.
 * - Untuk setiap board, ambil detail dan transform tasks menjadi kolom (Backlog, In Progress, In Review, Completed).
 * - Setiap board diberi logo secara acak dari EMOJI_LOGOS.
 * @returns {Promise<Object>} Objek dengan key boardId berisi detail board.
 */
export const fetchAllBoards = async () => {
    try {
        const listResponse = await axios.get(BOARD_LIST_URL);
        const boardList = listResponse.data.boards;

        if (!boardList || !Array.isArray(boardList)) {
            throw new Error('Invalid board list format');
        }

        const boardsData = {};

        for (const boardInfo of boardList) {
            try {
                const detailResponse = await axios.get(boardInfo.url);
                const boardDetail = detailResponse.data;

                const columns = {
                    'Backlog': [],
                    'In Progress': [],
                    'In Review': [],
                    'Completed': []
                };

                if (boardDetail.tasks && Array.isArray(boardDetail.tasks)) {
                    boardDetail.tasks.forEach(task => {
                        let status = task.status;
                        if (!columns.hasOwnProperty(status)) {
                            status = 'Backlog';
                        }

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

                const randomLogo = EMOJI_LOGOS[Math.floor(Math.random() * EMOJI_LOGOS.length)];

                boardsData[boardInfo.id] = {
                    id: boardInfo.id,
                    name: boardInfo.name || 'Default Board',
                    logoUrl: randomLogo,
                    columns: columns
                };
            } catch (error) {
                console.error(`Error fetching board detail for ${boardInfo.id}:`, error);
                boardsData[boardInfo.id] = getEmptyBoard(boardInfo.id, boardInfo.name);
            }
        }

        if (Object.keys(boardsData).length === 0) {
            return getFallbackBoards();
        }

        return boardsData;
    } catch (error) {
        console.error('Error fetching board list:', error);
        return getFallbackBoards();
    }
};

/**
 * Membuat board kosong (tanpa task) dengan format yang benar.
 * @param {string} id - ID board.
 * @param {string} name - Nama board.
 * @returns {Object} Board kosong dengan empat kolom.
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
 * Data fallback jika API tidak dapat dijangkau.
 * Berisi beberapa board contoh dengan task default.
 * @returns {Object} Objek board fallback.
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