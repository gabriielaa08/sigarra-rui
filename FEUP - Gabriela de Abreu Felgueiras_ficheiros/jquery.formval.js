/*
 * jQuery Form Validation plug-in 1.0.0
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
(function($) {

$.extend($.fn, {
	jqueryValForm: function() {
		$(this).find("input[validar=S]").each(function() {
			$(this).blur(function() {
				$(this).validarElem();
			})
		});
		$(this).find("textarea[validar=S]").each(function() {
			$(this).blur(function() {
				$(this).validarElem();
			})
		});
		$(this).submit(function() {
				return $(this).validarForm();
			});
	},

	validarForm: function() {
		var valido=true;
		$(this).find("input[validar=S]").each(function() {
			if(!$(this).validarElem())
				valido=false;
		});
		$(this).find("textarea[validar=S]").each(function() {
			if(!$(this).validarElem())
				valido=false;
		});
		return valido;
	},
	
	validarElem: function(opts) {
		var $inputElem = $(this);
		var inputVal = $(this).val();
		var tipoVal = $inputElem.attr("tipoval");
		var valMin = $inputElem.attr("valMin");
		var valMax = $inputElem.attr("valMax");
		var lenMin = $inputElem.attr("lenMin");
		var lenMax = $inputElem.attr("lenMax");
		var maxPrecisao = $inputElem.attr("maxPrecisao");
		var minPrecisao = $inputElem.attr("minPrecisao");
		var valIgual = $inputElem.attr("valIgual");
		var isObr = $inputElem.attr("obr");
		var messages = jQuery.extend( 
		{
			obr: "O preenchimento deste campo é obrigatório.",
			email: "Por favor introduza um email válido.",
			url: "Por favor introduza um url válido.",
			inteiro: "Por favor introduza um número inteiro válido.",
			numero: "Por favor introduza um número válido.",
			digitos: "Por favor introduza apenas digitos.",
            precisaoMax: "O número deve ter precisão máxima de " + maxPrecisao + " digitos.",
            precisaoMin: "O número deve ter precisão mínima de " + minPrecisao + " digitos.",
			minlen: "Por favor preencha no mínimo "+lenMin+" caracteres.",
			maxlen: "Não pode preencher mais do que "+lenMax+" caracteres.",
			minVal: "O Valor tem de ser superior a "+valMin+".",
			maxVal: "O Valor tem de ser inferior a "+valMax+".",
			intervaloLen: "Tem de preencher entre "+lenMin+" e "+lenMax+" caracteres.",
			intervaloVal: "O Valor tem de estar no intervalo de "+valMin+" a "+valMax+".",
			nigual: "O valor não coincide com o valor esperado."
		}); 
		
		var opcoes = $.extend({
			getLocErro: function($inputElem) {
				//Span onde é apresentado o erro
				var spanInfo = $inputElem.parent().parent().contents().find('.erro_val');
				if(!$(spanInfo).hasClass("erro_val")){
					$inputElem.parent().append('&nbsp;<span class="erro_val"></span>'); 
					spanInfo = $inputElem.parent().parent().contents().find('.erro_val');
				}
				return spanInfo;
			},
			
			onElementoInvalido: function($inputElem, msg){ 
				if($inputElem.parent().parent().contents().find('img[rel=erro_val_ico]').length==0)
					$inputElem.after('<img src="imagens/Erro" rel="erro_val_ico"/>');
				$(opcoes.getLocErro($inputElem)).html(msg);
				$inputElem.addClass("invalido");
			},
			
			onElementoValido: function ($inputElem){
				$inputElem.parent().parent().contents().find('img[rel=erro_val_ico]').remove();
				$(opcoes.getLocErro($inputElem)).html("");
				$inputElem.removeClass("invalido");
			}
		}, opts);
		
		//Span onde é apresentado o erro
		/*var spanInfo = $(inputElem).parent().parent().contents().find('.erro_val');
		if(!$(spanInfo).hasClass("erro_val")){
			$(inputElem).parent().append('&nbsp;<span class="erro_val"></span>'); 
			spanInfo = $(inputElem).parent().parent().contents().find('.erro_val');
		}*/

		function isElemValido(){
			//Valida obrigatoriedade
			if(isObr=='S' && $inputElem.val().length==0){
				opcoes.onElementoInvalido($inputElem, messages.obr);
				return false;
			}
			else if($inputElem.val().length>0){
				//valida tipo de dados
				switch(tipoVal)
				{
				case 'digitos':
				  if(!validaDigitos()){
					return false;
				  }
				  break;
				case 'email':
				  if(!validaEmail()){
					return false;
				  }
				  break;
				case 'url':
				  if(!validaUrl()){
					return false;
				  }
				  break;     
				case 'inteiro':
				  if(!validaInteiro()){
					return false;
				  }
				  break;
				case 'numero':
				  if(!validaNumero()){
					return false;
				  }
				  break; 
				}
				
				//valida valores e intervalos 
				if(tipoVal=='inteiro' || tipoVal=='numero' || tipoVal=='digitos'){
					
					if(valMin!=null && valMax!=null){
						if(!validaIntervaloVal()){
							return false;
						}
					}
					else{
						if(valMin!=null && !validaMinVal()){
							return false;
						}
						if(valMax!=null && !validaMaxVal()){
							return false;
						}
					}
					
					if(minPrecisao!=null && !validaMinPrecisao()){
						return false;
					}
					if(maxPrecisao!=null && !validaMaxPrecisao()){
						return false;
					}
					
				}
				//valida tamanhos e intervalos
				if(lenMin!=null && lenMax!=null){
					if(!validaIntervaloLen()){
						return false;
					}
				}
				else{
					if(lenMin!=null && !validaMinLen()){
						return false;
					}
					if(lenMax!=null && !validaMaxLen()){
						return false;
					}
				}
			} 
			return true;
		}
		
		/*function invalidateElem(msg){ 
			if($(inputElem).parent().parent().contents().find('img[rel=erro_val_ico]').length==0)
				$(inputElem).after('<img src="imagens/Erro" rel="erro_val_ico"/>');
			$(opcoes.getLocErro()).html(msg);
			$(inputElem).addClass("invalido");
		}
		
		function validateElem(){
			$(inputElem).parent().parent().contents().find('img[rel=erro_val_ico]').remove();
			$(opcoes.getLocErro()).html("");
			$(inputElem).removeClass("invalido");
		}*/
		
		/*-------------------------------- Funções Validação de Elementos ---------------------------------------*/
		function validaDigitos(){
			if(!/^\d+$/.test(inputVal)){
				opcoes.onElementoInvalido($inputElem, messages.digitos);
				return false;
			}
			return true;
		}
		
		function validaEmail(){
			if(!/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(inputVal)){
				opcoes.onElementoInvalido($inputElem, messages.email);
				return false;
			}
			return true;
		}
		
		function validaUrl(){
			if(!/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(inputVal)){
				opcoes.onElementoInvalido($inputElem, messages.url);
				return false;
			}
			return true;
		}
		
		function validaInteiro(){
			if(!/^[1-9]{1}[0-9]*?$/.test(inputVal)){
				opcoes.onElementoInvalido($inputElem, messages.inteiro);
				return false;
			} 
			return true;
		}
		
		function validaNumero(){
			if(!/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(inputVal.replace(",", "."))){
				opcoes.onElementoInvalido($inputElem, messages.numero);
				return false;
			} 
			return true;
		}
		 
		function validaMinLen(){
			if(!inputVal.length >= lenMin){
				opcoes.onElementoInvalido($inputElem, messages.minlen);
				return false;
			}
			return true;
		}
		
		function validaMaxLen(){
			if(! inputVal <= lenMax){
				opcoes.onElementoInvalido($inputElem, messages.maxlen);
				return false;
			}
			return true;
		}
		
		function validaIntervaloLen(){
			if( !(inputVal.length >= lenMin && inputVal.length <= lenMax )){
				opcoes.onElementoInvalido($inputElem, messages.intervaloLen);
				return false;
			}
			return true;
		}
		
		function validaMinVal(){
			if(parseFloat(inputVal.replace(",", ".")) < parseFloat(valMin.replace(",", "."))){
				opcoes.onElementoInvalido($inputElem, messages.minVal);
				return false;
			}
			return true;
		}
		
		function validaMaxVal(){
			if(parseFloat(inputVal.replace(",", ".")) > parseFloat(valMax.replace(",", ".")) ){
				opcoes.onElementoInvalido($inputElem, messages.maxVal);
				return false;
			}
			return true;
		}
		
		function validaMinPrecisao(){
			if((!inputVal.replace(",", ".").split('.')[1] && parseInt(minPrecisao) > 0) || (inputVal.replace(",", ".").split('.')[1].length < parseInt(minPrecisao))) { //parseFloat(inputVal) > parseFloat(valMax) ){
				opcoes.onElementoInvalido($inputElem, messages.precisaoMin);
				return false;
			}
			return true;
		}
		
		function validaMaxPrecisao(){
			if(inputVal.replace(",", ".").split('.')[1] && inputVal.replace(",", ".").split('.')[1].length > parseInt(maxPrecisao)) { //parseFloat(inputVal) > parseFloat(valMax) ){
				opcoes.onElementoInvalido($inputElem, messages.precisaoMax);
				return false;
			}
			return true;
		}
		
		function validaIntervaloVal(){
			if( !( parseFloat(inputVal.replace(",", ".")) >= parseFloat(valMin) && parseFloat(inputVal.replace(",", ".")) <= parseFloat(valMax) )){
				opcoes.onElementoInvalido($inputElem, messages.intervaloVal);
				return false;
			}
			return true;
		}
		
		function equalTo() {
			if(! inputVal == valIgual){ 
				opcoes.onElementoInvalido($inputElem, messages.nigual);
				return false;
			}
			return true;
		}
		/*-----------------------------------------------------------------------*/
		
		if(isElemValido($inputElem,tipoVal)){
			opcoes.onElementoValido($inputElem);
			return true;
		}
		return false;
    }
});

})(jQuery);