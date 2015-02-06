/* 
 * Javascript sector
 * autor: @Adriana.Romero
 * 
 */

function ViewModelSector() {
    var principal = this;
    /*
     * Variables globales y de knockout.js
     * Se recupera las variables responsive
     * @tema
     */

    if (location.search.substr(1)) {
        tema = location.search.substr(1);
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
    $("#errorLabel").css("display", "none");

    /*
     *Evento ajax para listar sectores
     */
    $.ajax({
        url: "cadena.txt",
        dataType: "text",
        success: function(data) {
            ipserver = data;
            http://201.219.3.75:8080/SWSISEcuador/webresources/ritema/temas/4
            var cadena = ipserver + "/SWSISEcuador/webresources/ritema/temas/" + tema;
            $.getJSON(cadena, function(result) {
                $(".loadingPag").css("display", "none");

                $.each(result, function() {
                    principal.ejemploLista.push({
                        url: ko.observable(this.strPantalla + "?" + this.riIdTema.idTema + "&0" + "&" + this.idTema),
                        details: ko.observable(""),
                        nombreGrupo: ko.observable(this.strNombreTema)
                    });
                });
            }).error(function(jqXHR, textStatus, errorThrown) { /* assign handler */
                /* alert(jqXHR.responseText) */
//                alert("Ocurrio un error" + jqXHR.responseText);
                $(".loadingPag").css("display", "none");
                $("#errorLabel").css("display", "block");
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
            var cadena = ipserver + "/SWSISEcuador/webresources/indanalisis/buscar/" + tema;

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
                        location.href = url + "?" + id_ib + "&" + id_tema;
                    }
                });
            });
        }
    });

}

// Activamos knockout.js
ko.applyBindings(new ViewModelSector());

