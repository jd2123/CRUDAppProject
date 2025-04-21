const itemOperations = {
    items: [],

    add(item)
    {
        this.items.push(item);
    },

    removeMarked()
    {
        this.items = this.items.filter(item => !item.marked);
    },

    markUnmark(id)
    {
        let item = this.items.find(item => item.id == id);
        if (item)
        {
            item.marked = !item.marked;
        }
    },

    searchById(id)
    {
        return this.items.find(item => item.id == id);
    },

    updateItem(updatedItem)
    {
        let index = this.items.findIndex(item => item.id == updatedItem.id);
        if (index !== -1)
        {
            this.items[index] = updatedItem;
        }
    },

    sortByPrice()
    {
        return [...this.items].sort((a, b) => a.price - b.price);
    }
};
