/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// export default {
// 	async fetch(request, env, ctx): Promise<Response> {
// 		return new Response('Hello World!');
// 	},
// } satisfies ExportedHandler<Env>;
import { taskRouter } from './routes/tasks';

interface Env {
	DB: any;
}

// export default {
// 	async fetch(request: Request, env: Env): Promise<Response> {
// 		console.log('Fetch handler triggered');
// 		try {
// 			const response = await taskRouter.handle(request, env);
// 			if (response) {
// 				console.log('Response found');
// 				return response;
// 			} else {
// 				console.log('Response not found, returning 404');
// 				return new Response('Not Found', { status: 404 });
// 			}
// 		} catch (error: any) {
// 			console.error('Error occurred:', error);
// 			return new Response(`Error: ${error.message}`, { status: 500 });
// 		}
// 	},
// };
// src/index.ts
export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		console.log('Fetch handler triggered');
		try {
			// データベース接続テスト
			const testResult = await env.DB.prepare('SELECT 1').first();
			console.log('Database connection test result:', testResult);

			const response = await taskRouter.handle(request, env);
			if (response) {
				console.log('Response found:', response.status);
				return response;
			} else {
				console.log('Response not found, returning 404');
				return new Response('Not Found', { status: 404 });
			}
		} catch (error: any) {
			console.error('Error occurred:', error);
			return new Response(`Error: ${error.message}`, { status: 500 });
		}
	},
};
