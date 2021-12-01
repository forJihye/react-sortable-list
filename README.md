# React DnD sortable list
리액트 드래그 앤 드롭 정렬 리스트

-----

## HTML drag and drop API

* ondragover: 요소가 드래그 대상 위를 지나갈 경우 발생 (밀리초 단위로 발생)
* ondragstart: 요소를 드래그 할 경우 발생
* ondragend: 드래그가 끝날 경우 발생
* ondragenter: 요소가 다른 드래그 요소 위에 있을 경우 발생
* ondragleave: 요소가 다른 드래그 요소 위에 있다가 이탈한 경우 발생
* ondrop: 요소를 드롭할 경우 발생 (ondragover 에서 preventDefault가 발생해야 함)

드래그 앤 드롭을 할 요소에 **draggable**을 추가하고 드래그 요소를 클릭이동 시 grab한 효과가 추가.
