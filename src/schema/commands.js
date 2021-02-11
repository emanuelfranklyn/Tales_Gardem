class commands {
    constructor(data) {
        if (!data.category) {throw new Error('Tryed to create a command with no category');}
        this.category = data.category;

        this.name = data.name || '';
        this.description = data.description || '';
        this.usage = data.usage || '';
        this.needArguments = data.needArguments ? data.needArguments : false;
        this.startFunction = data.startFunction || (() => {});
    }
}

module.exports = commands;