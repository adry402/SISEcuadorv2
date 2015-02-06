/* 
 * Javascript navegacion
 * Vista del index
 * autor: @Adriana.Romero
 */

/**
 * Presenta el menu lateral de navegacion, se actualiza de manera dinámica
 */

jQuery(document).ready(function($) {
    var ipserver;
      $.ajax({
        url: "cadena.txt",
        dataType: "text",
        success: function(data) {
            ipserver = data;
            var cadena = ipserver + "/SWSISEcuador/webresources/ritema/modulos";
            $.getJSON(cadena, function(result) {
                $("nav").html("");
                var auxObjetos = " <a href='index.html'>Inicio</a>";
              
                  $.each(result, function() {
                      auxObjetos =auxObjetos
                      + "<a  href="+ this.strPantalla + "?" + this.idTema+">"+this.strNombreTema+"</a>";
           
                  });
                  
                   $("nav").append(auxObjetos);
            });
        }
    });
});