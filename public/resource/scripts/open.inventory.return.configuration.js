var use_cartons = '';
var use_individual_discount = '';
var config_cubic = 'N';
var config_w_h_cal = 'N';
var use_tax = 'N';

$(document).ready(function() {
	use_cartons = $("input.use_cartons").val();
	use_individual_discount = $("input.individual_discount").val();
	config_cubic       		= $("input.config_cubic").val();
	config_w_h_cal          = $("input.config_w_h_cal").val();
	use_tax         		= $("input.use_tax").val();

  	stock_check = $("input.stock_check").val()=='Y'?true:false;
  	$(".h3_php_error").click(function(){
	   $(".h3_php_error").fadeOut('slow');
	});
	$("input[type='submit']").click(function(){
		$("#xfade").fadeIn('fast');
	});
	$(window).keyup(function(e){
		if(e.keyCode == 27){
			$(this).clearPanelValues();
			$("div.itemSelector button").focus();
			if($(".updateMode").length){
				$(".updateMode").removeClass('updateMode');
			}
		}
	});
	$("#main-nav li ul").hide();
	$("#main-nav li a.current").parent().find("ul").slideToggle("slow");
	$("#main-nav li a.nav-top-item").click(
		function () {
			$(this).parent().siblings().find("ul").slideUp("normal");
			$(this).next().slideToggle("normal");
		}
	);
	var fileSelf = $(".this_file_name").val();
		$("#main-nav li a.nav-top-item.no-submenu[href='"+fileSelf+"']").addClass('current');
		$("#main-nav li a.nav-top-item").next("ul").find('li').find("a[href='"+fileSelf+"']").addClass("current").parent().parent().prev("a.nav-top-item").addClass("current");
	$("#main-nav li .nav-top-item").hover(
		function () {
			$(this).stop().animate({ paddingRight: "25px" }, 200);
		},
		function () {
			$(this).stop().animate({ paddingRight: "15px" });
		}
	);

	$(".content-box-header h3").css({ "cursor":"default" }); // Give the h3 in Content Box Header a different cursor
	$(".closed-box .content-box-content").hide(); // Hide the content of the header if it has the class "closed"
	$(".closed-box .content-box-tabs").hide(); // Hide the tabs in the header if it has the class "closed"

	/*$(".content-box-header h3").click(
		function () {
		  $(this).parent().next().toggle();
		  $(this).parent().parent().toggleClass("closed-box");
		  $(this).parent().find(".content-box-tabs").toggle();
		}
	);*/
	// Content box tabs:
	$.fn.numericOnly = function(){
		$(this).keydown(function(e){
			if (e.keyCode == 46 || e.keyCode == 8 || e.keyCode == 9
			||  e.keyCode == 27 || e.keyCode == 13 || e.keyCode == 190
			|| (e.keyCode == 65 && e.ctrlKey === true)
			|| (e.keyCode >= 35 && e.keyCode <= 39)){
				return true;
			}else{
				if (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105 )) {
					e.preventDefault();
				}
			}
		});
	};
	$.fn.numericFloatOnly = function(){
		$(this).keydown(function(e){
			if (e.keyCode == 46 || e.keyCode == 8 || e.keyCode == 9
				||  e.keyCode == 27 || e.keyCode == 13 || e.keyCode == 190 || e.keyCode == 110
				|| (e.keyCode == 65 && e.ctrlKey === true)
				|| (e.keyCode >= 35 && e.keyCode <= 39)){
					return true;
			}else{
				if (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105 )) {
					e.preventDefault();
				}
			}
		});
	};
	$('.content-box .content-box-content div.tab-content').hide(); // Hide the content divs
	$('ul.content-box-tabs li a.default-tab').addClass('current'); // Add the class "current" to the default tab
	$('.content-box-content div.default-tab').show(); // Show the div with class "default-tab"
	$('.content-box ul.content-box-tabs li a').click( // When a tab is clicked...
		function() {
			$(this).parent().siblings().find("a").removeClass('current'); // Remove "current" class from all tabs
			$(this).addClass('current'); // Add class "current" to clicked tab
			var currentTab = $(this).attr('href'); // Set variable "currentTab" to the value of href of clicked tab
			$(currentTab).siblings().hide(); // Hide all content divs
			$(currentTab).show(); // Show the content div with the id equal to the id of clicked tab
			return false;
		}
	);
	//Close button:
	$(".close").click(
		function () {
			$(this).parent().fadeTo(400, 0, function () { // Links with the class "close" will close parent
				$(this).slideUp(400);
			});
			return false;
		}
	);

	// Alternating table rows:

	$('tbody tr:even').addClass("alt-row"); // Add class "alt-row" to even table rows

	// Check all checkboxes when the one in a table head is checked:

	$('.check-all').click(
		function(){
			$(this).parent().parent().parent().parent().find("input[type='checkbox']").attr('checked', $(this).is(':checked'));
		}
	);
	$.fn.sumColumn = function(sumOfFeild,insertToFeild){
		var sumAll = 0;
		$(sumOfFeild).each(function(index, element) {
             sumAll += parseInt($(this).text());
        });
		$(insertToFeild).text(sumAll);
	};
	$.fn.sumColumnFloat = function(sumOfFeild,insertToFeild){
		var sumAll = 0;
		$(sumOfFeild).each(function(index, element) {
             sumAll += parseFloat($(this).text())||0;
        });
		sumAll = Math.round(sumAll*100)/100;
		$(insertToFeild).text(sumAll);
	};
	$.fn.multiplyTwoFeilds = function(multiplyToElmVal,writeProductToElm){
		$(writeProductToElm).val($(this).val()*$(multiplyToElmVal).val());
	};
	$.fn.multiplyTwoFloats = function(multiplyToElmVal,writeProductToElm){
		$(this).keyup(function(e){
			var thisVal = parseFloat($(this).val())||0;
			var thatVal = parseFloat($(multiplyToElmVal).val())||0;
			var productVal = Math.round((thisVal*thatVal)*100)/100;
			$(writeProductToElm).val(productVal);
		});
	};
	$.fn.deleteRowConfirmation = function(file){
		var idValue = $(this).attr("do");
		var currentRow = $(this).parent().parent();
		$("#xfade").hide();
		$("#popUpDel").remove();
		$("body").append("<div id='popUpDel'><p class='confirm'>Confirm Delete?</p><a class='dodelete btn btn-danger'>Confirm</a><a class='nodelete btn btn-info'>Cancel</a></div>");
		$("#popUpDel").hide();
		$("#xfade").fadeIn();
		var win_hi = $(window).height()/2;
		var win_width = $(window).width()/2;
		win_hi = win_hi-$("#popUpDel").height()/2;
		win_width = win_width-$("#popUpDel").width()/2;
		$("#popUpDel").css({
			'position': 'fixed',
			'top': win_hi,
			'left': win_width
		});
		$.post(file, {id : idValue}, function(data){
			var supplierName = currentRow.children("td").first().next().next().text();
			if(data==1){
				$("#popUpDel .confirm").text(" "+supplierName+"Contains Information! Do You Really Want To Delete "+supplierName+"?.");
				$("#popUpDel").slideDown();
				$(".dodelete").click(function(){
					$.post(file, {cid : idValue}, function(data){
						if(data == 'L'){
							$("#popUpDel .confirm").text(" Stock is Issued To Sheds Cannot Delete This Record! ");
							$(".dodelete").hide();
							$(".nodelete").text('Close');
							$(".nodelete").click(function(){
								$("#popUpDel").slideUp();
								$("#xfade").fadeOut();
							});
						}else{
							currentRow.slideUp();
							$("#popUpDel").slideUp();
							$("#xfade").fadeOut();
						}
					});
				});
			}else{
				$("#popUpDel .confirm").text("Are Sure you Want To Delete "+supplierName+"?");
				$("#popUpDel").slideDown();
				$(".dodelete").click(function(){
					$.post(file, {cid : idValue}, function(data){
						currentRow.slideUp();
						$("#popUpDel").slideUp();
						$("#xfade").fadeOut();
					});
				});
			}
		});
		$(".nodelete").click(function(){
			$("#popUpDel").slideUp();
			$("#xfade").fadeOut();
			});
		$(".close_popup").click(function(){
			$("#popUpDel").slideUp();
			$("#xfade").fadeOut('fast');
			});
	};
	$.fn.multiplyTwoFloatsCheckTax = function(multiplyToElmVal,writeProductToElm,writeProductToElmNoTax,taxAmountElm){
		$(this).keyup(function(e){
			var taxRate = $("input.taxRate").val();
			var taxType   = ($(".taxType").is(":checked"))?"I":"E";
			var thisVal = parseFloat($(this).val())||0;
			var thatVal = parseFloat($(multiplyToElmVal).val())||0;
			var amount = Math.round((thisVal*thatVal)*100)/100;
			if(taxRate > 0){
				if(taxType == 'I'){
					taxAmount = amount*(taxRate/100);
					amount -= taxAmount;
				}else if(taxType == 'E'){
					taxAmount = amount*(taxRate/100);
				}

			}else{
				taxAmount = 0;
			}
			taxAmount = Math.round(taxAmount*100)/100;
			amount = Math.round(amount*100)/100;
			var finalAmount = Math.round((amount+taxAmount)*100)/100;
			$(taxAmountElm).val(taxAmount);
			$(writeProductToElm).val(finalAmount);
			$(writeProductToElmNoTax).val(amount);
			$(this).calculateRowTotal();
		});
	};
	$.fn.centerThisDiv = function(){
		var win_hi = $(window).height()/2;
		var win_width = $(window).width()/2;
		win_hi = win_hi-$(this).height()/2;
		win_width = win_width-$(this).width()/2;
		$(this).css({
			'position': 'fixed',
			'top': win_hi,
			'left': win_width
		});
	};
	//inventory.php end
	$.fn.setFocusTo = function(Elm){
		$(this).keydown(function(e){
			if(e.keyCode==13){
				if($(this).val()==""){
					e.preventDefault();
				}else{
					e.preventDefault();
					$(Elm).focus();
				}
			}
		});
	};
	$(".datepicker").datepicker({
		dateFormat: 'dd-mm-yy',
		showAnim : 'show',
		changeMonth: true,
		changeYear: true,
		yearRange: '2000:+10'
	});
	$.fn.getItemDetails = function(){
		var item_id = $(".itemSelector option:selected").val();
		if(item_id != ''){
			$.post('db/get-item-details.php',{p_item_id:item_id,get_item_cost:true},function(data){
				data = $.parseJSON(data);
				var itemStock = data['STOCK'];
				var rateCarton = data['RATE_CARTON'];
				var qtyPerCarton = data['QTY_PER_CARTON'];
				var itemPrice = parseFloat(data['P_PRICE'])||0;
        		itemPrice     = (itemPrice).toFixed(2);
				$("input.unitPrice").val(itemPrice);
				$("input.carton_rate").val(rateCarton);
				$("input.per_carton").val(qtyPerCarton);
				$("input.inStock").attr('thestock',itemStock).val(itemStock);
			});
		}
	};
	$.fn.getItemReturnDetails = function(){
		var item_id = $(".itemSelector option:selected").val();
		var purchase_id = parseInt($("input.purchase_id").val())||0;
		if(item_id != ''&&purchase_id>0){
			$.post('db/getItemReturnDetails.php',{p_item_id:item_id,purchase_id:purchase_id},function(data){
				data = $.parseJSON(data);
				var itemStock = data['STOCK'];
				var itemPrice = data['P_PRICE'];
				$("input.unitPrice").val(itemPrice);
				$("input.inStock").attr('thestock',itemStock).val(itemStock);
			});
		}
	};
	$.fn.quickSave = function(){
		// alert('quickSave');
		var totalQuantity = 0;
		var medical_store_mode = $("input.batch_no").length;
		var item_id   = $(".itemSelector option:selected").val();
		var item_name = $(".itemSelector option:selected").text();

		var splitExist = item_name.includes("~");
		if(splitExist == true){
			var item_name_array = item_name.split("~");
			item_name = item_name_array[0];
		}


		var quantity  = parseFloat($("input.quantity").val())||0;
		totalQuantity += quantity;
		var unitPrice = parseFloat($("input.unitPrice").val())||0;
		var discount  = parseFloat($("input.discount").val())||0;
				
		var subAmount = parseFloat($("input.totalAmount").attr('data-sub-amount'))||0;
        if (use_cartons == 'Y') {
            var cartons = parseFloat($("input.cartons").val()) || 0;
            var carton_rate         = parseFloat($("input.carton_rate").val())||0;
            var per_carton = parseFloat($("input.per_carton").val()) || 0;

            // totalQuantity for quantity validation
            totalQuantity =  totalQuantity + (cartons * per_carton);
        }

        if (config_cubic == 'Y') {
        	var cubeLength = parseFloat($("input.cubeLength").val()) || 0;
        	var cubeWidth = parseFloat($("input.cubeWidth").val()) || 0;
        	var cubeHeight = parseFloat($("input.cubeHeight").val()) || 0;
        }

        if (config_w_h_cal == 'Y') {
            var width = parseFloat($("input.width").val()) || 0;
            var height = parseFloat($("input.height").val()) || 0;
            var sq_feet = parseFloat($("input.sq_feet").val()) || 0;
            var pices = parseFloat($("input.pices").val()) || 0;
        }

		// var subAmount = parseFloat($("input.subAmount").val())||0;
		// var subAmount = parseFloat($("input.totalAmount").attr('data-sub-amount'))||0;
		if (use_tax == 'Y') {
			var taxRate   = parseFloat($("input.taxRate").val())||0;
			var taxAmount = parseFloat($("input.taxAmount").val())||0;
		}
		var totalAmount = parseFloat($("input.totalAmount").val())||0;
		$(this).blur();
		if(taxRate == '' || taxRate == 0){
			taxAmount = 0;
		}

        if(medical_store_mode){
            var batch_no             = $("input.batch_no").val();
        }

		var updateMode = $(".updateMode").length;

        if(totalQuantity == 0){
            displayMessage('Quantity Missing!');
            return false;
        }

		if(item_id == '' || item_name == '' || totalAmount == ''){
			displayMessage('Value Missing!');
            return false;
		}

			// if(updateMode == 0){
				var the_row = '<tr class="alt-row calculations transactions" data-row-id="0">';
				the_row += '<td style="text-align:left;" class="itemName" data-item-id="'+item_id+'">'+item_name+'</td>';

		        if(medical_store_mode){
		        	the_row  += '<td style="text-align:center;" class="batch_no">' + batch_no + '</td>';
		        }
                if (use_cartons == 'Y') {
                    the_row  += '<td style="text-align:center;" class="cartons">' + cartons + '</td>';
                    the_row  += '<td style="text-align:center;" class="carton_rate">'+carton_rate+'</td>';
                    the_row  += '<td style="text-align:center;" class="per_carton">' + per_carton + '</td>';
                }
	            if (config_cubic == 'Y') {
	            	the_row  += '<td style="text-align:center;" class="cubeLength">'+cubeLength+'</td>';
	            	the_row  += '<td style="text-align:center;" class="cubeWidth">'+cubeWidth+'</td>';
	            	the_row  += '<td style="text-align:center;" class="cubeHeight">'+cubeHeight+'</td>';
	            }

	            if (config_w_h_cal == 'Y') {
	                the_row  += '<td class="text-center width">'+width+'</td>';
	                the_row  += '<td class="text-center height">'+height+'</td>';
	                the_row  += '<td class="text-center sq_feet">'+sq_feet+'</td>';
	                the_row  += '<td class="text-center pices">'+pices+'</td>';
	            }

				the_row += '<td style="text-align:center;" class="quantity">'+quantity+'</td>';
				the_row += '<td style="text-align:center;" class="unitPrice">'+unitPrice+'</td>';
				if (use_individual_discount == 'Y') {
					the_row += '<td  style="text-align:center;" class="discount">'+discount+'</td>';
				}
				// the_row += '<td style="text-align:center;" class="subAmount">'+subAmount+'</td>';
				if (use_tax == 'Y') {
					the_row += '<td style="text-align:center;" class="taxRate">'+taxRate+'</td>';
					the_row += '<td style="text-align:center;" class="taxAmount">'+taxAmount+'</td>';
				}
				the_row += '<td style="text-align:center;" class="totalAmount" data-sub-amount='+subAmount+'>'+totalAmount+'</td>';
				// the_row += '<td style="text-align:center;"> - - - </td>';
				the_row += '<td style="text-align:center;"> ';
				the_row += ' <a id="view_button" onClick="editThisRow(this);" title="Update"><i class="fa fa-pencil"></i></a>';
				the_row += ' <a class="pointer" do="" title="Delete" onclick="$(this).parent().parent().remove();"><i class="fa fa-times"></i></a>';
				the_row += '</td>';
				the_row += '</tr>';
				// the_row.insertAfter($(".calculations").last());

				// $(the_row).insertAfter($(".calculations").last());

				if(updateMode == 0){
					// alert('Mode 0');
					$(the_row).insertBefore($(".calculations").first());
				}else if(updateMode == 1){
					// alert('Mode 1');
					$(".updateMode").replaceWith(the_row);
				}


			// }else if(updateMode == 1){
   //              $(".updateMode").find('td.itemName').text(item_name);
   //              $(".updateMode").find('td.itemName').attr('data-item-id', item_id);
   //              if (use_cartons == 'Y') {
   //                  $(".updateMode").find('td.cartons').text(cartons);
   //                  $(".updateMode").find('td.carton_rate').text(carton_rate);
   //                  $(".updateMode").find('td.per_carton').text(per_carton);
   //              }
   //              $(".updateMode").find('td.quantity').text(quantity);
   //              $(".updateMode").find('td.unitPrice').text(unitPrice);
   //              if (use_individual_discount == 'Y') {
   //                  $(".updateMode").find('td.discount').text(discount);
   //              }
   //              $(".updateMode").find('td.subAmount').text(subAmount);
   //              $(".updateMode").find('td.taxRate').text(taxRate);
   //              $(".updateMode").find('td.taxAmount').text(taxAmount);
   //              $(".updateMode").find('td.totalAmount').text(totalAmount);
   //              // $(".updateMode").find('td.totalAmount').attr('data-sub-amount', subAmount);
   //              $(".updateMode").removeClass('updateMode');				
			// }
			$(this).clearPanelValues();
			// $(this).calculateColumnTotals();
			$(".itemSelector").parent().find(".dropdown-toggle").focus();
		
	};
	$.fn.calculateColumnTotals = function()
	{
		// alert('calculateColumnTotals');
		$(this).sumColumn("td.cartons","td.cartons");
		$(this).sumColumn("td.quantity","td.qtyTotal");
		// $(this).sumColumnFloat("td.subAmount","td.amountSub");
		$(this).sumColumnFloat("td.taxAmount","td.amountTax");
		$(this).sumColumnFloat("td.totalAmount","td.amountTotal");

    	var total_amount = parseFloat($("td.amountTotal").text())||0;
    	var income_tax   = parseFloat($("input.income_tax_percent").val())||0;
		    income_tax   = (total_amount*income_tax)/100;
		$("input.income_tax").val((Math.round(income_tax)).toFixed(2));
	};
	$.fn.calculateRowTotal = function(){
		var taxRate = parseFloat($("input.taxRate").val())||0;
		var taxType = ($(".taxType").is(":checked"))?"I":"E";
		var thisVal = parseFloat($("input.quantity").val())||0;
		var thatVal = parseFloat($("input.unitPrice").val())||0;
		var amount  = Math.round((thisVal*thatVal)*100)/100;
		var discountAvail = parseFloat($("input.discount").val())||0;
		var taxAmount = parseFloat($("input.taxAmount").val())||0;

        var cartonAmount = 0;
        if (use_cartons == 'Y'){
            var cartons             = parseFloat($("input.cartons").val())||0;
            var carton_rate         = parseFloat($("input.carton_rate").val())||0;
            cartonAmount = cartons * carton_rate;
            amount = amount + cartonAmount;
        }

		taxAmount = Math.round(taxAmount*100)/100;
		amount = Math.round(amount*100)/100;
		discountAvail = Math.round(discountAvail*100)/100;
		discountPerCentage = amount*(discountAvail/100);
		discountPerCentage = Math.round(discountPerCentage*100)/100;
		amount -= discountPerCentage;
		amount = Math.round(amount*100)/100;

		if(taxRate > 0){
			if(taxType == 'I'){
				taxAmount = amount*(taxRate/100);
			}else if(taxType == 'E'){
				taxAmount = amount*(taxRate/100);
			}
		}else{
			taxAmount = 0;
		}
		var finalAmount = Math.round((amount+taxAmount)*100)/100;
		finalAmount = Math.round(finalAmount*100)/100;

		$("input.totalAmount").attr('data-sub-amount', Math.round(amount));

		if(taxType == 'I'){
			amount		-= taxAmount;
			finalAmount -= taxAmount;
		}
		// $("input.subAmount").val(amount);
		$("input.taxAmount").val(taxAmount);
		$("input.totalAmount").val(finalAmount);
		
	};
	$.fn.updateStockInHand = function(){
		var stockOfBill = 0;
		$("td.quantity").each(function(index, element) {
            stockOfBill += parseInt($(this).text())||0;
        });
		stockOfBill += parseInt($("input.quantity").val())||0;
	};
	$.fn.clearPanelValues = function(){
		$("select.itemSelector option").prop('selected',false);
		$("select.itemSelector").selectpicker('refresh');
		$("input.cubeLength").val('');
		$("input.cubeWidth").val('');
		$("input.cubeHeight").val('');
        if (config_w_h_cal == 'Y') {
            $("input.width").val('');
            $("input.height").val('');
            $("input.sq_feet").val('');
            $("input.pices").val('');
        }
		$("input.quantity").val('');
		$("input.cartons").val('');
		$("input.carton_rate").val('');
		$("input.per_carton").val('');
		$("input.unitPrice").val('');
		$("input.discount").val('');
		$("input.subAmount").val('');
		$("input.taxRate").val('');
		$("input.taxAmount").val('');
		$("input.totalAmount").val('');
		// $("input.inStock").val('').attr('thestock','');
	};
});
		// PreLoad FUNCTION //
		//////////////////////
	var letMeGo = function(thisElm){
		$(thisElm).fadeOut(300,function(){
			$(this).html('');
		});
	};

	var editThisRow = function(thisElm){
		// alert('editThisRow');
		var thisRow = $(thisElm).parent('td').parent('tr');
	    $(".updateMode").removeClass('updateMode');
	    thisRow.addClass('updateMode');

	    var medical_store_mode = $("input.batch_no").length;
	    var item_name = thisRow.find('td.itemName').text();
	    var item_id = parseInt(thisRow.find('td.itemName').attr('data-item-id')) || 0;
	    var batch_no = thisRow.find('td.batch_no').text();
	    var cartons = parseFloat(thisRow.find('td.cartons').text()) || 0;
	    var carton_rate = parseFloat(thisRow.find('td.carton_rate').text()) || 0;
	    var per_carton = parseFloat(thisRow.find('td.per_carton').text()) || 0;

	    var cubeLength 		= thisRow.find('td.cubeLength').text();
	    var cubeWidth 		= thisRow.find('td.cubeWidth').text();
	    var cubeHeight 		= thisRow.find('td.cubeHeight').text();

	    if(config_w_h_cal == 'Y'){
		    var width           = thisRow.find('td.width').text();
		    var height          = thisRow.find('td.height').text();
		    var sq_feet         = thisRow.find('td.sq_feet').text();
		    var pices           = thisRow.find('td.pices').text();
		}
	    var quantity = parseFloat(thisRow.find('td.quantity').text()) || 0;

	    var unitPrice = parseFloat(thisRow.find('td.unitPrice').text()) || 0;
	    var discount = parseFloat(thisRow.find('td.discount').text()) || 0;
	    var subAmount = parseFloat(thisRow.find('td.subAmount').text()) || 0;
	    var taxRate = parseFloat(thisRow.find('td.taxRate').text()) || 0;
	    var taxAmount = parseFloat(thisRow.find('td.taxAmount').text()) || 0;
	    var totalAmount = parseFloat(thisRow.find('td.totalAmount').text()) || 0;

	    $(".itemSelector option[value='" + item_id + "']").prop('selected', true);
	    $(".itemSelector").selectpicker('refresh');
	    $("input.batch_no").val(batch_no);
	    $("input.cartons").val(cartons);
	    $("input.carton_rate").val(carton_rate);
	    $("input.per_carton").val(per_carton);
	    
		$("input.cubeHeight").val(cubeHeight);
		$("input.cubeWidth").val(cubeWidth);
		$("input.cubeLength").val(cubeLength);

	    if(config_w_h_cal == 'Y'){
	        $("input.width").val(width);
	        $("input.height").val(height);
	        $("input.sq_feet").val(sq_feet);
	        $("input.pices").val(pices);
	    }
	    $("input.quantity").val(quantity);

	    $("input.unitPrice").val(unitPrice);
	    $("input.discount").val(discount);
	    $("input.subAmount").val(subAmount);
	    $("input.taxRate").val(taxRate);
	    $("input.taxAmount").val(taxAmount);
	    $("input.totalAmount").val(totalAmount);
	    $("input.totalAmount").attr('data-sub-amount', subAmount);
	    $("div.itemSelector button").focus();




	};		
	var editThisRow1 = function(thisElm){
		// alert('editThisRow');
		var thisRow 	= $(thisElm).parent('td').parent('tr');
		$(".updateMode").removeClass('updateMode');
		thisRow.addClass('updateMode');
		var item_name 	= thisRow.find('td').eq(0).text();
		var item_id 	= parseInt(thisRow.find('td').eq(0).attr('data-item-id'))||0;
		var quantity 	= thisRow.find('td').eq(1).text();
		var unitPrice 	= thisRow.find('td').eq(2).text();
		var discount 	= thisRow.find('td').eq(3).text();
		var subAmount 	= thisRow.find('td').eq(4).text();
		var taxRate 	= parseFloat(thisRow.find('td').eq(5).text())||0;
		var taxAmount   = thisRow.find('td').eq(6).text();
		var totalAmount = thisRow.find('td').eq(7).text();
		if(item_id == 0){
			return false;
		}
		$.post('db/get-item-details.php',{p_item_id:item_id},function(data){
			data = $.parseJSON(data);
			var itemStock = data['STOCK'];
			// $("input.inStock").attr('thestock',itemStock).val(itemStock);
			$("select.itemSelector option[value='"+item_id+"']").prop('selected',true);
			$("select.itemSelector").selectpicker('refresh');
			$("input.quantity").val(quantity);
			$("input.quantity").animate({'background-color':'rgba(102,255,102,0.7)'},300,function(){
				$("input.quantity").animate({'background-color':'#FFF'},300).keyup();
			});
			$("input.unitPrice").val(unitPrice);
			$("input.discount").val(discount);
			$("input.subAmount").val(subAmount);
			$("input.taxRate").val(taxRate);
			$("input.taxAmount").val(taxAmount);
			$("input.totalAmount").val(totalAmount);
			// stockOs();
			$("input.quantity").focus();
		});
	};
	var stockOs = function(){
		var thisQty = parseInt($("input.quantity").val())||0;
		var inStock = parseInt($("input.inStock").attr('thestock'))||0;
		var NewStock =  inStock - thisQty;
		if(NewStock < 0 && stock_check){
			$("input.quantity").val(0);
		}else{
      $("input.inStock").val(NewStock);
		}
	};

	var savePurchase = function(){
		var purchase_id  		= 0;
		var medical_store_mode = $("input.batch_no").length;
		var purchase_return_id 	= $("input.prid").val();
		var purchase_return_id 	= $("input.prid").val();
		var purchaseDate 	    = $(".datepicker").val();
		var billNum      	    = parseInt($("input.bill_number").val())||0;
		var supplierCode 	    = $("select.supplierSelector option:selected").val();
		var supplier_name	    = $(".supplier_name").val();
		var po_number 		    = $("input.po_number").val();
    	var income_tax    	    = parseFloat($("input.income_tax_percent").val())||0;
		var unregistered_tax    = ($("input.unregistered_tax:checked").length)?"N":"Y";
	    var config_pnl_date   = $("input.config_pnl_date").val();

	    var purchaseDateProcess = purchaseDate.split("-");
	    purchaseDate = purchaseDateProcess[2]+"-"+purchaseDateProcess[1]+"-"+purchaseDateProcess[0];
	    if(new Date(purchaseDate) <= new Date(config_pnl_date)){
	        displayMessage('Purchase Date must be grater then date '+config_pnl_date);
	        return;
	    }

		if(supplierCode == ''){
			displayMessage('Please, Select an Account!');
			return false;
		}
		// if(billNum == 0){
		// 	displayMessage('Please, Enter Memo Number!');
		// 	return false;
		// }
		if($("tr.transactions").length == 0){
			displayMessage('Please Make at least One Transaction!');
			return false;
		}
    	$(".savePurchase").hide();

    	var jSonString = {};
	    $("tr.transactions").each(function(index, element) {
	        var rowId = $(this).attr('data-row-id');
	        jSonString[index] = {};
	        jSonString[index].row_id = rowId;
	        jSonString[index].item_id = parseInt($(this).find('td.itemName').attr('data-item-id')) || 0;
	        jSonString[index].item_description = $(this).find('td.item_description').text();
	        
	        jSonString[index].cubeLength 	= parseFloat($(this).find('td.cubeLength').text()) || 0;
	        jSonString[index].cubeWidth 	= parseFloat($(this).find('td.cubeWidth').text()) || 0;
	        jSonString[index].cubeHeight 	= parseFloat($(this).find('td.cubeHeight').text()) || 0;

	        jSonString[index].widthh   = parseFloat($(this).find('td.width').text()) || 0;
	        jSonString[index].heightt  = parseFloat($(this).find('td.height').text()) || 0;
	        jSonString[index].sq_feet  = parseFloat($(this).find('td.sq_feet').text()) || 0;
	        jSonString[index].pices    = parseFloat($(this).find('td.pices').text()) || 0;

	        jSonString[index].quantity = parseFloat($(this).find('td.quantity').text()) || 0;
	        jSonString[index].weight = parseFloat($(this).find('td.weight').text()) || 0;
	        jSonString[index].batch_no = $(this).find('td.batch_no').text() || '';

	        jSonString[index].cartons = parseFloat($(this).find('td.cartons').text()) || 0;
	        jSonString[index].carton_rate = parseFloat($(this).find('td.carton_rate').text()) || 0;
	        jSonString[index].per_carton = parseFloat($(this).find('td.per_carton').text()) || 0;

	        jSonString[index].unitPrice = parseFloat($(this).find('td.unitPrice').text()) || 0;
	        jSonString[index].discount = parseFloat($(this).find('td.discount').text()) || 0;

	        jSonString[index].subAmount = parseFloat($(this).find('td.totalAmount').attr('data-sub-amount')) || 0;

	        jSonString[index].taxRate = parseFloat($(this).find('td.taxRate').text()) || 0;
	        jSonString[index].taxAmount = parseFloat($(this).find('td.taxAmount').text()) || 0;
	        jSonString[index].totalAmount = parseFloat($(this).find('td.totalAmount').text()) || 0;
	        
	        if (medical_store_mode) {
	            jSonString[index].batch_no = $(this).find('td.batch_no').text();
	        }
	    });
	    jSonString = JSON.stringify(jSonString);

		$("#xfade").fadeIn();

		$.post("db/savePurchaseReturn.php",{purchase_id:purchase_id,
									  purchase_return_id:purchase_return_id,
									  purchaseDate:purchaseDate,
									  billNum:billNum,
									  unregistered_tax:unregistered_tax,
									  po_number:po_number,
									  supplierCode:supplierCode,
									  supplier_name:supplier_name,
                    				  income_tax:income_tax,
									  jSonString:jSonString},function(data){
				data = $.parseJSON(data);
				// alert('data='+data);
				if(data['ID'] > 0){
					var msg_type = '';
					if(purchase_return_id == 0){
						msg_type = "&saved";
					}else{
						msg_type = "&updated";
					}
					window.location.href = 'purchase-return-details.php?id='+data['ID']+msg_type;
				}else{
					$("#xfade").fadeOut();
					displayMessage(data['MSG']);
				}
		});
	};
	var displayMessage= function(message){
		$("#popUpDel").remove();
		$("body").append("<div id='popUpDel'><p class='confirm'>"+message+"</p><a class='nodelete btn btn-info'>Close</a></div>");
		$("#popUpDel").hide();
		$("#fade").fadeIn('slow');
		var win_hi = $(window).height()/2;
		var win_width = $(window).width()/2;
		win_hi = win_hi-$("#popUpDel").height()/2;
		win_width = win_width-$("#popUpDel").width()/2;
		$("#popUpDel").css({
			'position': 'fixed',
			'top': win_hi,
			'left': win_width
		});
		$("#popUpDel").fadeIn();
		$(".nodelete").click(function(){
			$("#popUpDel").slideDown(function(){
				$("#popUpDel").remove();
			});
			$("#fade").fadeOut('slow');
		});
	};

	var shorDeleteRowDilog = function(rowChildElement){
		var idValue = $(rowChildElement).attr("do");
		var clickedDel = $(rowChildElement);
		$("#fade").hide();
		$("#popUpDel").remove();
		$("body").append("<div id='popUpDel'><p class='confirm'>Do you Really want to Delete?</p><a class='dodelete btn btn-danger'>Delete</a><a class='nodelete btn btn-info'>Cancel</a></div>");
		$("#popUpDel").hide();
		$("#popUpDel").centerThisDiv();
		$("#fade").fadeIn('slow');
		$("#popUpDel").fadeIn();
		$(".dodelete").click(function(){
			$("#popUpDel").children(".confirm").text('Row Deleted Successfully!');
			$("#popUpDel").children(".dodelete").hide();
			$("#popUpDel").children(".nodelete").text("Close");
			clickedDel.parent().parent().remove();
		});
		$(".nodelete").click(function(){
			$("#fade").fadeOut();
			$("#popUpDel").fadeOut();
			});
		$(".close_popup").click(function(){
		$("#popUpDel").slideUp();
		$("#fade").fadeOut('fast');
		});
	};
	var getBillsBySupplierCode = function(){
		var supplierCode = $("select.supplierSelector option:selected").val();
		if(supplierCode == ''){
			$("div.supplierSelector button").focus();
			return false;
		}
		$.post('db/getBillListBySupplerCode.php',{supplierCode:supplierCode},function(data){
			if(data != ''){
				$("select.billSelector").find("option").first().nextAll().remove();
				$("select.billSelector").append(data);
				$("select.billSelector").selectpicker('refresh');
				$("div.billSelector button").focus();
			}else{
				$("select.billSelector").find("option").first().nextAll().remove();
				$("select.billSelector").selectpicker('refresh');
				$("div.supplierSelector button").focus();
			}
		});
	};
	var makeItCash = function(checker){
		var what = $(checker).is(":checked");
		if(what){
			$("select.supplierSelector option[value^='040101']").prop('disabled',true).prop('selected',false);
			$("select.supplierSelector option[value^='010101']").prop('disabled',false).prop('selected',false);
			$("select.supplierSelector").selectpicker('refresh');
			$(".supplier_name_div").show().focus();
		}else{
			$("select.supplierSelector option[value^='040101']").prop('disabled',false).prop('selected',false);
			$("select.supplierSelector option[value^='010101']").prop('disabled',true).prop('selected',false);
			$("select.supplierSelector").selectpicker('refresh');
			$(".supplier_name_div").val('').hide();
		}
	};
	var getBillDetails = function(){
		var supplier_code  = $("select.supplierSelector option:selected").val();
		var bill_number	   = parseInt($("select.billSelector option:selected").val())||0;
		var purchase_id    = $(".purchase_id").val();
		if(bill_number == 0 && supplier_code == ''){
			return false;
		}
		$.post('db/getPurchaseBill.php',{purchase_id:purchase_id,supplier_code:supplier_code,bill_num:bill_number},function(data){
			$("tr.calculations").first().nextAll(".calculations").remove();
			$(data).insertAfter($("tr.calculations").first());
			$(this).calculateColumnTotals();
			if(purchase_id == 0){
				$("tr.isRedRow").find('td').animate({'background-color':'rgba(255,0,0,0.2)'},300);;
			}
		});
	};
 var stock_check;
