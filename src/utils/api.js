import axios from 'axios';

const BOARD_LIST_URL = 'https://raw.githubusercontent.com/devchallenges-io/curriculum/refs/heads/main/4-frontend-libaries/challenges/group_1/data/task-manager/list.json';

export const fetchAllBoards = async () => {
    try {
        // Fetch board list
        const listResponse = await axios.get(BOARD_LIST_URL);
        const boardList = listResponse.data.boards;

        // Fetch details for each board
        const boardsData = {};
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

        for (let i = 0; i < boardList.length; i++) {
            const boardInfo = boardList[i];
            const boardDetailsResponse = await axios.get(boardInfo.url);
            const boardDetails = boardDetailsResponse.data;

            // Transform tasks into columns
            const columns = {
                'Backlog': [],
                'In Progress': [],
                'In Review': [],
                'Completed': []
            };

            boardDetails.tasks.forEach(task => {
                const status = task.status;
                if (columns[status]) {
                    columns[status].push({
                        id: task.id.toString(),
                        name: task.name,
                        status: task.status,
                        tags: task.tags || [],
                        coverImage: task.coverImage || null
                    });
                }
            });

            // Assign random logo from emojis
            const randomLogo = emojiLogos[Math.floor(Math.random() * emojiLogos.length)];

            boardsData[boardInfo.id] = {
                id: boardInfo.id,
                name: boardInfo.name,
                logoUrl: randomLogo,
                columns
            };
        }

        return boardsData;
    } catch (error) {
        console.error('Error fetching boards:', error);
        // Fallback data if API fails
        return getFallbackBoards();
    }
};

const getFallbackBoards = () => {
    return {
        'board-1': {
            id: 'board-1',
            name: 'Default Board',
            logoUrl: '/resources/emojis/board-logo-01.png',
            columns: {
                'Backlog': [
                    { id: '1', name: 'Design System Implementation', status: 'Backlog', tags: ['Design', 'Front-end'], coverImage: null },
                    { id: '2', name: 'Write Documentation', status: 'Backlog', tags: ['Technical'], coverImage: null }
                ],
                'In Progress': [
                    { id: '3', name: 'API Integration', status: 'In Progress', tags: ['Technical'], coverImage: null }
                ],
                'In Review': [],
                'Completed': [
                    { id: '4', name: 'Setup Project', status: 'Completed', tags: [], coverImage: null }
                ]
            }
        }
    };
};