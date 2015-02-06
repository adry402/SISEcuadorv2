/* 
 * ADRIANA ROMERO
 */

function ViewModelRegion() {
    var codigoRegion;

    if (location.search.substr(1)) {
        Variable = location.search.substr(1);
        codigoRegion = Variable;
    }

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
                    banderaParroquia = "cnsTRegion.html?" + serialRegion;
                    $('#provinciaCombo').attr("disabled", false);
                    $('#cantonCombo').attr("disabled", true);
                    $('#parroquiaCombo').attr("disabled", true);
                    $('input[type="submit"]').removeAttr('disabled');
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
                    $('input[type="submit"]').removeAttr('disabled');
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
                    banderaParroquia = "cnsT2.html?" + auxProvincia + "&" + auxCanton + "&" + 0;
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

    var w = $(window).width();
    if (w > 640) {

        $('#estilo_ind_region').remove();
        $('#estilo_ind_generalRegion').remove();
    }
    else {
        $('head').append('<style id="estilo_ind_region">'
                + '#inf_poblacionRegion  td:nth-of-type(1):after { content: " 2,576,287"; left:31%;}'
                + '#inf_poblacionRegion td:nth-of-type(2):before { content: "Urbano"; }'
                + '#inf_poblacionRegion td:nth-of-type(3):before { content: " Rural"; }'
                + '</style>');

        $('head').append('<style id="estilo_ind_generalRegion">'
                + '#ind_generalRegion td:nth-of-type(3):before { content: " %"; }'
                + '</style>');

    }
    $(window).resize(function() {
        var w = $(window).width();
        if (w > 640) {

            $('#estilo_ind_region').remove();
        }
        else {
            $('head').append('<style id="estilo_ind_region">'
                    + '#inf_poblacionRegion   td:nth-of-type(1):after { content: "2,576,287"; margin-left:10%;}'
                    + '#inf_poblacionRegion td:nth-of-type(2):before { content: "Urbano"; }'
                    + '#inf_poblacionRegion td:nth-of-type(3):before { content: " Rural"; }'

                    + '</style>');

        }
    });

    var chart,
            categories = ['0-4', '5-9', '10-14', '15-19',
        '20-24', '25-29', '30-34', '35-39', '40-44',
        '45-49', '50-54', '55-59', '60-64', '65-69',
        '70-74', '75-79', '80-84', '85-89', '90-94',
        '95-99', '100 +'];

    $('#edades').highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Población de la region Sierra'
        },
        subtitle: {
            text: 'Fuente: Censo'
        },
        xAxis: [{
                categories: categories,
                reversed: false,
                labels: {
                    step: 1
                }
            }, {// mirror axis on right side
                opposite: true,
                reversed: false,
                categories: categories,
                linkedTo: 0,
                labels: {
                    step: 1
                }
            }],
        yAxis: {
            title: {
                text: null
            },
            labels: {
                formatter: function() {
                    return (Math.abs(this.value) / 1000000) + 'M';
                }
            },
            min: -4000000,
            max: 4000000
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        tooltip: {
            formatter: function() {
                return '<b>' + this.series.name + ', edad ' + this.point.category + '</b><br/>' +
                        'Población: ' + Highcharts.numberFormat(Math.abs(this.point.y), 0);
            }
        },
        series: [{
                name: 'Hombres',
                data: [-1746181, -1884428, -2089758, -2222362, -2537431, -2507081, -2443179,
                    -2664537, -3556505, -3680231, -3143062, -2721122, -2229181, -2227768,
                    -2176300, -1329968, -836804, -354784, -90569, -28367, -3878]
            }, {
                name: 'Mujeres',
                data: [1656154, 1787564, 1981671, 2108575, 2403438, 2366003, 2301402, 2519874,
                    3360596, 3493473, 3050775, 2759560, 2304444, 2426504, 2568938, 1785638,
                    1447162, 1005011, 330870, 130632, 21208]
            }]
    });


    $('#poblacion').highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Población'
        },
        subtitle: {
            text: 'Fuente: Censo'
        },
        xAxis: {
            categories: ['Pichincha', 'Azuay', 'Bolivar', 'Cañar', 'Carchi', 'Cotopaxi', 'Chimborazo', 'Imbabura', 'Loja', 'Tungurahua', 'Sto.Dom.Tsachilas'],
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Personas'
            }
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            series: {
                stacking: 'percentage'
            }
        },
        series: [{
                name: 'Urbano',
                data: [1764867, 380445, 51792, 94525, 82495, 120970, 187119, 188464, 249171, 205546, 270875]
            }, {
                name: 'Rural',
                data: [814420, 331682, 131849, 130659, 82029, 288235, 271462, 398244, 199795, 299037, 368013]
            }]
    });

}
// Activamos knockout.js
ko.applyBindings(new ViewModelRegion());


