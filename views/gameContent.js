function Start() {
    
}
function Update() {
    
}
function onFlowerTrigger(_id) {
    if (Input.smile>.5) {
        Spirit.statue["flower"+_id] = "smile-pic";
    }
}