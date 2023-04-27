// Обработчик кликов
document.addEventListener('click', function(elem) 
{
	if (elem.target.id == 'crt_btn')
	{
		var parrent = document.querySelector('.table-map');
		var size = document.getElementById("size_table").value;

		var table_matrix = [];

		for (let i = 0; i < size; i++)
		{
			table_matrix[i] = [];
			for (let j = 0; j < size; j++)
			{
				table_matrix[i,j] = 'P';	// пустота
			}
		}

		console.log(table_matrix);

		var table = document.createElement('table');
		table.setAttribute('id', 'astar_table');
		for (let i = 0; i < size; i++)
		{
			var tr = document.createElement('tr');
			for (let j = 0; j < size; j++) {
				var td = document.createElement('td');
				td.setAttribute("id", i*size+j);
				td.className = 'table-item';
				tr.appendChild(td);
			}
			table.appendChild(tr);
		}
		parrent.appendChild(table);
	}

	/*if (elem.target.className == 'table-item' && buttonPaint == true) 
	{
		elem.target.setAttribute('style', 'background-color: purple');
		console.log(elem.target.id, size, elem.target.id/size);
		console.log(Math.floor(elem.target.id/size), elem.target.id % size);
		table_matrix[Math.floor(elem.target.id/size), elem.target.id % size] = "S";	// стена
	}

	if (elem.target.className == 'table-item' && buttonStart == true)
	{
		elem.target.setAttribute('style', 'background-color: blue');
		table_matrix[Math.floor(elem.target.id/size), elem.target.id % size] = "N";	// начало
		var start_id = elem.target.id;
	}

	if (elem.target.className == 'table-item' && buttonStop == true)
	{
		elem.target.setAttribute('style', 'background-color: red');
		table_matrix[Math.floor(elem.target.id/size), elem.target.id % size] = "K";	// конец
		var finish_id = elem.target.id;
	}*/

	/*if (elem.target.id = 'crt_route')
	{
		var route_matrix = [];
		for (let i = 0; i < size; i++)
			route_matrix[i] = [];
		
		var openList = [];
		var closedList = [];

		openList.push(start_id);
		var current_id = start_id;

		while (openList.length != 0 || current_id != finish_id)
		{
			if ((size > Math.floor(current_id/size) - 1 >= 0) && table_matrix[Math.floor(current_id/size) - 1,current_id % size] != "S")
			{
				openList.push(current_id - size);
			}
			if ((size > Math.floor(current_id/size) + 1 >= 0) && table_matrix[Math.floor(current_id/size) + 1,current_id % size] != "S")
			{
				openList.push(current_id + size);
			}
			if ((size > current_id % size - 1 >= 0) && table_matrix[Math.floor(current_id/size),current_id % size - 1] != "S")
			{
				openList.push(current_id - 1);
			}
			if ((size > current_id % size + 1 >= 0) && table_matrix[Math.floor(current_id/size),current_id % size + 1] != "S")
			{
				openList.push(current_id + 1);
			}

			if ((size > Math.floor(current_id/size) - 1 >= 0) && (size > current_id % size - 1 >= 0) && table_matrix[Math.floor(current_id/size) - 1,current_id % size - 1] != "S")
			{
				openList.push(current_id - size - 1);
			}
			if ((size > Math.floor(current_id/size) - 1 >= 0) && (size > current_id % size + 1 >= 0) && table_matrix[Math.floor(current_id/size) - 1,current_id % size + 1] != "S")
			{
				openList.push(current_id - size + 1);
			}
			if ((size > Math.floor(current_id/size) + 1 >= 0) && (size > current_id % size - 1 >= 0) && table_matrix[Math.floor(current_id/size) + 1,current_id % size - 1] != "S")
			{
				openList.push(current_id + size - 1);
			}
			if ((size > Math.floor(current_id/size) + 1 >= 0) && (size > current_id % size + 1 >= 0) && table_matrix[Math.floor(current_id/size) + 1,current_id % size + 1] != "S")
			{
				openList.push(current_id + size + 1);
			}

			closedList.push(current_id);
			openList = openList.filter(function(f){return f != current_id});


		}
	}*/

	if (elem.target.id == 'reset_btn')
	{
		astar_table.remove();
		buttonPaint = false, buttonStart = false, buttonStop = false;
	}
});

var buttonPaint = false;
var buttonStart = false;
var buttonStop = false;