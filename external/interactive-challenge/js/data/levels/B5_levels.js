window.B5_LEVELS = {
    generate: function (lvl) {
        // Informatics: Scheduling & Load Balancing
        // Lvl 1: 3 Tasks, 1 Worker (Sequential)
        // Lvl 10: 6 Tasks, 2 Workers (Parallel)
        // Lvl 30: 10 Tasks, 3 Workers (Uneven loads)

        const tasks = [];
        const taskCount = Math.min(20, 3 + Math.floor(lvl / 2)); // Up to 20 tasks

        // Task costs increase with level
        const maxCost = 5 + Math.floor(lvl / 10);

        for (let i = 0; i < taskCount; i++) {
            tasks.push({
                cost: Math.floor(Math.random() * maxCost) + 1,
                id: i
            });
        }

        const workers = Math.min(5, 2 + Math.floor(lvl / 15)); // Up to 5 workers

        return { tasks, workers };
    }
};
