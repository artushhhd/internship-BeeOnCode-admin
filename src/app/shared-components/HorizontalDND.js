import { cloneElement, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ListManager } from 'react-beautiful-dnd-grid';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const HorizontalDND = ({ data, children, update, disableKey }) => {
  const dispatch = useDispatch();
  const [items, setItems] = useState(data);
  const { nestedDraggable } = useSelector((state) => state.nestedDraggable);
  const listManagerRef = useRef(null);
  const [maxItems, setMaxItems] = useState(3);

  useEffect(() => setItems(data), [data]);

  useEffect(() => {
    const handleResize = () => {
      if (listManagerRef.current) {
        const width = listManagerRef.current.offsetWidth;
        const itemsThatFit = Math.floor(width / 108);
        setMaxItems(itemsThatFit);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const onDragEnd = (sourceIndex, destinationIndex) => {
    if (destinationIndex === sourceIndex) {
      return;
    }
    const newItems = reorder(items, sourceIndex, destinationIndex);
    const arr = [];
    newItems.forEach((el) => {
      arr.push(el.id);
    });
    dispatch(update(arr));
    setItems(newItems);
  };

  return (
    <div ref={listManagerRef}>
      <ListManager
        key={maxItems}
        items={items}
        direction="horizontal"
        isDragDisabled={disableKey ? !nestedDraggable[disableKey] : false}
        maxItems={maxItems}
        render={(item, index) => {
          return cloneElement(children, { item, index });
        }}
        onDragEnd={onDragEnd}
      />
    </div>
  );
};

export default HorizontalDND;
