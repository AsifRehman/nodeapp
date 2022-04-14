var print_method = '';
var print_opt = '';
var config_cubic = 'N';
var config_description = 'N';
var scheme_config = 'N';
var config_w_h_cal = 'N';
var config_pur_item_exp = 'N';
var use_tax = 'N';
var config_tax_type = 'N';

$(document).ready(function() {

    config_description = $("input.config_description").val();
    use_cartons     = $("input.use_cartons").val();
    use_tax         = $("input.use_tax").val();
    use_tiles       = $("input.use_tiles").val();
    use_freight     = $("input.use_freight").val();
    use_color       = $("input.use_color").val();
    use_milk_addon  = $("input.use_milk_addon").val();
    use_individual_discount = $("input.individual_discount").val();
    weight_addon            = $("input.weight_addon").val();
    config_cubic            = $("input.config_cubic").val();
    scheme_config           = $("input.scheme_config").val();
    config_w_h_cal          = $("input.config_w_h_cal").val();
    config_pur_item_exp     = $("input.config_pur_item_exp").val();
    config_tax_type         = $("input.config_tax_type").val();

    $(window).keyup(function(e) {
        if (e.keyCode == 27) {
            $(this).clearPanelValues();
            $("div.itemSelector button").focus();
            if ($(".updateMode").length) {
                $(".updateMode").removeClass('updateMode');
            }
        }
    });
    $.fn.serializeObject = function() {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
    $.fn.barcodeAvailable = function() {
        var $thisElm = $(this);
        var item_id = parseInt($("input[name=itemID]").val()) || 0;
        $(this).on('keyup blur', function(e) {
            $.get('db/compare-barcode.php', { q: $(this).val(), id: item_id }, function(data) {
                if (data > 0) {
                    $("#popUpBox input:submit").prop('disabled', true);
                    $($thisElm).addClass('error');
                } else {
                    $("#popUpBox input:submit").prop('disabled', false);
                    $($thisElm).removeClass('error');
                }
            });
        });
    };
    $.fn.numericOnly = function() {
        $(this).keydown(function(e) {
            if (e.keyCode == 46 || e.keyCode == 8 || e.keyCode == 9 ||
                e.keyCode == 27 || e.keyCode == 13 || e.keyCode == 190 || e.keyCode == 116 ||
                (e.keyCode == 65 && e.ctrlKey === true) ||
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                return true;
            } else {
                if (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                }
            }
        });
    };
    $.fn.numericFloatOnly = function() {
        $(this).keydown(function(e) {
            if (e.keyCode == 46 || e.keyCode == 8 || e.keyCode == 9 ||
                e.keyCode == 27 || e.keyCode == 13 || e.keyCode == 190 || e.keyCode == 110 ||
                (e.keyCode == 65 && e.ctrlKey === true) ||
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                return true;
            } else {
                if (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
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
        function() {
            $(this).parent().fadeTo(400, 0, function() { // Links with the class "close" will close parent
                $(this).slideUp(400);
            });
            return false;
        }
    );
    // Alternating table rows:
    $('tbody tr:even').addClass("alt-row"); // Add class "alt-row" to even table rows
    // Check all checkboxes when the one in a table head is checked:
    $('.check-all').click(
        function() {
            $(this).parent().parent().parent().parent().find("input[type='checkbox']").attr('checked', $(this).is(':checked'));
        }
    );
    $.fn.sumColumn = function(sumOfFeild, insertToFeild) {
        var sumAll = 0;
        $(sumOfFeild).each(function(index, element) {
            sumAll += parseFloat($(this).text());
        });
        $(insertToFeild).text(sumAll);
    };
    $.fn.sumColumnFloat = function(sumOfFeild, insertToFeild) {
        var sumAll = 0;
        $(sumOfFeild).each(function(index, element) {
            sumAll += parseFloat($(this).text()) || 0;
        });
        sumAll = Math.round(sumAll * 100) / 100;
        $(insertToFeild).text((sumAll).toFixed(2));
    };
    $.fn.multiplyTwoFeilds = function(multiplyToElmVal, writeProductToElm) {
        $(writeProductToElm).val($(this).val() * $(multiplyToElmVal).val());
    };
    $.fn.multiplyTwoFloats = function(multiplyToElmVal, writeProductToElm) {
        $(this).keyup(function(e) {
            var thisVal = parseFloat($(this).val()) || 0;
            var thatVal = parseFloat($(multiplyToElmVal).val()) || 0;
            var productVal = Math.round((thisVal * thatVal) * 100) / 100;
            $(writeProductToElm).val(productVal);
        });
    };
    $.fn.multiplyTwoFloatsCheckTax = function(multiplyToElmVal, writeProductToElm, writeProductToElmNoTax, taxAmountElm) {
        $(this).keyup(function(e) {

            var taxRate = parseFloat($("input.taxRate").val()) || 0;
            var taxType = ($(".taxType").is(":checked")) ? "I" : "E";
            var thisVal = parseFloat($(this).val()) || 0;
            var thatVal = parseFloat($(multiplyToElmVal).val()) || 0;
            var amount = Math.round((thisVal * thatVal) * 100) / 100;

            var cartonAmount = 0;
            if (use_cartons == 'Y'){
                var cartons             = parseFloat($("input.cartons").val())||0;
                var carton_rate         = parseFloat($("input.carton_rate").val())||0;
                cartonAmount = cartons * carton_rate;
                amount = amount + cartonAmount;
            }
            
            if (taxRate > 0) {
                if (taxType == 'I') {
                    taxAmount = amount * (taxRate / 100);
                    amount -= taxAmount;
                } else if (taxType == 'E') {
                    taxAmount = amount * (taxRate / 100);
                }

            } else {
                taxAmount = 0;
            }
            taxAmount = Math.round(taxAmount * 100) / 100;
            amount = Math.round(amount * 100) / 100;
            var finalAmount = Math.round((amount + taxAmount) * 100) / 100;
            $(taxAmountElm).val(taxAmount);
            $(writeProductToElm).val(finalAmount);
            $(writeProductToElmNoTax).val(amount);
        });
    };
    //inventory.php end
    $.fn.setFocusTo = function(Elm) {
        $(this).keydown(function(e) {
            if (e.keyCode == 13) {
                e.preventDefault();
                $(Elm).focus();
            }
        });
    };
    $.fn.getItemDetails = function() {
        
        var item_id = $(".itemSelector option:selected").val();
        if (item_id != '') {
            $.post('db/get-item-details.php', { p_item_id: item_id }, function(data) {
                data = $.parseJSON(data);
                var itemStock  = data['STOCK'];
                var itemPrice  = data['P_PRICE'];
                var qty_carton = data['QTY_PER_CARTON'];
                var rateCarton = data['RATE_CARTON'];

                if (typeof(itemPrice) == 'object') {
                    itemPrice = itemPrice['UNIT_PRICE'];
                }
                if (itemPrice == 0) {
                    itemPrice = '';
                }
                        
                $("input.carton_rate").val(rateCarton);
                $("input.unitPrice").val(itemPrice);
                $("input.initialRate").val(itemPrice);
                $("input.per_carton").val(qty_carton);
                $("input.inStock").attr('thestock', itemStock).val(itemStock);
            });
        }
    };
    $.fn.quickSave = function() 
    {
        var totalQuantity = 0;

        var medical_store_mode = $("input.batch_no").length;
        var item_id = $(".itemSelector option:selected").val();
        var item_name = $(".itemSelector option:selected").text();

        var splitExist = item_name.includes("~");
        if(splitExist == true){
            var item_name_array = item_name.split("~");
            item_name = item_name_array[0];
        }

        var qtyFormula = parseFloat($("input.qtyFormula").val())||0;
        var quantity = parseFloat($("input.quantity").val()) || 0;
        totalQuantity += quantity;
        var weight   = $("input.weight").val()||0;

        var initialRate = $("input.initialRate").val();
        var item_expense = $("input.item_expense").val();

        var unitPrice = $("input.unitPrice").val();
        
        if (config_description == 'Y') {
            var item_description = $("input.item_description").val();    
        }
        
        if (use_color == 'Y') {
            var color  = $("input.color").val();
        }

        if (use_cartons == 'Y') {
            var cartons = parseFloat($("input.cartons").val()) || 0;
            var carton_rate         = parseFloat($("input.carton_rate").val())||0;
            var per_carton = parseFloat($("input.per_carton").val()) || 0;
            var totalCartonAmount = cartons * carton_rate;
            subAmount = subAmount + totalCartonAmount;

            // totalQuantity for quantity validation
            totalQuantity =  totalQuantity + (cartons * per_carton);
        }
        
        var scheme  = parseFloat($("input.scheme").val())||0;
        

        var box             = parseFloat($("input.box").val())||0;
        var picesInBox      = parseFloat($("input.picesInBox").val())||0;

        
        if (use_milk_addon == 'Y') {
            var ltr = parseFloat($("input.ltr").val()) || 0;
            var fat = parseFloat($("input.fat").val()) || 0;
            var lr = parseFloat($("input.lr").val()) || 0;
            var snf = parseFloat($("input.snf").val()) || 0;
            var ts = parseFloat($("input.ts").val()) || 0;
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

        if (use_individual_discount == 'Y') {
            var discount = $("input.discount").val();
        }
        var freight = $("input.freight").val();
        var subAmount = $("input.totalAmount").attr('data-sub-amount');
        if (use_tax == 'Y') {
            var taxRate = parseFloat($("input.taxRate").val()) || 0;
            var taxAmount = $("input.taxAmount").val();
        }
        var totalAmount = parseFloat($("input.totalAmount").val()) || 0;
        if (medical_store_mode) {
            var batch_no = ($("input.batch_no").length) ? $("input.batch_no").val() : "";
            var expiry_date = ($("input.expiry_date").length) ? $("input.expiry_date").val() : "";
        }

        $(this).blur();

        if (taxRate == '' || taxRate == 0) {
            taxAmount = 0;
        }

        if(totalQuantity == 0){
            displayMessage('Quantity Missing!');
            return false;
        }
        if (item_id == '' || item_name == '' || totalAmount == '') {
            displayMessage('Value Missing!');
            return false;
        }
        var updateMode = $(".updateMode").length;
        
        if (updateMode == 0) {
            
            var the_row = '<tr class="alt-row calculations transactions" data-row-id="0"><td style="text-align:left;" class="itemName" data-item-id="' + item_id + '">' + item_name + '</td>';
            if (use_color == 'Y') {
                the_row += '<td class="color">' + color + '</td>';
            }
            if (config_description == 'Y') {
                the_row  += '<td class="text-center item_description">'+item_description+'</td>';
            }

            if (use_cartons == 'Y') {
                the_row  += '<td class="cartons">' + cartons + '</td>';
                the_row  += '<td class="carton_rate">'+carton_rate+'</td>';
                the_row  += '<td class="per_carton">' + per_carton + '</td>';
            }
            if (use_milk_addon == 'Y') {
                the_row  += '<td class="ltr">'+ltr+'</td>';
                the_row  += '<td class="fat">'+fat+'</td>';
                the_row  += '<td class="lr">'+lr+'</td>';
                the_row  += '<td class="snf">'+snf+'</td>';
                the_row  += '<td class="ts">'+ts+'</td>';
            }

            if (config_cubic == 'Y') {
                the_row  += '<td class="cubeLength">'+cubeLength+'</td>';
                the_row  += '<td class="cubeWidth">'+cubeWidth+'</td>';
                the_row  += '<td class="cubeHeight">'+cubeHeight+'</td>';
            }
            
            if (qtyFormula != '0') {
                the_row      += '<td class="qtyFormula">'+qtyFormula+'</td>';
            }

            if (config_w_h_cal == 'Y') {
                the_row  += '<td class="width">'+width+'</td>';
                the_row  += '<td class="height">'+height+'</td>';
                the_row  += '<td class="sq_feet">'+sq_feet+'</td>';
                the_row  += '<td class="pices">'+pices+'</td>';
            }

            the_row += '<td class="quantity">' + quantity + '</td>';
            
            if (scheme_config == 'Y') {
                the_row  += '<td class="scheme">'+scheme+'</td>';
            }

            if (weight_addon == 'Y') {
                the_row += '<td class="weight">' + weight + '</td>';
            }

            if(use_tiles=='Y'){
                the_row  += '<td class="box">'+box+'</td>';
                the_row  += '<td class="picesInBox">'+picesInBox+'</td>';
            }               

            
            if(config_pur_item_exp=='Y'){
                the_row += '<td class="initialRate">' + initialRate + '</td>';
                the_row += '<td class="item_expense">' + item_expense + '</td>';
            }
            
            the_row += '<td class="unitPrice">' + unitPrice + '</td>';

            if (use_individual_discount == 'Y') {
                the_row += '<td  class="discount">' + discount + '</td>';
            }

            if (!medical_store_mode && use_tax == 'Y') {
                // the_row += '<td class="subAmount">' + subAmount + '</td>';
            }
            if (use_tax == 'Y') {
                the_row += '<td class="taxRate">' + taxRate + '</td><td class="taxAmount">' + parseFloat(taxAmount,2) + '</td>';
            }
            if(use_freight == 'Y'){
                the_row += '<td class="freight">' + freight + '</td>';
            }

            the_row += '<td class="totalAmount" data-sub-amount="' + subAmount + '">' + totalAmount + '</td>';
            if (medical_store_mode) {
                the_row += '<td class="batch_no">' + batch_no + '</td>';
                the_row += '<td class="expiry_date">' + expiry_date + '</td>';
            }
            the_row += '<td style="text-align:center;"> - - - </td><td style="text-align:center;"><a id="view_button" onClick="editThisRow(this);" title="Update"><i class="fa fa-pencil"></i></a><a class="pointer" do="" title="Delete" onclick="$(this).parent().parent().remove();"><i class="fa fa-times"></i></a></td></tr>';

            $(the_row).insertAfter($(".calculations").last());
        } else if (updateMode == 1) {
            
            $(".updateMode").find('td.itemName').text(item_name);
            $(".updateMode").find('td.itemName').attr('data-item-id', item_id);

            if (config_description == 'Y') {
                $(".updateMode").find('td.item_description').text(item_description);
            }
            if (use_cartons == 'Y') {
                $(".updateMode").find('td.cartons').text(cartons);
                $(".updateMode").find('td.carton_rate').text(carton_rate);
                $(".updateMode").find('td.per_carton').text(per_carton);
            }
            if (use_tiles == 'Y') {
                $(".updateMode").find('td.box').text(box);
                $(".updateMode").find('td.picesInBox').text(picesInBox);
            }
            if (use_milk_addon == 'Y') {
                $(".updateMode").find('td.ltr').text(ltr);
                $(".updateMode").find('td.fat').text(fat);
                $(".updateMode").find('td.lr').text(lr);
                $(".updateMode").find('td.snf').text(snf);
                $(".updateMode").find('td.ts').text(ts);
            }
            if (config_cubic == 'Y') {
                $(".updateMode").find('td.cubeLength').text(cubeLength);
                $(".updateMode").find('td.cubeWidth').text(cubeWidth);
                $(".updateMode").find('td.cubeHeight').text(cubeHeight);
            }

            if (config_w_h_cal == 'Y') {
                $(".updateMode").find('td.width').text(width);
                $(".updateMode").find('td.height').text(height);
                $(".updateMode").find('td.sq_feet').text(sq_feet);
                $(".updateMode").find('td.pices').text(pices);
            }

            $(".updateMode").find('td.quantity').text(quantity);
            $(".updateMode").find('td.scheme').text(scheme);

            $(".updateMode").find('td.weight').text(weight);
            $(".updateMode").find('td.unitPrice').text(unitPrice);
            if (use_individual_discount == 'Y') {
                $(".updateMode").find('td.discount').text(discount);
            }
            // $(".updateMode").find('td.subAmount').text(subAmount);
            $(".updateMode").find('td.taxRate').text(taxRate);
            $(".updateMode").find('td.taxAmount').text(taxAmount);
            $(".updateMode").find('td.totalAmount').text(totalAmount);
            $(".updateMode").find('td.totalAmount').attr('data-sub-amount', subAmount);
            $(".updateMode").find('td.batch_no').text(batch_no);
            $(".updateMode").find('td.expiry_date').text(expiry_date);
            $(".updateMode").removeClass('updateMode');
        }
        $(this).clearPanelValues();
        $(this).calculateColumnTotals();

        // CODE FOR INITIAL RATE
        $(this).calculateInitialRateSum();
        $("select.itemSelector").parent().find(".dropdown-toggle").focus();
    };

    $.fn.calculateColumnTotals = function() {
        // alert('calculateColumnTotals');
        var discount_type = $("input.discount_type:checked").val();
        $(this).sumColumnFloat("td.cartons", "td.carton_total");
        $(this).sumColumnFloat("td.quantity", "td.qtyTotal");
        $(this).sumColumnFloat("td.unitPrice", "td.price_total");
        $(this).sumColumnFloat("td.taxAmount", "td.amountTax");
        $(this).sumColumnFloat("td.freight", "td.freight_total");
        // $(this).sumColumnFloat("td.subAmount", "td.amountSub");
        $(this).sumColumnFloat("td.totalAmount", "td.amountTotal");
        var amountTotal = parseFloat($("td.amountTotal").text()) || 0;

        var tax_amount_total = parseFloat($("td.amountTax").text()) || 0;
        $(".whole_tax").val(tax_amount_total);

        var disk = 0;
        var rate = 0;
        var qty = 0;
        var sub = 0;
        if (discount_type == 'R') {
            $("td.discount").each(function() {
                disk += parseFloat($(this).text()) || 0;
            });
        } else {
            var dit = 0;
            $("tr.transactions").each(function() {
                qty = parseFloat($(this).find("td.quantity").text()) || 0;
                rate = parseFloat($(this).find("td.unitPrice").text()) || 0;
                dit = parseFloat($(this).find("td.discount").text()) || 0;

                disk += parseFloat(((qty * rate * dit) / 100)) || 0;
            });
        }

        var discount_amount = parseFloat($("input.whole_discount").val()) || 0;
        //if(discount_type == 'P'){
        //	discount_amount = (amountTotal*discount_amount) / 100;
        //}
        //$("input.bildiscountamount").val(discount_amount);
        //amountTotal -= discount_amount;

        $("input.total_discount").val((disk).toFixed(2));
        var withholdingTaxPercent = parseFloat($("input.withholdingTaxPercent").val()) || 0;
        withholdingTaxPercent = (amountTotal * withholdingTaxPercent) / 100;
        $("input.withholdingTaxAmount").val((Math.round(withholdingTaxPercent)).toFixed(2));

        var charges = parseFloat($("input.inv_charges").val()) || 0;
        // amountTotal += charges;
        amountTotal += withholdingTaxPercent;
        $("input.grand_total").val((Math.round(amountTotal)).toFixed(2));

        // AMOUNT IN WORDS
        if(amountTotal > 0)
        {
            amountInWords = toWords(amountTotal);
            amountInWords = amountInWords.slice(0,1).toUpperCase() + amountInWords.slice(1) + "only";
            $(".amountInWords").text("RUPEES: "+amountInWords);
            $(".amountInWords").css('padding','10px');
        }else{
            $(".amountInWords").css('padding','0px');
        }

    };
    $.fn.calculateRowTotal = function() {
        
        var taxRate = $("input.taxRate").val();
        var taxType = ($(".taxType").is(":checked")) ? "I" : "E";

        // alert(taxType+"/"+taxRate);
        
        var thisVal = parseFloat($("input.quantity").val()) || 0;
        var thatVal = parseFloat($("input.unitPrice").val()) || 0;
        var subAmount = parseFloat(thisVal * thatVal);
        var discountAvail = parseFloat($("input.discount").val()) || 0;
        var discount_type = $("input.discount_type:checked").val();
        var freight = parseFloat($("input.freight").val()) || 0;

        // alert('freight='+freight);
        
        var cartonAmount = 0;
        if (use_cartons == 'Y'){
            var cartons             = parseFloat($("input.cartons").val())||0;
            var carton_rate         = parseFloat($("input.carton_rate").val())||0;
            cartonAmount = cartons * carton_rate;
            subAmount = subAmount + cartonAmount;
        }

        var discountPerCentage = 0;
        // subAmount = Math.round(subAmount * 100) / 100;

        if (discount_type == 'R') {
            discountPerCentage = discountAvail;
        } else if (discount_type == 'P') {
            // discountAvail = Math.round(discountAvail * 100) / 100;
            discountPerCentage = subAmount * (discountAvail / 100);
            // discountPerCentage = Math.round(discountPerCentage * 100) / 100;
        }
        subAmount -= discountPerCentage;
        
        if (taxRate > 0) {
            taxAmount = parseFloat(taxAmount);
            if(config_tax_type == 'P'){
                taxAmount = subAmount * (taxRate / 100);
            }else if(config_tax_type == 'R'){
                taxAmount = taxRate;
            }
            
        } else {
            taxAmount = 0;
        }
        taxAmount = parseFloat(taxAmount);
        // taxAmount = taxAmount.toFixed(2);

        // alert('taxAmount='+taxAmount);
        //taxAmount = Math.round(taxAmount * 100) / 100;
        //subAmount = Math.round(subAmount * 100) / 100;
        // var finalAmount = Math.round((subAmount + taxAmount) * 100) / 100;

        var finalAmount = parseFloat(subAmount) + parseFloat(taxAmount);
        // alert('finalAmount='+finalAmount);
        // finalAmount = Math.round(finalAmount * 100) / 100;

        // freight value detect
        finalAmount = finalAmount + parseFloat(freight);
        // alert('amount='+finalAmount);
        
        // $("input.subAmount").val(subAmount);
        $("input.totalAmount").attr('data-sub-amount', subAmount);

        taxAmount = parseFloat(taxAmount).toFixed(2);
        // $("input.taxAmount").val(taxAmount);
        $("input.taxAmount").val(taxAmount);
        $("input.totalAmount").val(finalAmount);
    };
    $.fn.updateStockInHand = function() {
        var stockOfBill = 0;
        $("td.quantity").each(function(index, element) {
            stockOfBill += parseFloat($(this).text()) || 0;
        });
        stockOfBill += parseFloat($("input.quantity").val()) || 0;
    };
    $.fn.clearPanelValues = function() {
        $(".itemSelector option").prop('selected', false);
        $(".itemSelector").find("option").first().prop('selected', true);
        $(".itemSelector").selectpicker('refresh');
        $("input.color").val('');
        $("input.item_description").val('');
        $("input.cartons").val('');
        $("input.carton_rate").val('');
        $("input.per_carton").val('');
        $("input.ltr").val('');
        $("input.fat").val('');
        $("input.lr").val('');
        $("input.snf").val('');
        $("input.ts").val('');
        $("input.color").val('');
        $("input.cubeLength").val('');
        $("input.cubeWidth").val('');
        $("input.cubeHeight").val('');
        $("input.qtyFormula").val('');
        $("input.quantity").val('');
        $("input.scheme").val('');
        $("input.weight").val('');
        $("input.box").val('');
        $("input.picesInBox").val('');
        $("input.initialRate").val('');
        $("input.item_expense").val('');
        $("input.unitPrice").val('');
        $("input.discount").val('');
        $("input.freight").val('');
        $("input.taxRate").val('');

        if(config_w_h_cal=='Y'){
            $("input.width").val('');
            $("input.height").val('');
            $("input.sq_feet").val('');
            $("input.pices").val('');
        }

        // $("input.subAmount").val('');
        $("input.taxAmount").val('');
        $("input.totalAmount").val('');
        $("input.batch_no").val('');
        $("input.expiry_date").val('');
        $("input.inStock").val('').attr('thestock', '');
    };

    $.fn.getAccountBalance = function(){
        var acc_code = $("select.supplierSelector option:selected").val();
        $.post("db/get-account-balance.php",{supplierAccCode:acc_code},function(data){
            data = $.parseJSON(data);
            $("input.customer-balance").val(data['AMOUNT']);
            $("input.customer-balance-top").val(data['AMOUNT']);
        });
    }

    $.fn.calculateInitialRate = function() {

        var quantity = $(".quantity").val();
        var initialRate = $(".initialRate").val();
        var item_expense = $(".item_expense").val();

        if(item_expense == ''){
            $(".unitPrice").val(initialRate);
            return;
        }

        var finalRate = parseFloat(item_expense) / parseFloat(quantity);

        if(finalRate == 0){
            return;
        }
        finalRate = parseFloat(finalRate) + parseFloat(initialRate);
        $(".unitPrice").val(finalRate);

    }

    $.fn.calculateInitialRateSum = function() {

        var sumExp = 0;
        $("td.item_expense").each(function(index, element) {
            var val = $(this).html();
            sumExp = parseFloat(sumExp) + parseFloat(val);
        });
        $(".inv_charges_by_other").val(sumExp);
    }

});

    


var use_cartons = '';
var use_tax = '';
// PreLoad FUNCTION //
//////////////////////
var letMeGo = function(thisElm) {
    $(thisElm).fadeOut(300, function() {
        $(this).html('');
    });
}
var editThisRow = function(thisElm) {
    
    var thisRow = $(thisElm).parent('td').parent('tr');
    $(".updateMode").removeClass('updateMode');
    thisRow.addClass('updateMode');

    var item_name = thisRow.find('td.itemName').text();
    var item_id = parseInt(thisRow.find('td.itemName').attr('data-item-id')) || 0;
    
    var item_description = thisRow.find('td.item_description').text();

    var cartons = parseFloat(thisRow.find('td.cartons').text()) || 0;
    var carton_rate = parseFloat(thisRow.find('td.carton_rate').text()) || 0;
    var per_carton = parseFloat(thisRow.find('td.per_carton').text()) || 0;
    var box = parseFloat(thisRow.find('td.box').text()) || 0;
    var picesInBox = parseFloat(thisRow.find('td.picesInBox').text()) || 0;

    var ltr = parseFloat(thisRow.find('td.ltr').text()) || 0;
    var fat = parseFloat(thisRow.find('td.fat').text()) || 0;
    var lr = parseFloat(thisRow.find('td.lr').text()) || 0;
    var snf = parseFloat(thisRow.find('td.snf').text()) || 0;
    var ts = parseFloat(thisRow.find('td.ts').text()) || 0;

    var color           = thisRow.find('td.color').text();

    var cubeLength      = thisRow.find('td.cubeLength').text();
    var cubeWidth       = thisRow.find('td.cubeWidth').text();
    var cubeHeight      = thisRow.find('td.cubeHeight').text();

    var width           = thisRow.find('td.width').text();
    var height          = thisRow.find('td.height').text();
    var sq_feet         = thisRow.find('td.sq_feet').text();
    var pices           = thisRow.find('td.pices').text();

    var quantity        = parseFloat(thisRow.find('td.quantity').text()) || 0;
    var scheme          = thisRow.find('td.scheme').text();

    var weight          = parseFloat(thisRow.find('td.weight').text()) || 0;

    var initialRate = parseFloat(thisRow.find('td.initialRate').text()) || 0;
    var item_expense = parseFloat(thisRow.find('td.item_expense').text()) || 0;
    var unitPrice = parseFloat(thisRow.find('td.unitPrice').text()) || 0;

    var discount = parseFloat(thisRow.find('td.discount').text()) || 0;
    var subAmount = parseFloat(thisRow.find('td.totalAmount').attr('data-sub-amount')) || 0;
    var taxRate = parseFloat(thisRow.find('td.taxRate').text()) || 0;
    var taxAmount = parseFloat(thisRow.find('td.taxAmount').text()) || 0;
    var freight = parseFloat(thisRow.find('td.freight').text()) || 0;
    var totalAmount = parseFloat(thisRow.find('td.totalAmount').text()) || 0;
    var batch_no = thisRow.find('td.batch_no').text();
    var expiry_date = thisRow.find('td.expiry_date').text();
    

    $(".itemSelector option[value='" + item_id + "']").prop('selected', true);
    $(".itemSelector").selectpicker('refresh');
    
    $("input.item_description").val(item_description);
    $("input.cartons").val(cartons);
    $("input.carton_rate").val(carton_rate);
    $("input.per_carton").val(per_carton);
    $("input.box").val(box);
    $("input.picesInBox").val(picesInBox);

    $("input.ltr").val(ltr);
    $("input.fat").val(fat);
    $("input.lr").val(lr);
    $("input.snf").val(snf);
    $("input.ts").val(ts);

    $("input.color").val(color);

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
    $("input.scheme").val(scheme);

    $("input.weight").val(weight);

    $("input.unitPrice").val(unitPrice);
    $("input.discount").val(discount);
    // $("input.subAmount").attr('data-sub-amount',subAmount);//.val(subAmount);
    $("input.taxRate").val(taxRate);
    $("input.taxAmount").val(taxAmount);
    $("input.totalAmount").val(totalAmount);
    $("input.freight").val(freight);
    $("input.totalAmount").attr('data-sub-amount', subAmount);
    $("input.batch_no").val(batch_no);
    $("input.expiry_date").val(expiry_date);
    $("input.inStock").val('').attr('thestock', '');
    $("div.itemSelector button").focus();
};
var stockOs = function() {
    
    var thisQty = parseFloat($("input.quantity").val()) || 0;
    var inStock = parseFloat($("input.inStock").attr('thestock')) || 0;

    var thisBillQuantity = 0;

    var item_id = parseFloat($("select.itemSelector option:selected").val()) || 0;

    $("td.quantity").each(function(index, element) {
        if (item_id == parseFloat($(this).prev("td.itemName").attr('data-item-id')) || 0) {
            thisBillQuantity += parseFloat($(this).text()) || 0;
        }
    });
    if ($("tr.updateMode").length) {
        thisBillQuantity -= parseFloat($("tr.updateMode td.quantity").text()) || 0;
    }
    var NewStock = thisQty + inStock;
    NewStock += thisBillQuantity;

    $("input.inStock").val(NewStock);
};

var savePurchase = function() 
{
    var purchase_id       = $(".purchase_id").val();
    var purchaseDate      = $(".purchaseDate").val();
    var recoveryDate      = $(".recoveryDate").val();
    var billNum           = $("input[name='billNum']").val();
    var vendorBillNum     = $("input[name='vendorBillNum']").val();
    var po_number         = $("input[name='po_number']").val();
    var gp_num            = $("input[name='gpNum']").val();
    var batch_no          = ($("input[name='batch_no']").length == 1) ? $("input[name='batch_no']").val() : "";
    var inv_notes         = $("textarea.inv_notes").val();
    var supplierCode      = $("select.supplierSelector option:selected").val();
    var supplier_name     = $("input[name='supplier_name']").val();
    var discount          = $("input.bildiscountamount").val();
    var total_discount    = $("input.total_discount").val();
    var charges           = $("input.inv_charges").val();
    var inv_charges_by_us = $("input.inv_charges_by_us").val();
    var inv_charges_by_other = $("input.inv_charges_by_other").val();
    var disc_type         = $("input.discount_type:checked").val();
    var withholdingTaxPercent = parseFloat($("input.withholdingTaxPercent").val()) || 0;
    var withholdingTaxAmount = parseFloat($("input.withholdingTaxAmount").val()) || 0;

    var unregistered_tax  = $("input.unregistered_tax:checked").length > 0 ? "Y" : "N";
    var tax_invoice         = $("input.tax_invoice:checked").length > 0 ? "Y" : "N";
    var registered_tax      = $("input.registered_tax:checked").length > 0 ? "Y" : "N";

    var subject           = $("input[name=subject]").val();
    var grand_total       = $("input.grand_total").val();
    var purchase_commission = $("input.purchase_commission").val();
    
    var config_pnl_date   = $("input.config_pnl_date").val();

    var orderNo         = $("input.orderNo").val();
    var biltyDate       = $("input.biltyDate").val();
    var biltyNo         = $("input.biltyNo").val();
    var transporterName = $("input.transporterName").val();

    var field_1         = $("input.field_1").val();
    var field_2         = $("input.field_2").val();
    var location_id     = $("select.location_id").val()||'0';

    var agent_acc_code  = $("select.agentSelector option:selected").val()||'';
    var agent_amount    = $("input.agent_amount").val()||'0';


    var purchaseDateProcess = purchaseDate.split("-");
    purchaseDate = purchaseDateProcess[2]+"-"+purchaseDateProcess[1]+"-"+purchaseDateProcess[0];
    if(new Date(purchaseDate) <= new Date(config_pnl_date)){
        displayMessage('Purchase Date must be grater then date '+config_pnl_date);
        return;
    }
        
    var over_discount     = 0;
    if (supplierCode == '') {
        displayMessage('Account Not Selected!');
        return false;
    }
    if($("tr.transactions").length == 0){
        displayMessage('No Transaction Found!');
        return false;
    }
    $(".savePurchase").hide();
    $("#xfade").show();
    var jSonString = {};
    var deleted    = {};
    $("input.delete_rows").each(function(i, e) {
        deleted[i] = $(this).val();
    });
    deleted = JSON.stringify(deleted);
    var medical_store_mode = $("input.batch_no").length;
    
    $("tr.transactions").each(function(index, element) {

        
        var rowId = $(this).attr('data-row-id');
        jSonString[index] = {};
        jSonString[index].row_id = rowId;
        jSonString[index].item_id = parseInt($(this).find('td.itemName').attr('data-item-id')) || 0;
        jSonString[index].item_title = $(this).find('td.itemName').text();
        jSonString[index].colors = $(this).find('td.color').text();
        jSonString[index].item_description = $(this).find('td.item_description').text();
        jSonString[index].box = parseFloat($(this).find('td.box').text()) || 0;
        jSonString[index].picesInBox = parseFloat($(this).find('td.picesInBox').text()) || 0;

        jSonString[index].ltr = parseFloat($(this).find('td.ltr').text()) || 0;
        jSonString[index].fat = parseFloat($(this).find('td.fat').text()) || 0;
        jSonString[index].lr = parseFloat($(this).find('td.lr').text()) || 0;
        jSonString[index].snf = parseFloat($(this).find('td.snf').text()) || 0;
        jSonString[index].ts = parseFloat($(this).find('td.ts').text()) || 0;

        jSonString[index].cubeLength  = parseFloat($(this).find('td.cubeLength').text()) || 0;
        jSonString[index].cubeWidth   = parseFloat($(this).find('td.cubeWidth').text()) || 0;
        jSonString[index].cubeHeight  = parseFloat($(this).find('td.cubeHeight').text()) || 0;

        jSonString[index].qtyFormula = $(this).find('td.qtyFormula').text();
        
        jSonString[index].widthh   = parseFloat($(this).find('td.width').text()) || 0;
        jSonString[index].heightt  = parseFloat($(this).find('td.height').text()) || 0;
        jSonString[index].sq_feet  = parseFloat($(this).find('td.sq_feet').text()) || 0;
        jSonString[index].pices    = parseFloat($(this).find('td.pices').text()) || 0;


        jSonString[index].quantity = parseFloat($(this).find('td.quantity').text()) || 0;
        jSonString[index].schemes  = $(this).find('td.scheme').text();

        jSonString[index].weight = parseFloat($(this).find('td.weight').text()) || 0;

        jSonString[index].cartons = parseFloat($(this).find('td.cartons').text()) || 0;
        jSonString[index].carton_rate = parseFloat($(this).find('td.carton_rate').text()) || 0;
        jSonString[index].per_carton = parseFloat($(this).find('td.per_carton').text()) || 0;

        jSonString[index].initialRate = parseFloat($(this).find('td.initialRate').text()) || 0;
        jSonString[index].item_expense = parseFloat($(this).find('td.item_expense').text()) || 0;
        jSonString[index].unitPrice = parseFloat($(this).find('td.unitPrice').text()) || 0;

        jSonString[index].discount = parseFloat($(this).find('td.discount').text()) || 0;
        jSonString[index].subAmount = parseFloat($(this).find('td.totalAmount').attr('data-sub-amount')) || 0;
        jSonString[index].taxRate = parseFloat($(this).find('td.taxRate').text()) || 0;
        jSonString[index].taxAmount = parseFloat($(this).find('td.taxAmount').text()) || 0;
        jSonString[index].freight = parseFloat($(this).find('td.freight').text()) || 0;
        jSonString[index].totalAmount = parseFloat($(this).find('td.totalAmount').text()) || 0;
        if (medical_store_mode) {
            jSonString[index].batch_no = $(this).find('td.batch_no').text();
            jSonString[index].expiry_date = $(this).find('td.expiry_date').text();
        }
    });
    jSonString = JSON.stringify(jSonString);

    //console.log(jSonString);
    //return;

    $.post("db/savePurchase.php",{
        purchase_id: purchase_id,
        purchaseDate: purchaseDate,
        recoveryDate:recoveryDate,
        billNum: billNum,
        vendorBillNum: vendorBillNum,

        orderNo: orderNo,
        biltyDate: biltyDate,
        biltyNo: biltyNo,
        transporterName: transporterName,

        po_number: po_number,
        gp_num: gp_num,
        batch_no: batch_no,
        supplierCode: supplierCode,
        supplier_name: supplier_name,
        subject: subject,
        inv_notes: inv_notes,
        discount: discount,
        total_discount: total_discount,
        charges: charges,
        inv_charges_by_us:inv_charges_by_us,
        inv_charges_by_other:inv_charges_by_other,
        disc_type: disc_type,
        withholdingTaxPercent: withholdingTaxPercent,
        withholdingTaxAmount: withholdingTaxAmount,
        // unregistered_tax: unregistered_tax,
        tax_invoice: tax_invoice,
        registered_tax: registered_tax,
        deleted_rows: deleted,
        grand_total: grand_total,
        purchase_commission:purchase_commission,
        field_1:field_1,
        field_2:field_2,
        agent_acc_code:agent_acc_code,
        agent_amount:agent_amount,
        location_id:location_id,
        jSonString: jSonString
    }, function(data) {
        data = $.parseJSON(data);
        if (data['ID'] > 0) {
            var msg_type = '';
            if(purchase_id == 0){
                msg_type = "&saved";
            }else{
                msg_type = "&updated";
            }
            if(print_method == 'Y'){
                print_opt = "&print"
            }
            // window.location.href='purchase-details.php?id=' + data['ID'] + msg_type + print_opt;
            window.location.href='purchase-details.php?'+msg_type;

        }else{
            $("#xfade").hide();
            displayMessage(data['MSG']);
        }
    });
};
var delete_detail_row = function(rowChildElement) {
    var row_id = $(rowChildElement).parent().parent().attr("data-row-id");
    var clickedDel = $(rowChildElement);

    if ($(rowChildElement).parent().parent().hasClass('updateMode')) {
        displayMessage('Row Is In Edit Mode!');
        return false;
    }

    $("#fade").hide();
    $("#popUpDel").remove();
    $("body").append("<div id='popUpDel'><p class='confirm'>Do you Really want to Delete?</p><a class='dodelete btn btn-danger'>Delete</a><a class='nodelete btn btn-info'>Cancel</a></div>");
    $("#popUpDel").hide();
    $("#popUpDel").centerThisDiv();
    $("#fade").fadeIn('slow');
    $("#popUpDel").fadeIn();
    $(".dodelete").click(function() {
        $("#popUpDel").children(".confirm").text('Row Deleted Successfully!');
        $("#popUpDel").children(".dodelete").hide();
        $("#popUpDel").children(".nodelete").text("Close");
        $("div.underTheTable").append('<input class="delete_rows" type="hidden" value="' + row_id + '" />');
        clickedDel.parent().parent().remove();
    });
    $(".nodelete").click(function() {
        $("#fade").fadeOut();
        $("#popUpDel").fadeOut();
    });
    $(".close_popup").click(function() {
        $("#popUpDel").slideUp();
        $("#fade").fadeOut('fast');
    });
};
var makeItCash = function(checker) {
    var what = $(checker).is(":checked");
    if (what) {
        $("select.supplierSelector option[value^='040101']").prop('disabled', true).prop('selected', false);
        $("select.supplierSelector option[value^='010101']").prop('disabled', false).prop('selected', false);
        $("select.supplierSelector").selectpicker('refresh');
        $("input[name='supplier_name']").show().focus();
        $("input.inv_charges").val('');
        $(this).calculateColumnTotals();
        $("div.deliveryPanel").hide();
    } else {
        $("select.supplierSelector option[value^='040101']").prop('disabled', false).prop('selected', false);
        $("select.supplierSelector option[value^='010101']").prop('disabled', true).prop('selected', false);
        $("select.supplierSelector").selectpicker('refresh');
        $("input[name='supplier_name']").val('').hide();
        $("div.deliveryPanel").show();
    }
};
var hidePopUpBox = function() {
    $("#popUpBox").css({ 'transform': 'scaleY(0.0)' });
    $("#xfade").fadeOut();
    $("#popUpBox").remove();
};
var add_supplier = function() {
    $("body").append("<div id='popUpBox'></div>");
    var formContent = '';
    formContent += '<button class="btn btn-danger btn-xs pull-right" onclick="hidePopUpBox();"><i class="fa fa-times"></i></button>';
    formContent += '<div id="form">';
    formContent += '<p>New Supplier Title:</p>';
    formContent += '<p class="textBoxGo">';
    formContent += '<input type="text" class="form-control categoryName" />';
    formContent += '</p>';
    formContent += '</div>';
    $("#popUpBox").append(formContent);
    $("#xfade").fadeIn();
    $("#popUpBox").fadeIn('200').centerThisDiv();
    $(".categoryName").focus();
    var disabled = '';
    disabled = ($(".trasactionType").is(":checked")) ? "disabled" : "";
    $(".categoryName").keyup(function(e) {
        var name = $(".categoryName").val();
        if (e.keyCode == 13) {
            $(".categoryName").blur();
            if (name != '') {
                $.post('supplier-details.php', { supp_name: name }, function(data) {
                    data = $.parseJSON(data);
                    if (data['OK'] == 'Y') {
                        $("select.supplierSelector").append('<option ' + disabled + ' data-subtext="' + data['ACC_CODE'] + '" value="' + data['ACC_CODE'] + '">' + data['ACC_TITLE'] + '</option>');
                        if (!$(".trasactionType").is(":checked")) {
                            $("select.supplierSelector option:selected").prop('selected', false);
                            $("select.supplierSelector option").last().prop('selected', true);
                        }
                        $("select.supplierSelector").selectpicker('refresh');
                        hidePopUpBox();
                    } else if (data['OK'] == 'N') {
                        displayMessage('New Supplier Could Not be Created!');
                    }
                });
            }
        }
    });
};
var add_new_item_submit = function() {
    var formData = $("#popUpBox form").serializeObject();
    $.post('item-details.php', formData, function(data) {
        hidePopUpBox();
        $(".reload_item").click();
    });
};
var add_new_item = function() {
    $("body").append('<div id="popUpBox"><button class="btn btn-danger btn-xs pull-right" onclick="hidePopUpBox();"><i class="fa fa-times"></i></button></div>');
    $("#popUpBox").append('<form action="" method="post"></form>');
    $.get('item-details.php', {}, function(html) {
        var formContent = $(html).find(".popup_content_nostyle").html();
        formContent += $(html).find(".form-submiters").html();
        $("#popUpBox form").append(formContent);
        $("#popUpBox form").append('<input name="addItem" type="hidden" />');
        $("#popUpBox .popuporemov").remove();
        $("#popUpBox .selectpicker").remove();
        $("#popUpBox input:submit").addClass("prop_item_submit");
        $("#popUpBox .prop_item_submit").prop('type', 'button');
        $("#popUpBox .prop_item_submit").click(function() {
            add_new_item_submit();
        });
        $("#popUpBox select").selectpicker();
        $("#popUpBox input.item-barcode").barcodeAvailable();
        $("#xfade").fadeIn();
        $("#popUpBox").fadeIn('200').centerThisDiv();
    });
};
var discount_type_change = function(thiss) {
    var this_val = $(thiss).val();
    if ($("tr.transactions").length) {
        return false;
    }
    if(this_val=='P'){
        $(".discountTypeTitle").html('Discount %');
    }else{
        $(".discountTypeTitle").html('Discount Rs.');
    }

    $.get('sale-details.php', { discount: this_val });
};
var get_history = function(){
  var item_id = parseInt($("select.itemSelector option:selected").val())||0;
  // var code    = '';
  // if(!$("input.trasactionType").is(":checked")){
    var code    = $("select.supplierSelector option:selected").val();
  // }
  if(item_id==0){
    return;
  }
  $("div.itemSelector").popover('destroy');
  var elm = '';
  $.post("?",{get_history:item_id,account_code:code},function(data){
    data = $.parseJSON(data);
    if(data!=null){
      $.each(data,function(i,v){
        if(i>0){
          elm += '<span class="divider"></span>';
        }
        elm += '<p style="font-size: 12px ;"><b>Date</b> '+v.PURCHASE_DATE+' <b>Cost</b> '+v.UNIT_PRICE+'</p>';
      });
    }else{
      elm += '<span class="divider">No Results.</span>';
    }
    setTimeout(function(){
      $("div.itemSelector").popover({html:true,content:elm});
      $("div.itemSelector").popover('show');
    },300);
  });
};

var calculateBoxPiecesInBox = function(){

    var item_id    = $("select.itemSelector option:selected").val();
    var quantity = $(".quantity").val();


    $.post('db/get-item-details.php',{get_tiles_info:'yes',itemId:item_id},function(data){
          data = $.parseJSON(data);

          var box = (quantity/data['METERS']).toFixed(2);
          var pices = (box*data['PIECES']).toFixed(2);

          
          $(".box").val(box);
          $(".picesInBox").val(pices);
    });
}
