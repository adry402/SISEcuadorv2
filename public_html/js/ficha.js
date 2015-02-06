/* 
 * Javascript ficha
 * autor: @Adriana.Romero
 * Presenta la ficha metodologica
 */

function ViewModelFicha() {
    if (location.search.substr(1)) {
        dirFicha = location.search.substr(1);
    }



    $('#ficha').load(dirFicha);

}
// Activamos knockout.js
ko.applyBindings(new ViewModelFicha());
