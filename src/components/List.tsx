import { Item } from './Item';

type Props = {
	items: Task[];
	onDelete: (id: Task['id']) => void;
	onToggle: (id: Task['id']) => void;
};

export const List = ({ items, onDelete, onToggle }: Props) => {
	const uncompleted = items.filter((task) => !task.done).slice(0, 10);
	const completed = items.filter((task) => task.done);

	const toRender = [...uncompleted, ...completed];

	return (
		<ul className="task-list tasks">
			{toRender.map((item) => (
				<Item key={item.id} {...item} onDelete={onDelete} onToggle={onToggle} />
			))}
		</ul>
	);
};
