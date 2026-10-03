import { cloneElement, useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const DragAndDrop = ({ data, children, update, direction, disableKey = false }) => {
  const { nestedDraggable } = useSelector((state) => state.nestedDraggable);

  const dispatch = useDispatch();
  const [items, setItems] = useState(data);

  useEffect(() => setItems(data), [data]);

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const newItems = reorder(items, result.source.index, result.destination.index);
    const arr = [];
    newItems.forEach((el) => {
      arr.push(el.id);
    });
    if (JSON.stringify(items) !== JSON.stringify(newItems)) {
      dispatch(update(arr));
      setItems(newItems);
    }
  };

  // Normally you would want to split things out into separate components.
  // But in this dashboard everything is just done in one place for simplicity

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable type="list" droppableId="droppable" direction={direction}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={direction === 'horizontal' ? 'flex flex-wrap' : 'w-full'}
          >
            {items?.map((item, index) => {
              return (
                <Draggable
                  onStop={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onDrag={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  type="list"
                  key={`${item.id}`}
                  draggableId={`${item.id}`}
                  index={index}
                  isDragDisabled={disableKey ? !nestedDraggable[disableKey] : false}
                >
                  {(prov, snap) => (
                    <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}>
                      {cloneElement(children, { item, index })}
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DragAndDrop;
