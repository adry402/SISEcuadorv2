/* 
 * Javascript index
 * Vista del index
 * autor: @Adriana.Romero
 */

/**
 * Funcion ViewModelIndex
 * Crea la lista de módulos del index
 * @returns {all}
 */

function ViewModelIndex() {
    var principal = this;
    var ipserver;
    principal.listaIndex = ko.observableArray();

    $(".loadingPag").css("display", "block");
    $("#errorLabel").css("display", "none");
    $("#principal").css('background', 'url(css/images/logo-MCDS.png) no-repeat');
    $("#principal").css('width', '164px');
    $("#principal").css('height', '47px');
    $("#pieLogo").css('background', 'url(css/images/SIISE-20x23.png)');
    $("#pieLogo").css('width', '20px');
    $("#pieLogo").css('height', '23px');

    $.ajax({
        url: "cadena.txt",
        dataType: "text",
        success: function(data) {
            ipserver = data;
            var cadena = ipserver + "/SWSISEcuador/webresources/ritema/modulos";
            $.getJSON(cadena, function(result) {
                $(".loadingPag").css("display", "none");
                $.each(result, function() {
                    principal.listaIndex.push({
                        url: ko.observable(this.strPantalla + "?" + this.idTema),
                        details: ko.observable(""),
                        nombreModulo: ko.observable(this.strNombreTema),
                        icon: ko.observable(this.strUrlIcono)
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
}// Activamos knockout.js
ko.applyBindings(new ViewModelIndex());





