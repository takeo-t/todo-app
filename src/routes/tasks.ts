import { Router } from 'itty-router';

const taskRouter = Router();

taskRouter.get('/api/tasks', () => {
	console.log('GET /api/tasks handler entered');
	return new Response(JSON.stringify({ message: 'Test response' }), {
		headers: { 'content-type': 'application/json' },
	});
});

export default {
	async fetch(request: Request): Promise<Response> {
		console.log('Fetch handler triggered');
		return taskRouter.handle(request);
	},
};
