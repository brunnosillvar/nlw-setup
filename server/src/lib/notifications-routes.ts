import WebPush from 'web-push';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';

// Gera duas chaves, uma privada e uma pública (uma forma de assegurar a comunicação entre duas pontas)
//console.log(WebPush.generateVAPIDKeys());

const publicKey = 'BIo2r1LVERzhnLncw1Dxpkyus6H4HzD92hfjUPkVQfEuozBDuSaY4XAjQWJUgn_rqUIXEChBPE11umCRenVvr9A';
const privateKey = 'bXvdh2PHGfx3SO2uVQoL_8pH9D2Thrlrw5AAar5pkSk';

WebPush.setVapidDetails('http://localhost:3333', publicKey, privateKey);

export async function notificationRoutes(app: FastifyInstance) {
	app.get('/push/public_key', () => {
		return {
			publicKey,
		};
	});

	app.post('/push/register', (request, reply) => {
		// Cadastrar no banco para cada inscrição do usuário
		console.log(request.body);
		return reply.status(201).send();
	});

	app.post('/push/send', async (request, reply) => {
		const sendPushBody = z.object({
			subscription: z.object({
				endpoint: z.string(),
				keys: z.object({
					p256dh: z.string(),
					auth: z.string(),
				}),
			}),
		});
		const { subscription } = sendPushBody.parse(request.body);

		setTimeout(() => {
			WebPush.sendNotification(subscription, 'Hello do Back-End');
		}, 5000);
		return reply.status(201).send();
	});
}
