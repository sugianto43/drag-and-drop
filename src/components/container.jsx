import PropTypes from 'prop-types';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Item from './item';

const Container = (props) => {
	const { id, items = [], title = 'title' } = props;

	const { setNodeRef } = useDroppable({
		id,
	});
	return (
		<SortableContext id={id} items={items} strategy={verticalListSortingStrategy}>
			<div className='w-1/4 bg-gray-200 p-5 rounded-md space-y-2 shadow-md'>
				<h1 className='text-xl font-bold'>{title}</h1>
				<hr className='border-gray-300 mb-10 border-2 rounded-full' />
				<div ref={setNodeRef} className='space-y-2'>
					{items.map((item) => (
						<Item key={item.id} id={item.id} label={item.label} />
					))}
				</div>
			</div>
		</SortableContext>
	);
};

Container.propTypes = {
	id: PropTypes.string.isRequired,
	title: PropTypes.string,
	items: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
		}),
	),
};

export default Container;
