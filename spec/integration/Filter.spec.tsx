import { cleanup, render, screen } from '@testing-library/react';
import uE from '@testing-library/user-event';
import { JestStoreProvider } from '../utils/JestStoreProvider';
import { NewTaskBar } from 'src/modules/NewTaskBar';
import { TaskList } from 'src/modules/TaskList';

describe('Список задач', () => {
	beforeEach(() => {
		localStorage.clear();
		jest.clearAllMocks();
	});
	afterEach(() => cleanup());

	const userEvent = uE.setup({ advanceTimers: jest.advanceTimersByTime });
	// не содержит выполненные задачи
	// после нажатия на кнопку фильтрации
	it('с включенным фильтром', async () => {
		render(
			<>
				<NewTaskBar />
				<TaskList />
			</>,
			{ wrapper: JestStoreProvider },
		);

		const inputTask = screen.getByRole('textbox');
		const addTask = screen.getByRole('button', { name: /добавить/i });
		await userEvent.type(inputTask, 'A');
		await userEvent.click(addTask);
		await userEvent.type(inputTask, 'B');
		await userEvent.click(addTask);
		await userEvent.type(inputTask, 'Done');
		await userEvent.click(addTask);

		await userEvent.click(screen.getByLabelText('Done'));

		const filterCheckbox = screen.getByRole('checkbox', {
			name: /показывать выполненные/i,
		});
		await userEvent.click(filterCheckbox);

		expect(screen.getAllByRole('listitem')).toHaveLength(2); // A и B
		expect(screen.queryByText('Done')).not.toBeInTheDocument();
	});

	// показывает как выполненные, так и не выполненные задачи
	// после повторного нажатия на кнопку фильтрации
	it('с выключенным фильтром', async () => {
		render(
			<>
				<NewTaskBar />
				<TaskList />
			</>,
			{ wrapper: JestStoreProvider },
		);

		const inputTask = screen.getByRole('textbox');
		const addTask = screen.getByRole('button', { name: /добавить/i });
		await userEvent.type(inputTask, 'A');
		await userEvent.click(addTask);
		await userEvent.type(inputTask, 'B');
		await userEvent.click(addTask);
		await userEvent.type(inputTask, 'Done');
		await userEvent.click(addTask);

		await userEvent.click(screen.getByLabelText('Done'));

		const filterCheckbox = screen.getByRole('checkbox', {
			name: /показывать выполненные/i,
		});
		await userEvent.click(filterCheckbox);
		await userEvent.click(filterCheckbox);

		expect(screen.getAllByRole('listitem')).toHaveLength(3);
	});

	it('пользователь включает фильтр, потом добавляет новую невыполненную — она сразу видна', async () => {
		render(
			<>
				<NewTaskBar />
				<TaskList />
			</>,
			{ wrapper: JestStoreProvider },
		);

		const inputTask = screen.getByRole('textbox');
		const addTask = screen.getByRole('button', { name: /добавить/i });
		await userEvent.type(inputTask, 'Old');
		await userEvent.click(addTask);

		await userEvent.click(
			screen.getByRole('checkbox', { name: /показывать выполненные/i }),
		);

		await userEvent.type(inputTask, 'Fresh');
		await userEvent.click(addTask);

		expect(screen.getAllByRole('listitem')).toHaveLength(2);
		expect(screen.getByText('Fresh')).toBeInTheDocument();
	});
});
