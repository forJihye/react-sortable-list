import { DragEvent, useEffect, useRef, useState } from "react";

interface Item {
  id: number;
  name: string;
}

const data = [
  { id: 0, name: 'apple' },
  { id: 1, name: 'banana' },
  { id: 2, name: 'oranges' },
  { id: 3, name: 'watermelon' },
  { id: 4, name: 'pineapple' }
];

const PreviewSort = () => {
  const ref = useRef<HTMLUListElement|null>(null);
  const [list, setList] = useState<Item[]>(data);
  const [itemSize, setItemSize] = useState(Array.from({length: data.length}));
  
  const [isChosen, setIsChosen] = useState<boolean>(false);
  const [store, setStore] = useState<{target: null|HTMLElement; currentIndex: null|number; list: Item[]}>({
    target: null,
    currentIndex: null,
    list: [],
  });
  
  useEffect(() => {
    if (ref) {
      const ul = ref.current as HTMLUListElement;
      const itemHeight = [...ul.childNodes].map((el) => (el as Element).clientHeight);
      setItemSize(itemHeight);
    }
  }, []);

  const onDragOverContainer = (ev: DragEvent<HTMLElement>) => {
    ev.preventDefault();
    ev.stopPropagation();
  }

  const onDragStart = (ev: DragEvent<HTMLElement>) => {
    const target = ev.target as HTMLElement;
    target ? setIsChosen(true) : setIsChosen(false);
    
    ev.dataTransfer.effectAllowed = 'move';
    ev.dataTransfer.setData('text/html', target as any);

    setStore({...store, target, currentIndex: Number(target.dataset.index)});
  }

  const onDragEnter = (ev: DragEvent<HTMLElement>) => {
    if (!isChosen) return;
    const target = ev.target as HTMLElement;
    const from = Number(store.currentIndex); // 드래그 시작 위치
    const to = Number(target.dataset.index); // 드래그 종료 위치
    
    const updating = [...list];
    updating[from] = updating.splice(to, 1, updating[from])[0];

    setList(updating);
    setStore({...store, list: updating});
  }

  const onDragOver = (ev:DragEvent<HTMLElement>) => {
    ev.preventDefault();
    ev.stopPropagation();
    const leaveIndex = Number((ev.target as HTMLElement).dataset.index);
    setStore({...store, currentIndex: leaveIndex});
  }

  const onDragEnd = (ev: DragEvent<HTMLElement>) => {
    setIsChosen(false);
    setList(store.list);
  }

  return <>
    <ul ref={ref} className='sortable-list' onDragOver={onDragOverContainer}>
      {list.map(({id, name}, i, array) => {
        return <li key={`item-${i}`} 
          data-index={i}
          draggable='true'

          onDragStart={onDragStart}
          onDragEnter={onDragEnter}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
        >{name}</li>
      })}
    </ul>
  </>
}

export default PreviewSort;