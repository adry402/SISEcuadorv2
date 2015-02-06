/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
//function ViewModelGrafica() {

var mapa;
var lat = null;
var lng = null;
var cadena = "";
var estiloProvincia;
var provPA;
var cantPA;
function init() {
    mapa = new OpenLayers.Map("miMapa");

//    var osm = new OpenLayers.Layer.OSM();
//    mapa.addLayer(osm);

    var layerBase = new OpenLayers.Layer.WMS(
            "OpenLayers WMS",
            "http://201.219.3.196:8079/geoserver/wms?service=WMS",
            {
                layers: "siise:cant_00"
            }
    );
    mapa.addLayer(layerBase);

    $("#miMapa").css("display", "none");
    $("#labelUbicacion").css("display", "none");

    function ViewModelSector() {

        if (location.search.substr(1)) {
            Variable = location.search.substr(1);
            var elem = Variable.split('&');
            provincia = elem[0];
            canton = elem[1];
        }

        $(".loadingPag").css("display", "block");
        $(".infoTerritorial").css("display", "none");
        $('#parroquiaCombo').attr("disabled", true);
        $('#provinciaCombo').attr("disabled", true);
        $('#cantonCombo').attr("disabled", true);

        $('input[type="submit"]').attr('disabled', 'disabled');

        var self = this;
        self.fichaList = ko.observableArray();
        self.regiones = ko.observableArray();
        self.provincias = ko.observableArray();
        self.cantones = ko.observableArray();
        self.parroquias = ko.observableArray();

        self.regionSeleccionada = ko.observable();
        self.provinciaSeleccionada = ko.observable();
        self.cantonSeleccionado = ko.observable();
        self.parrSeleccionada = ko.observable();


        self.parr = ko.observableArray();

        var ipserver;

        //variables para consulta de busqueda
        var auxProvincia;
        var auxCanton;
        var auxParroquia;
        var banderaParroquia;



        $.ajax({
            url: "cadena.txt",
            dataType: "text",
            success: function(data) {
                ipserver = data;
                var cadena = ipserver + "/ServicioWeb/webresources/indregion/";

                $.getJSON(cadena, function(result) {
                    $.each(result, function() {
                        self.regiones.push({
                            serialReg: this.serialReg,
                            nombreReg: this.nombreReg
                        });

                    });
                });

            }
        });


        self.regionSeleccionada.subscribe(function(serialRegion) {
            self.provincias([]);

            $.ajax({
                url: "cadena.txt",
                dataType: "text",
                success: function(data) {
                    ipserver = data;
                    var cadena = ipserver + "/ServicioWeb/webresources/indprovincia/" + serialRegion;

                    $.getJSON(cadena, function(result) {
                        $('#provinciaCombo').attr("disabled", false);
                        $('#cantonCombo').attr("disabled", true);
                        $('#parroquiaCombo').attr("disabled", true);
                        $('input[type="submit"]').attr('disabled', 'disabled');
                        $.each(result, function() {
                            self.provincias.push({
                                serialPrv: this.serialPrv,
                                nombrePrv: this.nombrePrv
                            });

                        });
                    });

                }
            });

        });

        self.provinciaSeleccionada.subscribe(function(serialProvincia) {
            self.cantones([]);


            $.ajax({
                url: "cadena.txt",
                dataType: "text",
                success: function(data) {
                    ipserver = data;
                    var cadena = ipserver + "/ServicioWeb/webresources/indcanton/" + serialProvincia;

                    $.getJSON(cadena, function(result) {
                        $('#provinciaCombo').attr("disabled", false);
                        $('#cantonCombo').attr("disabled", false);
                        $('#parroquiaCombo').attr("disabled", true);
                        $('input[type="submit"]').attr('disabled', 'disabled');
                        auxProvincia = result[0].serialPrv.codigotPrv;
                        $.each(result, function() {
                            self.cantones.push({
                                serialCiu: this.serialCiu,
                                nombreCiu: this.nombreCiu
                            });

                        });
                    });

                }
            });

        });

        self.cantonSeleccionado.subscribe(function(serialCanton) {
            self.parroquias([]);
            $.ajax({
                url: "cadena.txt",
                dataType: "text",
                success: function(data) {
                    ipserver = data;
                    var cadena = ipserver + "/ServicioWeb/webresources/indparroquia/" + serialCanton;

                    $.getJSON(cadena, function(result) {
                        auxCanton = result[0].codigotPar.substring(0, 4);
                        banderaParroquia = "cnsT2.html?" + auxProvincia + "&" + auxCanton;
                        $('#provinciaCombo').attr("disabled", false);
                        $('#cantonCombo').attr("disabled", false);
                        $('#parroquiaCombo').attr("disabled", false);
                        $('input[type="submit"]').removeAttr('disabled');
                        $.each(result, function() {
                            self.parroquias.push({
                                serialPar: this.serialPar,
                                nombrePar: this.nombrePar
                            });

                        });
                    });

                }
            });

        });

        self.parrSeleccionada.subscribe(function(serialParroquia) {
            $.ajax({
                url: "cadena.txt",
                dataType: "text",
                success: function(data) {
                    ipserver = data;
                    var cadena = ipserver + "/ServicioWeb/webresources/indparroquia/par/" + serialParroquia;

                    $.getJSON(cadena, function(result) {
                        auxParroquia = result.codigotPar;
                        banderaParroquia = "cnsT3.html?" + auxProvincia + "&" + auxCanton + "&" + auxParroquia;
                    });

                }
            });

        });

        self.redirigir = function() {
            location.href = banderaParroquia;
        };

        var nombre_prv;
        var nombre_ciu;
        var codigo_prv;
        var codigo_ciu;
        var codigo_par;

        $("#labelUbicacion").html('La ubicación seleccionada es: &nbsp;');
        $("#labelUbicacion").css("display", "block");
        $.ajax({
            url: "cadenaMapa.txt",
            dataType: "text",
            success: function(data) {
                ipserver = data;
                var cadena = ipserver + "/WSMapas/webresources/territorial/" + provincia + "/" + canton;

                $.getJSON(cadena, function(result) {
                    var consulta = result[0];
                    //split
                    var char = consulta[4].split("(");

                    var coordenadas = char[1].split(")");
                    var latlng = coordenadas[0].split(" ");
                    lng = latlng[0];
                    lat = latlng[1];
                    var lnglat = new OpenLayers.LonLat(lng, lat).transform(
                            new OpenLayers.Projection("EPSG:4326"),
                            mapa.getProjectionObject());
                    mapa.setCenter(lnglat, 9);


                    var markers = new OpenLayers.Layer.Markers("Marcas");
                    mapa.addLayer(markers);

                    var size = new OpenLayers.Size(21, 25);
                    var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
                    var icon = new OpenLayers.Icon('puntero.png', size, offset);


                    markers.addMarker(new OpenLayers.Marker(lnglat, icon));

                    $(".loadingPag").css("display", "none");
                    $(".infoTerritorial").css("display", "block");
                    $("#miMapa").css("display", "block");

                    $("#provincia").html(consulta[3]);
                    $("#canton").html(consulta[1]);
                    $(".provinciaTabla").html(consulta[3]);
                    $(".cantonTabla").html(consulta[1]);
                    codigo_prv = consulta[2];
                    codigo_ciu = consulta[0];
                    codigo_par = consulta[0];

                    nombre_prv = consulta[3];
                    nombre_ciu = consulta[1];
                    //                Consulta de altura y superficie


                    $.ajax({
                        url: "cadena.txt",
                        dataType: "text",
                        success: function(data) {
                            ipserver = data;
                            var cadena = ipserver + "/ServicioWeb/webresources/territorial/consultaDPA/" + codigo_prv + "/" + codigo_ciu;

                            $.getJSON(cadena, function(result) {

                                var provincia = result[0];
                                var canton = result[1];
                                $("#per_Prv").html(format(provincia.per));
                                $("#per_Ciu").html(format(canton.per));
                                $("#pobU_Prv").html(format(provincia.perUrbana));
                                $("#pobU_Ciu").html(format(canton.perUrbana));
                                $("#pobR_Prv").html(format(provincia.perRural));
                                $("#pobR_Ciu").html(format(canton.perRural));

                                $("#super_Prv").html(format((provincia.superficie).toFixed(1)));
                                $("#super_Ciu").html(format((canton.superficie).toFixed(1)));
                                $("#alt_Prv").html(format((provincia.alturaMedia).toFixed(1)));
                                $("#alt_Ciu").html(format((canton.alturaMedia).toFixed(1)));
                                $("#den_Prv").html(format((provincia.densidadPoblacional).toFixed(1)));
                                $("#den_Ciu").html(format((canton.densidadPoblacional).toFixed(1)));
                                $("#prv_per02").html(format(provincia.per02));
                                $("#ciu_per02").html(format(canton.per02));
                                $("#prv_per35").html(format(provincia.per35));
                                $("#ciu_per35").html(format(canton.per35));
                                $("#prv_per617").html(format(provincia.per617));
                                $("#ciu_per617").html(format(canton.per617));
                                $("#prv_per1829").html(format(provincia.per1829));
                                $("#ciu_per1829").html(format(canton.per1829));
                                $("#prv_per3064").html(format(provincia.per3064));
                                $("#ciu_per3064").html(format(canton.per3064));
                                $("#prv_per65").html(format(provincia.per65));
                                $("#ciu_per65").html(format(canton.per65));
                                $("#prv_perpobreza").html(format(provincia.perPobreza));
                                $("#prvpor_perpobreza").html(parseFloat((provincia.perPobreza * 100 / provincia.totalPobreza).toFixed(1)) + '%');
                                $("#ciu_perpobreza").html(format(canton.perPobreza));
                                $("#ciupor_perpobreza").html(parseFloat((canton.perPobreza * 100 / canton.totalPobreza).toFixed(1)) + '%');
                                $("#prv_analfa15").html(format(provincia.analfa15));
                                $("#prvpor_analfa15").html(parseFloat((provincia.analfa15 * 100 / provincia.perAnalfa15).toFixed(1)) + '%');
                                $("#ciu_analfa15").html(format(canton.analfa15));
                                $("#ciupor_analfa15").html(parseFloat((canton.analfa15 * 100 / canton.perAnalfa15).toFixed(1)) + '%');
                                $("#prv_escola24").html(parseFloat((provincia.escola24 / provincia.perEscola24).toFixed(1)));
                                $("#ciu_escola24").html(parseFloat((canton.escola24 / canton.perEscola24).toFixed(1)));
                                $("#prv_hacinaHogares").html(format(provincia.hacinaHogares));
                                $("#prvpor_hacinaHogares").html(parseFloat((provincia.hacinaHogares * 100 / provincia.hogaresTotal).toFixed(1)) + '%');
                                $("#ciu_hacinaHogares").html(format(canton.hacinaHogares));
                                $("#ciupor_hacinaHogares").html(parseFloat((canton.hacinaHogares * 100 / canton.hogaresTotal).toFixed(1)) + '%');
                                $("#centro_salud").html(canton.centro_salud);
                                $("#hos_general").html(canton.hospital_general);
                                $("#canchas").html(canton.canchas_descubierta + canton.canchas_cubierta);
                                $("#coliseo").html(canton.coliseo);
                                $("#fiscal").html(canton.educacion_publico);
                                $("#particular").html(canton.educacion_privada);
                                $("#uvc").html(canton.uvcs);
                                $("#upc").html(canton.upcs);
                                $.ajax({
                                    url: "cadena.txt",
                                    dataType: "text",
                                    success: function(data) {
                                        ipserver = data;
                                        var cadena = ipserver + "/ServicioWeb/webresources/territorial/" + codigo_prv + "/" + codigo_ciu + "/" + canton.per;
                                        $.getJSON(cadena, function(result) {

                                            $.each(result, function() {
                                                self.parr.push({
                                                    nombreParr: this.nombreParroquia,
                                                    valorParr: format(this.perPorParroquia)
                                                });
                                            });
                                        });
                                    }
                                });

                                $.ajax({
                                    url: "cadena.txt",
                                    dataType: "text",
                                    success: function(data) {
                                        ipserver = data;
                                        var cadena = ipserver + "/ServicioWeb/webresources/territorial/distrito/" + codigo_prv;
                                        $.getJSON(cadena, function(result) {
                                            var auxObjetos = "<li>"
                                                    + "<table><thead><tr><th>Distrito</th><th>Cantón</th><th>Personas</th></tr></thead>"
                                                    + "<tbody>";
                                            var auxTabla = " ";
                                            $.each(result, function() {
                                                var codDistrito = this.codigotDistrito;

                                                var lista = this.datosCanton;
                                                var colrow = lista.length;
                                                var cont = 0;
                                                $.each(lista, function() {
                                                    cont = cont + 1;
                                                    if (cont === 1) {

                                                        auxTabla = auxTabla
                                                                + "<tr><td rowspan=" + colrow + " style='text-align: center; vertical-align:middle;  width: 27%;'>" + codDistrito + "</td>"
                                                                + "<td style='text-align: left; width: 40%;'>" + this.nombreCanton + "</td>"
                                                                + "<td style='text-align: right; width: 33%;'>" + format(this.personas) + "</td></tr>";
                                                    } else {

                                                        auxTabla = auxTabla

                                                                + "<td style='text-align: left; width: 40%;'>" + this.nombreCanton + "</td>"
                                                                + "<td style='text-align: right; width: 33%;'>" + format(this.personas) + "</td></tr>";
                                                    }

                                                });

                                            });
                                            var final = "</tbody></table></li>";
                                            var queryTotal = auxObjetos + auxTabla + final;

                                            $("#listviewSistema").append(queryTotal);


                                        });
                                    }
                                });



                                function format(numero, decimales, separador_decimal, separador_miles) { // v2007-08-06
                                    numero = parseFloat(numero);
                                    if (isNaN(numero)) {
                                        return "";
                                    }

                                    if (decimales !== undefined) {
                                        // Redondeamos
                                        numero = numero.toFixed(decimales);
                                    }

                                    // Convertimos el punto en separador_decimal
                                    numero = numero.toString().replace(",", separador_decimal !== undefined ? separador_decimal : ".");
                                    separador_miles = ",";
                                    if (separador_miles) {
                                        // Añadimos los separadores de miles
                                        var miles = new RegExp("(-?[0-9]+)([0-9]{3})");
                                        while (miles.test(numero)) {
                                            numero = numero.replace(miles, "$1" + separador_miles + "$2");
                                        }
                                    }

                                    return numero;
                                }

                                $('#container1').highcharts({
                                    chart: {
                                        type: 'column',
                                        style: {
                                            fontFamily: 'Helvetica' // default font

                                        }
                                    },
                                    title: {
                                        text: 'Tipologia de viviendas totales'
                                    },
                                    subtitle: {
                                        text: 'Fuente: Censo de Población y Vivienda - INEC \n Año: 2010'
                                    },
                                    credits: {
                                        enabled: false
                                    },
                                    xAxis: {
                                        categories: [nombre_prv, nombre_ciu]

                                    },
                                    yAxis: {
                                        min: 0,
                                        title: {
                                            text: 'Porcentaje'
                                        }
                                    },
                                    plotOptions: {
                                        column: {
                                            stacking: 'normal',
                                            dataLabels: {
                                                enabled: true,
                                                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                                                style: {
                                                    textShadow: '0 0 3px black, 0 0 3px black'
                                                }
                                            }
                                        }
                                    },
                                    series: [{
                                            name: '% viviendas aceptables',
                                            data: [parseFloat((provincia.vivAceptable * 100 / provincia.viviendas).toFixed(1)), parseFloat((canton.vivAceptable * 100 / canton.viviendas).toFixed(1))]
                                        }, {
                                            name: '% viviendas recuperables',
                                            data: [parseFloat((provincia.vivRecuperable * 100 / provincia.viviendas).toFixed(1)), parseFloat((canton.vivRecuperable * 100 / canton.viviendas).toFixed(1))]
                                        },
                                        {
                                            name: '% viviendas irrecuperables',
                                            data: [parseFloat((provincia.vivIrrecuperable * 100 / provincia.viviendas).toFixed(1)), parseFloat((canton.vivIrrecuperable * 100 / canton.viviendas).toFixed(1))]
                                        }]
                                });



                                $('#container').highcharts({
                                    chart: {
                                        type: 'column'
                                    },
                                    title: {
                                        text: 'Población urbano/rural'
                                    },
                                    subtitle: {
                                        text: 'Fuente: Censo de Población y Vivienda - INEC \n Año: 2010'
                                    },
                                    credits: {
                                        enabled: false
                                    },
                                    xAxis: {
                                        categories: [nombre_prv, nombre_ciu]

                                    },
                                    yAxis: {
                                        min: 0,
                                        title: {
                                            text: 'Porcentaje'
                                        }
                                    },
                                    plotOptions: {
                                        column: {
                                            stacking: 'normal',
                                            dataLabels: {
                                                enabled: true,
                                                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                                                style: {
                                                    textShadow: '0 0 3px black, 0 0 3px black'
                                                }
                                            }
                                        }
                                    },
                                    series: [{
                                            name: '% población urbana',
                                            data: [parseFloat((provincia.perUrbana * 100 / provincia.per).toFixed(1)), parseFloat((canton.perUrbana * 100 / canton.per).toFixed(1))]
                                        }, {
                                            name: '% población rural',
                                            data: [parseFloat((provincia.perRural * 100 / provincia.per).toFixed(1)), parseFloat((canton.perRural * 100 / canton.per).toFixed(1))]
                                        }]
                                });


                            });
                        }
                    });
                });
            }
        });



    }
// Activamos knockout.js
    ko.applyBindings(new ViewModelSector());
}


