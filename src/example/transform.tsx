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

const Transform = () => {
  const ref = useRef<HTMLUListElement|null>(null);
  const [list, setList] = useState<Item[]>(data);
  const [itemSize, setItemSize] = useState(Array.from({length: data.length}));
  
  const [isChosen, setIsChosen] = useState<boolean>(false);
  const [store, setStore] = useState<any>({
    target: null,
    index: null,
    list: []
  });
  
  useEffect(() => {
    if (ref) {
      const ul = ref.current as HTMLUListElement;
      const itemHeight = [...ul.childNodes].map((el) => (el as Element).clientHeight);
      setItemSize(itemHeight);
    }
  }, []);

  const onDragOver = (ev: DragEvent<HTMLElement>) => {
    ev.preventDefault();
    ev.stopPropagation();
  }

  const onDragStart = (ev: DragEvent<HTMLElement>) => {
    setIsChosen(true);
    const target = ev.target as HTMLElement;
    target.style.cursor = 'row-resize';
    target.style.visibility = 'hidden';
    
    ev.dataTransfer.effectAllowed = 'move';
    ev.dataTransfer.setData('text/html', target as any);

    setStore({...store, target, index: Number(target.dataset.index)});
  }

  const onDragEnter = (ev: DragEvent<HTMLElement>) => {
    if (!isChosen) return;
    const target = ev.target as HTMLElement;
    const from = Number(store.index); // 드래그 시작 위치
    const to = Number(target.dataset.index); // 드래그 종료 위치
    
    const updating = [...list];
    updating[from] = updating.splice(to, 1, updating[from])[0];
    
    setStore({...store, target, list: updating});
  }
  
  const onDragEnd = (ev: DragEvent<HTMLElement>) => {
    const target = ev.target as HTMLElement;
    target.style.cursor = 'row-resize';

    setList(store.list);
  }

  return <>
    <ul ref={ref} className='sortable-list' onDragOver={onDragOver}>
      {list.map(({id, name}, i) => {
        return <li key={`item-${i}`} 
          style={{height: itemSize[i]+'px'}}
          data-index={i}
          draggable='true'

          onDragStart={onDragStart}
          onDragEnter={onDragEnter}
          onDragEnd={onDragEnd}
        >{name}</li>
      })}
    </ul>
  </>
}

export default Transform;