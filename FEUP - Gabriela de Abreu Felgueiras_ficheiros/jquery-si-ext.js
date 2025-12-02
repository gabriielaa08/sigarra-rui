function pedidoAjax(procedimento, parametros, div_actualizacao, showInBox, multiJanelaId) {
	if (div_actualizacao) {
		$("#" + div_actualizacao)
				.html("<img src=''imagens/loading_ajax'' alt=''A Carregar...''>");
	}
	$.ajax({
				type : "POST",
				url : procedimento,
				data : parametros,
				success : function(resp) {
					resp = resp.replace("\n", "");
					if (showInBox) {
                        if (multiJanelaId)
                            jQuery.facebox(resp, false, multiJanelaId);
                        else 
						    jQuery.facebox(resp);
                    }
					else
						$("#" + div_actualizacao).html(resp); 
				}
			});
}

function getLovMaxIndex() {
    var maxID = 1, currID;
    for (var elems = $("a[id^=lov]"), i = elems.length - 1; i >= 0; i--) {
	    currID = parseInt(elems[i].id.substring(elems[i].id.lastIndexOf("_")+1));
	    if(currID>maxID) maxID=currID;
    }
    return maxID;
}