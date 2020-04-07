class User{
    constructor(socket, units){
        this.socket = socket
        this.units = units
    };
    unitAssignment(){
        this.units.forEach(el => {
            el.owner = this.socket.id;
        });
    }
}