import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store/configureStore';
import { toggleShowCompleted } from 'src/store/taskSlice';

export const Filter = () => {
	const dispatch = useDispatch();
	const checked = useSelector((state: RootState) => state.taskList.showCompleted);

	return (
		<label style={{ display: 'block', margin: '8px 0' }}>
			<input
				type="checkbox"
				checked={checked}
				onChange={() => dispatch(toggleShowCompleted())}
				aria-label="Показывать выполненные задачи"
			/>
			Показывать выполненные
		</label>
	);
};
