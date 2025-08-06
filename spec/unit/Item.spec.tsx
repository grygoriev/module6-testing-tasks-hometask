import { cleanup, render, screen } from '@testing-library/react';
import uE from '@testing-library/user-event';
import { Item } from 'src/components/Item';

const makeTask = (over: Partial<Task> = {}): Task => ({
	id: 't1',
	header: 'valid header',
	done: false,
	...over,
});

describe('Элемент списка задач', () => {
	const userEvent = uE.setup({ advanceTimers: jest.advanceTimersByTime });

	afterEach(() => cleanup());

	it('название не должно быть больше 32 символов', () => {
		const longHeader = 'а'.repeat(33);
		const task = makeTask({ header: longHeader });

		render(<Item {...task} onDelete={jest.fn()} onToggle={jest.fn()} />);
		expect(screen.queryByText(longHeader)).not.toBeInTheDocument();
	});

	it('название не должно быть пустым', () => {
		const task = makeTask({ header: '' });

		render(<Item {...task} onDelete={jest.fn()} onToggle={jest.fn()} />);

		expect(screen.queryByLabelText(task.id)).not.toBeInTheDocument();
	});

	it('нельзя удалять невыполненные задачи', () => {
		const task = makeTask({ done: false });

		render(<Item {...task} onDelete={jest.fn()} onToggle={jest.fn()} />);

		expect(screen.getByRole('button')).toBeDisabled();
	});

	it('checkbox отражает поле done', () => {
		const completed = makeTask({ id: 'c1', done: true });

		render(<Item {...completed} onDelete={jest.fn()} onToggle={jest.fn()} />);

		expect(screen.getByRole('checkbox')).toBeChecked();
	});

	it('по клику вызываются onToggle и onDelete', async () => {
		const onToggle = jest.fn();
		const onDelete = jest.fn();
		const task = makeTask({ done: true });

		render(<Item {...task} onToggle={onToggle} onDelete={onDelete} />);

		await userEvent.click(screen.getByText(task.header));
		expect(onToggle).toHaveBeenCalledWith(task.id);

		await userEvent.click(screen.getByRole('button'));
		expect(onDelete).toHaveBeenCalledWith(task.id);
	});
});
