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
  const [store, setStore] = useState<{target: null|HTMLElement; index: null|number; list: Item[]; moveUp: number[]; moveDown: number[]}>({
    target: null,
    index: null,
    list: [],
    moveUp: [],
    moveDown: []
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
    target.style.opacity = '0';
    
    ev.dataTransfer.effectAllowed = 'move';
    ev.dataTransfer.setData('text/html', target as any);

    setStore({...store, target, index: Number(target.dataset.index)});
  }

  const onDragEnter = (ev: DragEvent<HTMLElement>) => {
    if (!isChosen) return;
    const target = ev.target as HTMLElement;
    const from = Number(store.index); // 드래그 시작 위치
    const to = Number(target.dataset.index); // 드래그 종료 위치
    
    const moveUp = [...store.moveUp];
    const moveDown = [...store.moveDown];
    if (from < to) {
      moveUp.includes(to) ? moveUp.pop() : moveUp.push(to);
    } else if (from > to) {
      moveDown.includes(to) ? moveDown.pop() : moveDown.push(to);
    } else {
      moveUp.length = 0;
      moveDown.length = 0;
    }
    const updating = [...list];
    updating[from] = updating.splice(to, 1, updating[from])[0];
    // setList(updating);
    setStore({...store, target, list: updating, moveUp, moveDown});
  }

  const onDragEnd = (ev: DragEvent<HTMLElement>) => {
    setIsChosen(false);
    const target = ev.target as HTMLElement;
    target.style.opacity = '1';
    setList(store.list);
    setStore({
      target: null,
      index: null,
      list: [],
      moveUp: [],
      moveDown: [],
    })
  }

  return <>
    <ul ref={ref} className='sortable-list' onDragOver={onDragOver}>
      {list.map(({id, name}, i) => {
        const upping = store.moveUp.includes(i);
        const downing = store.moveDown.includes(i);
        let transform = '';
        if (upping) transform = `translateY(-${itemSize[i]}px)`;
        else if (downing) transform = `translateY(${itemSize[i]}px)`;
        else transform = `translateY(0)`;

        return <li key={`item-${i}`} 
          style={{height: itemSize[i]+'px', transform}}
          data-index={i}
          draggable='true'

          onDragStart={onDragStart}
          onDragEnter={onDragEnter}
          onDragEnd={onDragEnd}
        >{name}</li>
      })}
    </ul>
    <br />
    <div style={{fontSize: 13}}>Move Up Index: {store.moveUp.join()}</div>
    <div style={{fontSize: 13}}>Move Down Index: {store.moveDown.join()}</div>
  </>
}

export default Transform;