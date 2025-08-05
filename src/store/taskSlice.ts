import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './configureStore';

const MAX_UNCOMPLETED = 10;

export interface taskListState {
	list: Task[];
	notification: string;
	showCompleted: boolean;
}

const initialState: taskListState = {
	list: [],
	notification: '',
	showCompleted: true,
};

export const taskListSlice = createSlice({
	name: 'taskList',
	initialState,
	reducers: {
		addTask: (state, action: PayloadAction<Task['header']>) => {
			const uncompleted = state.list.filter((task) => !task.done).length;
			if (uncompleted >= 10) return;
			state.list.push({
				id: crypto.randomUUID(),
				header: action.payload,
				done: false,
			});
		},
		completeTask: (state, action: PayloadAction<Task['id']>) => {
			const task = state.list.find((x) => x.id === action.payload);

			if (task) {
				task.done = true;
			}
		},
		toggleTask: (state, action: PayloadAction<Task['id']>) => {
			const task = state.list.find((x) => x.id === action.payload);

			if (task) {
				task.done = !task.done;

				if (task.done) {
					state.notification = `Задача "${task.header}" завершена`;
				}
			}
		},
		deleteTask: (state, action: PayloadAction<Task['id']>) => {
			state.list = state.list.filter((x) => x.id !== action.payload);
		},
		setNotification: (state, action: PayloadAction<Task['header']>) => {
			state.notification = `Задача "${action.payload}" завершена`;
		},
		clearNotification: (state) => {
			state.notification = '';
		},
		toggleShowCompleted: (s) => {
			s.showCompleted = !s.showCompleted;
		},
	},
});

export const {
	addTask,
	completeTask,
	deleteTask,
	toggleTask,
	clearNotification,
	toggleShowCompleted,
} = taskListSlice.actions;

export default taskListSlice.reducer;

export const tasksSelector = (state: RootState) => {
	const { list, showCompleted } = state.taskList;

	const uncompleted = list.filter((t) => !t.done);
	const completed = list.filter((t) => t.done);

	const visibleUncompleted = uncompleted.slice(0, MAX_UNCOMPLETED);

	if (!showCompleted) return visibleUncompleted;

	return [...visibleUncompleted, ...completed];
};

export const fullCount = (state: RootState) => state.taskList.list.length;

export const completeCount = (state: RootState) =>
	state.taskList.list.filter((x) => x.done).length;

export const uncompleteCount = (state: RootState) =>
	state.taskList.list.filter((x) => !x.done).length;

export const getNotification = (state: RootState) => state.taskList.notification;
