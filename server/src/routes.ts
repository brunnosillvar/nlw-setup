import { FastifyInstance } from 'fastify';
import { prisma } from './lib/prisma';
import { z } from 'zod';
import dayjs from 'dayjs';

export async function appRoutes(app: FastifyInstance) {
	// Rota para criar habitos
	app.post('/habits', async (request) => {
		const createHabitBody = z.object({
			title: z.string(),
			weekDays: z.array(z.number().min(0).max(6)),
		});

		const { title, weekDays } = createHabitBody.parse(request.body);

		const today = dayjs().startOf('day').toDate();

		await prisma.habit.create({
			data: {
				title,
				created_at: today,
				weekDays: {
					create: weekDays.map((weekDay) => {
						return {
							week_day: weekDay,
						};
					}),
				},
			},
		});
	});

	// Rota para buscar todos os habitos do dia possíveis
	app.get('/day', async (request) => {
		const getDayParams = z.object({
			date: z.coerce.date(),
		});
		const { date } = getDayParams.parse(request.query);
		const parseDate = dayjs(date).startOf('day');
		const weekDay = parseDate.get('day');

		const possibleHabits = await prisma.habit.findMany({
			where: {
				created_at: {
					lte: date,
				},
				weekDays: {
					some: {
						week_day: weekDay,
					},
				},
			},
		});

		const day = await prisma.day.findUnique({
			where: {
				date: parseDate.toDate(),
			},
			include: {
				dayHabits: true,
			},
		});

		const completedHabits = day?.dayHabits.map((dayHabit) => {
			return dayHabit.habit_id;
		});

		return { possibleHabits, completedHabits };
	});

	// Rota para marcar um habito como concluido ou não
	app.patch('/habits/:id/toogle', async (request) => {
		const toogleHabitParams = z.object({
			id: z.string().uuid(),
		});

		const { id } = toogleHabitParams.parse(request.params);

		const today = dayjs().startOf('day').toDate();

		let day = await prisma.day.findUnique({
			where: {
				date: today,
			},
		});

		if (!day) {
			day = await prisma.day.create({
				data: {
					date: today,
				},
			});
		}

		const dayHabit = await prisma.dayHabit.findUnique({
			where: {
				day_id_habit_id: {
					day_id: day.id,
					habit_id: id,
				},
			},
		});

		if (dayHabit) {
			await prisma.dayHabit.delete({
				where: {
					id: dayHabit.id,
				},
			});
		} else {
			await prisma.dayHabit.create({
				data: {
					day_id: day.id,
					habit_id: id,
				},
			});
		}
	});

	// Rota para resumo dos habitos (query mais complexas deve escrever o SQL na mão = nesse formato só funciona no banco de dados específicos escolhido)
	app.get('/summary', async () => {
		const summary = await prisma.$queryRaw`
			SELECT 
				D.id, 
				D.date,
				(
					SELECT 
						cast(count(*) as float)
					FROM day_habit DH
					WHERE DH.day_id = D.id
				) as completed,
				(
					SELECT 
						cast(count(*) as float)
					FROM week_days WD	
					JOIN habits H
						ON H.id = WD.habit_id
					WHERE
						WD.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
						AND H.created_at <= D.date
				) as amount
			FROM days D
		`;

		return summary;
	});
}
