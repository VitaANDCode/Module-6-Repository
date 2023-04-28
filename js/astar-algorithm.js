// Обработчик кликов
document.addEventListener('click', function(elem) 
{

	if (elem.target.id == 'crt_btn') {
		var parrent = document.querySelector('.table-map');
		var size = document.querySelector('#size_table').value;

		if (isNaN(size) || !size) {
			alert('Некорректный ввод!');
			return;
		}

		var table = document.createElement('table');
		var tableId = 1;
		table.setAttribute('id', 'astar_table');
		for (var i = 0; i < size; i++) {
			var tr = document.createElement('tr');
			for (var j = 0; j < size; j++) {
				var td = document.createElement('td');
				td.className = 'table-item';
				td.id = tableId;
				td.setAttribute('style', 'background-color: white');
				tr.appendChild(td);
				tableId++;
			}
			table.appendChild(tr);
		}
		parrent.appendChild(table);
		elem.target.setAttribute('disabled', '')
	}

	else if (elem.target.className == 'table-item' && buttonPaint == true) 
	{
		elem.target.setAttribute('style', 'background-color: purple');
	}

	else if (elem.target.className == 'table-item' && buttonStart == true) {
		elem.target.setAttribute('style', 'background-color: blue');
		counterStart++;
	}

	else if (elem.target.className == 'table-item' && buttonStop == true) {
		elem.target.setAttribute('style', 'background-color: red');
		counterStop++;
	}

	else if (elem.target.id == 'reset_btn') {
		astar_table.remove();
		buttonPaint = false, buttonStart = false, buttonStop = false;
		buttonStart = 0;
		buttonStop = 0;
		document.querySelector('#crt_btn').removeAttribute('disabled');
	}

	else if (elem.target.className == 'table-item' && buttonClearDate == true) {
		elem.target.setAttribute('style', 'background-color: white');

		if (window.getComputedStyle(elem.target).getPropertyValue("background-color") == 'rgb(255, 0, 0)') {
			counterStop--;
		}

		else if (window.getComputedStyle(elem.target).getPropertyValue("background-color") == 'rgb(0, 0, 255)') {
			counterStart--;
		}
	}
});

var buttonPaint = false;
var buttonStart = false;
var buttonStop = false;
var buttonClearDate = false;

var counterStart = 0;
var counterStop = 0;