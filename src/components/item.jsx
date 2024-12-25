import PropTypes from 'prop-types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Item = (props) => {
	const { label, id } = props;

	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};
	return (
		<div
			className='bg-gray-50 rounded p-2 px-4 shadow-lg'
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
		>
			{label}
		</div>
	);
};

Item.propTypes = {
	label: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
};

export default Item;
