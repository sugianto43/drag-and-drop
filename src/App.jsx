import { useState } from 'react';
import {
	DndContext,
	closestCorners,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import Container from './components/container';

function App() {
	const [items, setItems] = useState({
		options: [
			{ id: '1', label: 'Sales Cloud' },
			{ id: '2', label: 'Service Cloud' },
			{ id: '3', label: 'Community Cloud' },
			{ id: '4', label: 'Financial Cloud' },
			{ id: '5', label: 'Einstein AI' },
			{ id: '6', label: 'Wave Analytics' },
			{ id: '7', label: 'Health Cloud' },
		],
		selected: [],
	});

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	function findContainer(id) {
		if (id in items) {
			return id;
		}

		return Object.keys(items).find((key) => items[key].some((item) => item.id === id));
	}

	function handleDragOver(event) {
		const { active, over, draggingRect } = event;
		const { id } = active;
		const { id: overId } = over;

		// Find the containers
		const activeContainer = findContainer(id);
		const overContainer = findContainer(overId);

		if (!activeContainer || !overContainer || activeContainer === overContainer) {
			return;
		}

		setItems((prev) => {
			const activeItems = prev[activeContainer];
			const overItems = prev[overContainer];

			// Find the indexes for the items
			const activeIndex = activeItems.findIndex((item) => item.id === id);
			const overIndex = overItems.findIndex((item) => item.id === overId);

			let newIndex;
			if (overId in prev) {
				// We're at the root droppable of a container
				newIndex = overItems.length + 1;
			} else {
				const isBelowLastItem =
					over &&
					overIndex === overItems.length - 1 &&
					draggingRect?.offsetTop > over.rect.offsetTop + over.rect.height;

				const modifier = isBelowLastItem ? 1 : 0;

				newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
			}

			return {
				...prev,
				[activeContainer]: [...prev[activeContainer].filter((item) => item.id !== active.id)],
				[overContainer]: [
					...prev[overContainer].slice(0, newIndex),
					items[activeContainer][activeIndex],
					...prev[overContainer].slice(newIndex, prev[overContainer].length),
				],
			};
		});
	}

	function handleDragEnd(event) {
		const { active, over } = event;
		const { id } = active;
		const { id: overId } = over;

		const activeContainer = findContainer(id);
		const overContainer = findContainer(overId);

		if (!activeContainer || !overContainer || activeContainer !== overContainer) {
			return;
		}

		const activeIndex = items[activeContainer].findIndex((item) => item.id === active.id);
		const overIndex = items[overContainer].findIndex((item) => item.id === overId);

		if (activeIndex !== overIndex) {
			setItems((items) => ({
				...items,
				[overContainer]: arrayMove(items[overContainer], activeIndex, overIndex),
			}));
		}
	}
	return (
		<div className='m-10 flex gap-10 items-start justify-center'>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCorners}
				onDragOver={handleDragOver}
				onDragEnd={handleDragEnd}
			>
				<Container id='options' title='Available Options' items={items.options} />
				<Container id='selected' title='Selected Options' items={items.selected} />
			</DndContext>
		</div>
	);
}

export default App;
