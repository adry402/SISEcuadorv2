/* 
 * Javascript indicadores
 * autor: @Adriana.Romero
 * 
 */

function ViewModelIndicador() {
    var principal = this;

    /*
     * Variables globales y de knockout.js
     * Se recupera las variables responsive
     * @id_tema Serial del tema (Indicadores sociales, Indicadores Relevantes)
     * id_ib Serial del indicador basico
     * @id_subtema Serial del subtema (Educación, Salud, etc)
     */

    if (location.search.substr(1)) {
        Variable = location.search.substr(1);
        var elem = Variable.split('&');
        id_tema = elem[0];
        id_ib = elem[1];
        id_subtema = elem[2];
    }
    /*
     * Variables globales y de knockout.js
     */
    var ipserver;
    principal.ejemploLista = ko.observableArray();
    principal.firstName = ko.observable("");
    /*
     * Visibilidad de los elementos html
     */
    $(".loadingPag").css("display", "block");

    /*
     *Evento ajax para listar los sectores
     */
    $.ajax({
        url: "cadena.txt",
        dataType: "text",
        success: function(data) {
            ipserver = data;
   //http://201.219.3.75:8080/SWSISEcuador/webresources/indanalisis/indicador/1/24
            var cadena = ipserver + "/SWSISEcuador/webresources/indanalisis/indicador/" + id_tema + "/" + id_subtema;

            $.getJSON(cadena, function(result) {
                $(".loadingPag").css("display", "none");
                $(".mapaSitio").html(result[0].str_nombre_tema);
                $.each(result, function() {
                    principal.ejemploLista.push({
                        url: ko.observable(this.str_pantalla +"?"+ this.ri_id_tema + "&" +this.id_ib+"&"+this.id_tema),
                        details: ko.observable(""),
                        nombreIndicador: ko.observable(this.str_nombre_ia)
                    });
                });
            });
        }
    });

    /*
     * Variables para buscador
     */
    principal.firstName = ko.observable("");
    var firstNames = ko.observableArray();
    function indOj() {
        this.label = "";
        this.id_ib = "";
        this.id_tema = "";

    }


    $("#firstName").css("display", "none");

    $.ajax({
        url: "cadena.txt",
        dataType: "text",
        success: function(data) {
            ipserver = data;
//            http://201.219.3.75:8080/SWSISEcuador/webresources/indanalisis/buscar/4
            var cadena = ipserver + "/SWSISEcuador/webresources/indanalisis/buscar/" + id_tema;

            $.getJSON(cadena, function(result) {
  var url = result[0].str_pantalla;
                $("#firstName").css("display", "block");


                $.each(result, function() {
                    var obj = new indOj();
                    obj.label = this.str_nombre_ia;
                    obj.id_ib = this.id_ib;
                    obj.id_tema = this.id_tema;

                    firstNames.push(obj);

                });

                //First names es la lista donde se llenan las palabras que coinciden en la busqueda


                $('#firstName').autocomplete({
                    source: firstNames(),
                    messages: {
                        noResults: '',
                        results: function() {
                        }
                    },
                    focus: function() {
                        return true;
                    },
                    select: function(event, ui) {
                        var id_ib = ui.item.id_ib;
                        var id_tema = ui.item.id_tema;
                      location.href = url+"?" + id_ib + "&" + id_tema ;
                    }
                });
            });
        }
    });
}
//
ko.applyBindings(new ViewModelIndicador());
