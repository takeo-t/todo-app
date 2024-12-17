import { Router } from 'itty-router';

export const taskRouter = Router();

taskRouter.get('/api/tasks', async (request, env) => {
	const { results } = await env.DB.prepare('SELECT * FROM todos').all();
	return new Response(JSON.stringify(results), {
		headers: { 'content-type': 'application/json' },
	});
});

taskRouter.post('/api/tasks', async (request, env) => {
	const { title } = (await request.json()) as { title: string };
	await env.DB.prepare('INSERT INTO todos (title, completed) VALUES (?, ?)').bind(title, false).run();
	return new Response('Task created', { status: 201 });
});

taskRouter.all('*', async () => new Response('Not found', { status: 404 }));

export default {
	async fetch(request: any, env: any) {
		return taskRouter
			.handle(request, env)
			.then((response: any) => response || new Response('Not found', { status: 404 }))
			.catch((error: { stack: any }) => new Response(error.stack || error, { status: 500 }));
	},
};
