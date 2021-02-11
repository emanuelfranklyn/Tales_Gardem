class commandCategory {
    constructor(data) {
        if (!data || (data && !data.name)) {throw new Error('Tryed to create category with no name or data provided');}
        this.name = data.name;
        this.commands = data.commands || [];
    }
}

module.exports = commandCategory;