let allTasks = [];
let valueInput = '';
let input = null;

window.onload = init = async () => {
  input = document.getElementById('add-task');
  input.addEventListener('change', updateValue);
  const resp = await fetch('http://localhost:8000/allTasks', {
    method: 'GET' 
  });
  const result = await resp.json();
  allTasks = result.data;
  render();
};

const onClickButton = async () => {
  allTasks.push({
    text: valueInput,
    isCheck: false
  });
  const resp = await fetch('http://localhost:8000/createTask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify ({
      text: valueInput,
      isCheck: false
    }),
  });
  valueInput = '';
  input.value='';
  render();
};

const updateValue = (event) => {
  valueInput = event.target.value;
};

const render = () => {
  const content = document.getElementById('content-page');
  while(content.firstChild){
    content.removeChild(content.firstChild);   
  };
  allTasks.sort((a, b) => a.isCheck - b.isCheck)
  .map((item, index) => {
    const container = document.createElement('div');
    container.id = `task-${index}`;
    container.className = 'task-container';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked =  item.isCheck;
    checkbox.onchange = () => onChangeCheckbox(index);
    container.appendChild(checkbox);
    const text = document.createElement('p');
    text.innerText = item.text;
    text.className = item.isCheck ? "text-task done-text" : "text-task";
    container.appendChild(text);
    const conta = document.createElement('div');
    conta.id = 'task-4{index}';
    conta.className = 'task-conta';
    const imageEdit = document.createElement('img');
    imageEdit.src = 'img/edit.png';
    container.appendChild(imageEdit);
    imageEdit.className = 'edit';
    const inpSav = document.createElement('input');
    const imageSave = document.createElement('img');
    imageSave.src = 'img/done.png';
    imageEdit.onclick = () => {
      container.replaceChild(inpSav, text);
      container.appendChild(imageSave);
      container.replaceChild(imageSave, imageEdit);
      inpSav.value = item.text;
      imageDelit.onclick = () => {
        render();
      }
    }
    imageSave.onclick = async () => {
      container.replaceChild(text, inpSav);
      text.innerText = inpSav.value;
      container.replaceChild(imageEdit, imageSave);
      const _id = allTasks[index]._id;
      const resp = await fetch(`http://localhost:8000/updateTask`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify ({
          _id,
          text : inpSav.value
        })
      });
      let result = await resp.json();
      allTasks = result.data;
      item.text = inpSav.value;
    };
    const imageDelit = document.createElement('img');
    imageDelit.src = 'img/delete.png';
    container.appendChild(imageDelit);
    imageDelit.className = 'delete';
    imageDelit.onclick = async (_id) => {
      content.removeChild(container)
      allTasks.splice(index, 0)
      const resp = await fetch(`http://localhost:8000/deleteTask?_id=${allTasks[index]._id}`, {
        method: 'DELETE', 
      });
      let result = await resp.json();
      allTasks = result.data;
      render();
    };
    content.appendChild(container); 
  });
};
onChangeCheckbox = (index) => {
  allTasks[index].isCheck = !allTasks[index].isCheck;
  render();
};
