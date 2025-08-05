import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import taskListReducer from 'src/store/taskSlice';

export const JestStoreProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const freshStore = configureStore({ reducer: { taskList: taskListReducer } });
	return <Provider store={freshStore}>{children}</Provider>;
};
