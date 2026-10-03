import { cloneElement, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useDispatch } from 'react-redux';

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const FooterDragAndDrop = ({
  data,
  children,
  update,
  direction = 'vertical',
  isDragDisabled = false,
}) => {
  const dispatch = useDispatch();

  const [items, setItems] = useState(data);
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
    dispatch(update(arr));
    setItems(newItems);
  };

  function borderType(itemsBorder) {
    if (itemsBorder === 'borderTop') {
      return 'borderTop';
    }
    if (itemsBorder === 'borderBottom') {
      return 'borderBottom';
    }

    return 'borderNone';
  }
  // Normally you would want to split things out into separate components.
  // But in this dashboard everything is just done in one place for simplicity

  return (
    <DragDropContext onDragEnd={onDragEnd} className="w-full ">
      <Droppable droppableId="droppable" direction={direction} className="flex w-full">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={direction === 'vertical' ? 'w-full' : 'w-full flex '}
          >
            {items?.map((item, index) => {
              const itemBorder = borderType(item.border);
              return (
                <Draggable
                  key={`${item.id}`}
                  draggableId={`${item.id}`}
                  index={index}
                  className={direction === 'vertical' ? 'w-full' : 'flex bg-slate-900 '}
                  style={{ height: '200px' }}
                  isDragDisabled={isDragDisabled}
                >
                  {(prov) => (
                    <div className={direction === 'vertical' ? 'my-7  w-full' : ' w-full h-full'}>
                      <div
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        {...prov.dragHandleProps}
                        className="w-full"
                      >
                        <div className="w-full flex">
                          <div
                            className="w-full flex h-full bg-slate-900 mx-2 my-7"
                            style={{
                              height: direction !== 'vertical' ? '370px' : 'auto',
                              [itemBorder]: '1px solid',
                            }}
                          >
                            {cloneElement(children, { item, index })}
                          </div>
                        </div>
                      </div>
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

export default FooterDragAndDrop;
