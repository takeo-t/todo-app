export const getAllTasks = async (DB: any) => {
	return await DB.prepare('SELECT * FROM todos').all();
};

export const addTask = async (DB: any, title: string) => {
	return await DB.prepare('INSERT INTO todos (title, completed) VALUES (?, ?)').bind(title, false).run();
};
