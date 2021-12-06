import classNames from "classnames";
import React, { Children, cloneElement, createElement, CSSProperties, FC, ForwardRefExoticComponent, ReactElement, ReactHTML, RefAttributes, useEffect, useRef, useState } from "react";

interface ItemInterface {
  id: string | number;
  selected?: boolean;
  chosen?: boolean;
}

interface Store {
  dragging: null;
}

interface ReactSortableProps<T> {
  list: T[];
  setList: (newState: T[], sortable: null, store: Store) => void;
  
  tag?: ForwardRefExoticComponent<RefAttributes<any>> | keyof ReactHTML;
  clone?: (currentItem: T, evt: any) => T;

  style?: CSSProperties;
  className?: string;
  id?: string;
}

const Main: FC<{sortableProps: ReactSortableProps<ItemInterface>}> = ({sortableProps, ...props}) => {
  const store: Store = { dragging: null };
  const ref = useRef<HTMLElement>();
  const [list, setList] = useState(sortableProps.list.map(item => ({...item, chosen: false, selected: false})));
  sortableProps.setList(list, null, store);

  useEffect(() => {
    if (ref.current === null) return;
  }, []);

  const { tag, style, className, id } = sortableProps;
  const classicProps = { style, className, id };
  const newTag = !tag || tag === null ? "div" : tag;  
  
  const getChildren = () => {
    const { children } = props;
    if (!children || children === null) return null;
    const selectedClass = "selected";
    const chosenClass = "chosen";
    
    return Children.map(children as ReactElement<any>[], (child, index) => {
      const { className: prevClassName, children } = child.props;

      const item = sortableProps.list[index];
      const className = classNames(prevClassName, {
        [selectedClass]: item.selected,
        [chosenClass]: item.chosen
      });

      return cloneElement(child, {
        // ['data-id']: index,
        // darggable: 'true',
        className
      })
    })
  }
  
  return createElement(newTag, {
    ref: ref,
    ...classicProps
  }, getChildren());

}

export default Main;