import { DragEventHandler, useState } from "react";

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

const App = () => {
  const [list, setList] = useState<Item[]>(data);
  const [grabData, setGrabData] = useState<any>({
    target: null,
    index: -1,
    moveUp: [],
    moveDown: [],
    updatedList: [],
  });

  const handlerDragOver: DragEventHandler<HTMLElement> = (ev) => {
    ev.stopPropagation();
    ev.preventDefault();
  }

  const handlerDragStart: DragEventHandler<HTMLElement> = (ev) => {
    const target = ev.target as HTMLElement;
    setGrabData({
      ...grabData,
      target,
      index: Number(target.dataset.index),
      updatedList: [...list]
    });
    target.classList.add('grabbing');
    ev.dataTransfer.effectAllowed = 'move';
    ev.dataTransfer.setData('text/html', target as any);
  }

  const handlerEnter: DragEventHandler<HTMLElement> = (ev) => {
    const target = ev.target as HTMLElement;
    const index = Number(grabData.index);
    const from = Number(grabData.target.dataset.index);
    const to = Number(target.dataset.index);

    let moveUp = [...grabData.moveUp];
    let moveDown = [...grabData.moveDown];
    let list = [...grabData.updatedList];
    list[index] = list.splice(to, 1, list[index])[0];

    if (from > to) {
      moveDown.includes(to) ? moveDown.pop() : moveDown.push(to)
    } else if (from < to) {
      moveUp.includes(to) ? moveUp.pop() : moveUp.push(to);
    } else {
      moveUp = [];
      moveDown = [];
    }

    setGrabData({
      ...grabData,
      index: to,
      moveUp,
      moveDown,
      updatedList: list
    });
  }

  const handlerDragEnd: DragEventHandler<HTMLElement> = (ev) => {
    const target = ev.target as HTMLElement;
    target.classList.remove('grabbing');
    ev.dataTransfer.dropEffect = 'move';

    setList([...grabData.updatedList]);
    setGrabData({
      ...grabData,
      moveUp: [],
      moveDown: [],
      updatedList: []
    });
    grabData.target.style.transform = 'none';
    target.style.visibility = 'visible';
    ev.dataTransfer.dropEffect = 'move';
  }

  const handlerLeave: DragEventHandler<HTMLElement> = (ev) => {
    const target = ev.target as HTMLElement
    if (target === grabData.target) target.style.visibility = 'hidden'
  }

  return <div id="app">
    <h2>React DnD sortable list</h2>
    <ul className='sortable-list' onDragOver={handlerDragOver}>
      {list.map(({id, name}, i) => {
        let className = ''
        const up = grabData.moveUp.includes(i);
        const down = grabData.moveDown.includes(i);
        up && (className = 'up')
        down && (className = 'down')
        return <li key={`item-${i}`}
          data-index={i}
          draggable='true'
          
          onDragStart={handlerDragStart}
          onDragEnter={handlerEnter}
          onDragLeave={handlerLeave}
          onDragEnd={handlerDragEnd}
          
          className={className}
        >{name}</li>
      })}
    </ul>
    <div style={{textAlign: 'center', marginTop: 20}}>
      <div>MoveUp : { grabData.moveUp }</div>
      <div>MoveDown : { grabData.moveDown }</div>
    </div>
  </div>
}

export default App;