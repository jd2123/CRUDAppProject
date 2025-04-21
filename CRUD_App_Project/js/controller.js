window.addEventListener("DOMContentLoaded", init);

function init()
{
    bindEvents();
    showTotal();
    initSlider();
}

function bindEvents()
{
    document.getElementById("add").addEventListener("click", addRecord);
    document.getElementById("delete").addEventListener("click", deleteRecords);
    document.getElementById("update").addEventListener("click", updateRecord);
    document.getElementById("sort").addEventListener("click", sortRecords);
    document.getElementById("save").addEventListener("click", saveRecords);
    document.getElementById("load").addEventListener("click", loadRecords);
}

function getItemFromInputs()
{
    const id = document.getElementById("id").value;
    const name = document.getElementById("name").value;
    const price = parseFloat(document.getElementById("price").value);
    const desc = document.getElementById("desc").value;
    const color = document.getElementById("color").value;
    const url = document.getElementById("url").value;
    return new Item(id, name, price, desc, color, url);
}

function clearTable()
{
    document.getElementById("itemTableBody").innerHTML = "";
}

function printTable(items)
{
    clearTable();
    const tbody = document.getElementById("itemTableBody");
    items.forEach(item => {
        const row = tbody.insertRow();
        let index = 0;
        for (let key in item)
        {
            if (key !== 'marked')
            {
                const cell = row.insertCell(index++);
                cell.innerText = item[key];
            }
        }

        const actionCell = row.insertCell(index);
        const trashIcon = createIcon("fa-trash", "danger", item.id, deleteSingleRecord);
        const editIcon = createIcon("fa-edit", "primary", item.id, editRecord);
        actionCell.appendChild(trashIcon);
        actionCell.appendChild(editIcon);

        if (item.marked)
        {
            row.classList.add("table-danger");
        }

        row.addEventListener("click", () => {
            itemOperations.markUnmark(item.id);
            printTable(itemOperations.items);
        });
    });
}

function createIcon(iconClass, color, id, fn)
{
    const i = document.createElement("i");
    i.className = `fas ${iconClass} text-${color} mx-2`;
    i.setAttribute("data-id", id);
    i.addEventListener("click", (event) => {
        event.stopPropagation();
        fn(event);
    });
    return i;
}

function addRecord()
{
    const item = getItemFromInputs();
    itemOperations.add(item);
    printTable(itemOperations.items);
    showTotal();
}

function deleteRecords()
{
    itemOperations.removeMarked();
    printTable(itemOperations.items);
    showTotal();
}

function deleteSingleRecord(event)
{
    const id = event.target.getAttribute("data-id");
    itemOperations.items = itemOperations.items.filter(item => item.id !== id);
    printTable(itemOperations.items);
    showTotal();
}

function editRecord(event)
{
    const id = event.target.getAttribute("data-id");
    const item = itemOperations.searchById(id);
    if (item)
    {
        for (let key in item)
        {
            if (document.getElementById(key))
            {
                document.getElementById(key).value = item[key];
            }
        }
    }
}

function updateRecord()
{
    const updatedItem = getItemFromInputs();
    itemOperations.updateItem(updatedItem);
    printTable(itemOperations.items);
}

function sortRecords()
{
    const sorted = itemOperations.sortByPrice();
    printTable(sorted);
}

function saveRecords()
{
    if (window.localStorage)
    {
        const json = JSON.stringify(itemOperations.items);
        localStorage.setItem("items", json);
        alert("Data saved successfully!");
    }
}

function loadRecords()
{
    const json = localStorage.getItem("items");
    if (json)
    {
        const arr = JSON.parse(json);
        itemOperations.items = arr.map(obj => new Item(obj.id, obj.name, obj.price, obj.desc, obj.color, obj.url));
        printTable(itemOperations.items);
    }
}

function showTotal()
{
    console.log("Total Items: ", itemOperations.items.length);
}

function initSlider()
{
    const slider = document.getElementById('priceSlider');
    const minText = document.getElementById('priceMin');
    const maxText = document.getElementById('priceMax');

    noUiSlider.create(slider, {
        start: [0, 1000],
        connect: true,
        range: {
            'min': 0,
            'max': 1000
        },
        step: 1,
        tooltips: true,
        format: {
            to: value => Math.round(value),
            from: value => parseInt(value)
        }
    });

    slider.noUiSlider.on('update', function (values) {
        const min = parseInt(values[0]);
        const max = parseInt(values[1]);
        minText.innerText = min;
        maxText.innerText = max;

        const filtered = itemOperations.items.filter(item =>
            item.price >= min && item.price <= max
        );

        printTable(filtered);
    });
}

