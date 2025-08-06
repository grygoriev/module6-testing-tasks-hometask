import { act, render, screen, cleanup, waitFor } from '@testing-library/react';
import uE from '@testing-library/user-event';
import { NewTaskBar } from 'src/modules/NewTaskBar';
import { TaskList } from 'src/modules/TaskList';
import { NotifierContainer } from 'src/modules/NotifierContainer';
import { JestStoreProvider } from '../utils/JestStoreProvider';

beforeAll(() => jest.useFakeTimers());
afterEach(() => {
	cleanup();
	localStorage.clear();
	jest.clearAllTimers();
});

const userEvent = uE.setup({ advanceTimers: jest.advanceTimersByTime });

const addTaskUI = async (txt: string) => {
	await userEvent.type(screen.getByRole('textbox'), txt);
	await userEvent.click(screen.getByRole('button', { name: /добавить/i }));
};

const toggleTaskUI = async (header: string) => {
	await userEvent.click(screen.getByText(header));
};

describe('Оповещение при выполнении задачи', () => {
	it('появляется и содержит заголовок задачи', async () => {
		render(
			<>
				<NewTaskBar />
				<TaskList />
				<NotifierContainer />
			</>,
			{ wrapper: JestStoreProvider },
		);

		await addTaskUI('купить хлеб');
		await toggleTaskUI('купить хлеб');

		const notifier = await screen.findByText(/Задача "купить хлеб" завершена/i);
		expect(notifier).toBeInTheDocument();

		act(() => jest.advanceTimersByTime(2000));
		await waitFor(() =>
			expect(
				screen.queryByText(/Задача "купить хлеб" завершена/i),
			).not.toBeInTheDocument(),
		);
	});

	it('одновременно отображается только одно оповещение', async () => {
		render(
			<>
				<NewTaskBar />
				<TaskList />
				<NotifierContainer />
			</>,
			{ wrapper: JestStoreProvider },
		);

		await addTaskUI('первая');
		await addTaskUI('вторая');

		await toggleTaskUI('первая');
		const first = await screen.findByText(/"первая" завершена/i);
		expect(first).toBeInTheDocument();

		await toggleTaskUI('вторая');

		const wrappers = screen.getAllByText(/Задача "/i);
		expect(wrappers).toHaveLength(1);

		expect(wrappers[0]).toHaveTextContent(/"вторая" завершена/i);
	});
});
