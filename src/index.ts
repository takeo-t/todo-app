import { Router, Method } from 'tiny-request-router';

// const router = new Router();
const router = new Router();

// ルート設定
// GETエンドポイント
// router.get('/api/tasks', (request: any) => {
// 	console.log('GET /api/tasks handler entered');
// 	return new Response(JSON.stringify({ message: 'Tiny router test response' }), {
// 		headers: { 'content-type': 'application/json' },
// 	});
// });
// GETエンドポイント
router.get('/api/tasks', async (request: Request, env: any) => {
	console.log('GET /api/tasks handler entered');
	console.log('env keys:', Object.keys(env)); // `env` に含まれるキー一覧を確認
	console.log('env.DB:', env.DB);
	console.log('env:', JSON.stringify(env, null, 2)); // 環境変数を全て出力

	if (!env.DB) {
		console.error('Database binding "DB" is undefined.');
		return new Response('Database binding "DB" is undefined.', { status: 500 });
	}

	try {
		const { results } = await env.DB.prepare('SELECT * FROM todos').all();
		console.log('Fetched tasks:', results);
		return new Response(JSON.stringify(results), { headers: { 'content-type': 'application/json' } });
	} catch (error) {
		console.error('Error fetching tasks:', error);
		return new Response('Failed to fetch tasks', { status: 500 });
	}
});

// POSTエンドポイント
router.post('/api/tasks', async (request: any) => {
	console.log('POST /api/tasks handler entered');
	const { title } = await request.json();
	console.log('Received data:', title);
	return new Response('Task created', { status: 201 });
});

// デフォルトハンドラー
router.all('*', (request: any) => {
	console.log('No matching route');
	return new Response('Route not found', { status: 404 });
});

export default {
	async fetch(request: Request): Promise<Response> {
		console.log('Tiny-router handler triggered');
		const match = router.match(request.method as Method, new URL(request.url).pathname);
		if (match) {
			return match.handler(request, match.params);
		}
		return new Response('Route not found', { status: 404 });
	},
};
