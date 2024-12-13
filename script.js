document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:3000/items';
    const itemsTableBody = document.querySelector('#itemsTable tbody');
    const modal = document.querySelector('#modal');
    const addItemBtn = document.querySelector('#addItemBtn');
    const saveItemBtn = document.querySelector('#saveItemBtn');
    const cancelBtn = document.querySelector('#cancelBtn');

    let editMode = false;
    let currentItemId = null;

   
    const loadItems = async () => {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            const items = await response.json();
            renderItems(items);
        } catch (err) {
            console.error('Error fetching items:', err);
        }
    };

    
    const renderItems = (items) => {
        itemsTableBody.innerHTML = '';
        items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>
                    <button class="editBtn">Edit</button>
                    <button class="deleteBtn">Delete</button>
                </td>
            `;
            const editBtn = row.querySelector('.editBtn');
            const deleteBtn = row.querySelector('.deleteBtn');
            editBtn.addEventListener('click', () => editItem(item._id));
            deleteBtn.addEventListener('click', () => deleteItem(item._id));
            itemsTableBody.appendChild(row);
        });
    };


    const addOrEditItem = async () => {
        const name = document.querySelector('#name').value;
        const description = document.querySelector('#description').value;
        const quantity = document.querySelector('#quantity').value;

        const itemData = { name, description, quantity };

        try {
            let response;
            if (editMode) {
                response = await fetch(`${apiUrl}/${currentItemId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(itemData),
                });
            } else {
                response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(itemData),
                });
            }

            if (!response.ok) {
                throw new Error('Failed to save item');
            }

            const data = await response.json();
            modal.style.display = 'none';
            loadItems();
        } catch (err) {
            console.error('Error adding/editing item:', err);
        }
    };

    
    addItemBtn.addEventListener('click', () => {
        editMode = false;
        modal.style.display = 'block';
        document.querySelector('#name').value = '';
        document.querySelector('#description').value = '';
        document.querySelector('#quantity').value = '';
    });

 
    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    
    const deleteItem = async (id) => {
        try {
            const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Failed to delete item');
            }
            loadItems();
        } catch (err) {
            console.error('Error deleting item:', err);
        }
    };

    
    const editItem = (id) => {
        editMode = true;
        currentItemId = id;
        modal.style.display = 'block';

        
        fetch(`${apiUrl}/${id}`)
            .then((res) => res.json())
            .then((item) => {
                document.querySelector('#name').value = item.name;
                document.querySelector('#description').value = item.description;
                document.querySelector('#quantity').value = item.quantity;
            })
            .catch((err) => console.error('Error fetching item:', err));
    };

   
    saveItemBtn.addEventListener('click', addOrEditItem);


    loadItems();
});
