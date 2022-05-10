$(document).ready(function() {
    $(window).load(function() {
        $('[data-toggle="tooltip"]').tooltip();
    });
    $(".h3_php_error").click(function() {
        $(".h3_php_error").fadeOut('slow');
    });
    var fileSelf = $(".this_file_name").val();
    $("#main-nav li a.nav-top-item.no-submenu[href='" + fileSelf + "']").addClass('current');
    $("#main-nav li a.nav-top-item").next("ul").find('li').find("a[href='" + fileSelf + "']").addClass("current").parent().parent().prev("a.nav-top-item").addClass("current");
    $("#main-nav li ul").hide();
    $("#main-nav li a.current").parent().find("ul").show();
    $("#main-nav li a.nav-top-item").click(
        function() {
            $(this).toggleClass('submenu-open');
            $(this).parent().siblings().find("ul").slideUp("normal");
            $(this).next().slideToggle("normal");
        }
    );
    $("input.datepicker").datepicker({
        dateFormat: 'dd-mm-yy',
        showAnim: 'show',
        changeMonth: true,
        changeYear: true,
        yearRange: '2000:+10'
    });
    $("#main-nav li .nav-top-item").addClass("hvr-underline-from-center");
    $("#main-nav li .nav-top-item").hover(
        function() {
            //$(this).stop().animate({ paddingRight: "25px" }, 200);
        },
        function() {
            //$(this).stop().animate({ paddingRight: "15px" });
        }
    );
    $(".content-box-header h3").css({ "cursor": "default" });
    $(".closed-box .content-box-content").hide();
    $(".closed-box .content-box-tabs").hide();
    $.fn.numericInputOnly = function() {
        $(this).keydown(function(e) {
            if (e.keyCode == 46 || e.keyCode == 8 || e.keyCode == 9 ||
                e.keyCode == 27 || e.keyCode == 13 || e.keyCode == 120 || e.keyCode == 110 ||
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
    $.fn.numericOnly = function() {
        $(this).keydown(function(e) {
            if (e.keyCode == 46 || e.keyCode == 8 || e.keyCode == 9 ||
                e.keyCode == 27 || e.keyCode == 13 || e.keyCode == 190 || e.keyCode == 116 || e.keyCode == 110 ||
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
    $('.content-box .content-box-content div.tab-content').hide();
    $('ul.content-box-tabs li a.default-tab').addClass('current');
    $('.content-box-content div.default-tab').show();
    $('.content-box ul.content-box-tabs li a').click(
        function() {
            $(this).parent().siblings().find("a").removeClass('current');
            $(this).addClass('current');
            var currentTab = $(this).attr('href');
            $(currentTab).siblings().hide();
            $(currentTab).show();
            return false;
        }
    );
    $(".close").click(
        function() {
            $(this).parent().fadeTo(400, 0, function() {
                $(this).slideUp(400);
            });
            return false;
        }
    );
    $('.check-all').click(
        function() {
            $(this).parent().parent().parent().parent().find("input[type='checkbox']").attr('checked', $(this).is(':checked'));
        }
    );
    $.fn.multiplyTwoFeilds = function(multiplyToElmVal, writeProductToElm) {
        $(writeProductToElm).val($(this).val() * $(multiplyToElmVal).val());
    };
    $.fn.sumColumn = function(showTotal) {
        var totalThaans = 0;
        $(this).each(function() {
            var rowVal = $(this).text().replace(/\-/g, "");
            rowVal = (rowVal.replace(/\s+/g, '') == "") ? 0 : rowVal.replace(/\s+/g, '');
            totalThaans += parseInt(rowVal);
            $(showTotal).text(totalThaans);
        });
    };
    $("input[type='text']").attr("autocomplete", "off");
    $.fn.setFocusTo = function(Elm) {
        $(this).keydown(function(e) {
            if (e.keyCode == 13) {
                if ($(this).val() == "") {
                    e.preventDefault();
                } else {
                    e.preventDefault();
                    $(Elm).focus();
                }
            }
        });
    };
    $.fn.getUnitPriceOfItem = function(insertPriceToElement) {
        var itemCode = $(this).val();
        $.post('db/get-unit-price.php', { itemCode: itemCode }, function(data) {
            data = $.parseJSON(data);
            var price = (data[0] == null) ? 0 : data[0];
            $(insertPriceToElement).val(price);
        });
    };
    $(function() {
        $(window).keyup(function(e) {
            if (e.keyCode == 27) {
                $("#popUpDel").slideUp();
                $("#xfade").fadeOut();
            }
        });
    });
    $.fn.delete_main_list_record = function(file) {
        var row_id = $(this).attr("do");
        var currentRow = $("tr[data-main-id='" + row_id + "']");
        var billNumbr = currentRow.find('td').first().text();
        $("#xfade").hide();
        $("#popUpDel").remove();
        $("body").append("<div id='popUpDel'><p class='confirm'>Confirm Delete?</p><a class='dodelete btn btn-danger btn-sm'>Confirm</a><a class='nodelete btn btn-default btn-sm'>Cancel</a></div>");
        $("#popUpDel").hide();
        $("#xfade").fadeIn();
        $("#popUpDel").centerThisDiv();
        $("#popUpDel .confirm").text("Are Sure you Want To Delete Bill # " + billNumbr + "?");
        $("#popUpDel").addClass('animate-while-showing').show();
        $("a.dodelete").click(function() {
            $(this).prop("disabled", true);
            $.post(file, { cid: row_id }, function(data) {
                data = $.parseJSON(data);
                if (data['OK'] == 'Y') {
                    $("tr[data-row-id='" + row_id + "']").slideUp();
                }
                displayMessage(data['MSG']);
                $("a.nodelete").trigger('click');
            });
        });
        $("a.nodelete").click(function() {
            $("#popUpDel").removeClass("animate-while-showing");
            $("#popUpDel").addClass("animate-while-hiding");
            setTimeout(function() {
                $("#popUpDel").remove();
                $("#xfade").removeClass("animate-while-hiding").hide();
            }, 200);
        });
    };
    $.fn.deleteRowDefault = function(file) {
        var idValue = $(this).attr("do");
        var clickedDel = $(this);
        $("#fade").hide();
        $("#popUpDel").remove();
        $("body").append("<div id='popUpDel'><p class='confirm'>Do you Really want to Delete?</p><a class='dodelete btn btn-danger'>Delete</a><a class='nodelete btn btn-info'>Cancel</a></div>");
        $("#popUpDel").hide();
        $("#popUpDel").centerThisDiv();
        $("#fade").fadeIn('slow');
        $("#popUpDel").fadeIn();
        $(".dodelete").click(function() {
            $.post(file, { id: idValue }, function(data) {
                data = $.parseJSON(data);
                $("#popUpDel").children(".confirm").text(data['MSG']);
                $("#popUpDel").children(".dodelete").hide();
                $("#popUpDel").children(".nodelete").text("Close");
                if (data['OKAY'] == 'Y') {
                    clickedDel.parent('td').parent('tr').remove();
                }
                $("#fade").fadeOut();
                $("#popUpDel").fadeOut();
            });
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
    $.fn.centerThisDiv = function() {
        var win_hi = $(window).height() / 2;
        var win_width = $(window).width() / 2;
        win_hi = win_hi - $(this).height() / 2;
        win_width = win_width - $(this).width() / 2;
        $(this).css({
            'position': 'fixed',
            'top': win_hi,
            'left': win_width
        });
    };
    $.fn.stDigits = function() {
        return this.each(function() {
            $(this).text($(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
        });
    };


});


var centerThisDiv = function(elementSelector) {
    var win_hi = $(window).height() / 2;
    var win_width = $(window).width() / 2;
    var elemHeight = $(elementSelector).height() / 2;
    var elemWidth = $(elementSelector).width() / 2;
    var posTop = win_hi - elemHeight;
    var posLeft = win_width - elemWidth;
    $(elementSelector).css({
        'position': 'fixed',
        'top': win_hi,
        'left': win_width
    });
};
document.addEventListener('DOMContentLoaded', function() {
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
});

function notifyMe(icon_url, title, body_message, page_url) {
    //var icon_url,body_message,page_url = null;
    if (!Notification) {
        alert('Desktop notifications not available in your browser. Try Chromium.');
        return;
    }
    if (Notification.permission !== "granted")
        Notification.requestPermission();
    else {
        var notification = new Notification(title, {
            icon: icon_url,
            body: body_message,
        });
        if (page_url != null) {
            notification.onclick = function() {
                window.open(page_url);
            };
        }
    }
}
var hidePopUpBox = function() {
    $("#popUpDel").remove();
    $("#xfade,#fade").addClass('animate-while-hiding').delay(300).removeClass('animate-while-hiding').hide();
};
var hide_popup_del = function() {
    $("#popUpDel,#popUpBox").addClass("animate-while-hiding").hide(300, function() {
        $(this).remove();
        $("#xfade").hide();
        $("#fade").hide();
    });
};
var displayMessage = function(message) {
    notifyMe('uploads/logo/default.png', 'Sitsbook', message, null);
};
var displayToastMessage = function(message) {
    notifyMe('uploads/logo/default.png', 'Sitsbook', message, null);
};
var displayMessagePageParam = function(message, pageNumber) {
    $("#popUpDel").remove();
    $("body").append("<div id='popUpDel'><p class='confirm'>" + message + "</p><a class='nodelete btn btn-info'>Close</a></div>");
    centerThisDiv("#popUpDel");
    $("#popUpDel").hide();
    $("#xfade").fadeIn('slow');
    $("#popUpDel").fadeIn();
    $(".nodelete").click(function() {
        window.location.href = 'stock-taking.php?page=' + pageNumber;
    });
};
var displayMessageReport = function(message, location) {
    $("#popUpDel").remove();
    $("body").append("<div id='popUpDel'><p class='confirm'>" + message + "</p><a class='nodelete btn btn-info'>Close</a></div>");
    centerThisDiv("#popUpDel");
    $("#popUpDel").hide();
    $("#xfade").fadeIn('slow');
    $("#popUpDel").fadeIn();
    $(".nodelete").click(function() {
        window.location.href = location;
    });
};
var validate_float_2decs = function(input_elem) {
    var regex = /^[0-9]*(?:\.\d{1,2})?$/;
    if (!regex.test($(input_elem).val())) {
        return false;
    } else {
        return true;
    }
}
var reloadDropdown = function(elm) {
    $.post('?', {}, function(html_data) {
        $(elm).html($(html_data).find(elm).html());
        $(elm).selectpicker('refresh');
    });
}

var miniEdit = function(thisElement) {
    var $thatElement = $(thisElement).parent().find(".theTitleSpan");
    var title = $(thisElement).parent().find(".theTitleSpan").text();
    var acc_code_id = parseInt($(thisElement).attr('data-id')) || 0;
    var $miniText = '<input type="text" class="miniText form-control" value="' + title + '" data-id="' + acc_code_id + '" />';
    $(thisElement).parent().append($miniText);
    $(".miniText").focus();
    $(".miniText").blur(function() {
        miniTextBlurFunction($(this), $thatElement);
    });
    $(".miniText").keyup(function(e) {
        if (e.keyCode == 13) {
            miniTextBlurFunction($(this), $thatElement);
        }
    });
};
var miniTextBlurFunction = function(thisElm, thatElement) {
    var newTitle = $(thisElm).val();
    var this_acc_code = $(thisElm).parent().parent().find('td.acc_code').text();
    var acc_level = $(thisElm).parent().parent().find('td.acc_level').text();
    var acc_code_id = parseInt($(thisElm).attr('data-id')) || 0;
    var prevTitle = $(thatElement).text();
    if (newTitle == prevTitle || newTitle == '') {
        $(".miniText").remove();
        return false;
    }
    $("#xfade").fadeIn();
    $.post('/acmgmt/update', { acc_level: acc_level, new_title: newTitle, acc_code: this_acc_code }, function(data) {
        if (data != '') {
            //data = $.parseJSON(data);
            console.log(data)
            if (data['OK'] == 'Y') {
                displayMessage(newTitle + ' Saved Successfully!');
                $(thatElement).text(newTitle);
            } else {
                displayMessage('Error! Cannot Save Account Title.');
            }
            $(".miniText").remove();
        } else {
            displayMessage('Error! Cannot Save Account Title.');
            $(".miniText").remove();
        }
        $("#xfade").fadeOut();
    });
};
var doSearch = function() {
    $.get('pop-up-form/search-stock-taking.php', {}, function(data) {
        $("#popUpForm").html(data);

        $(".datepicker").datepicker({
            dateFormat: 'dd-mm-yy',
            showAnim: 'show',
            changeMonth: true,
            changeYear: true,
            yearRange: '2000:+10'
        });
        $("#popUpForm select").selectpicker();
        centerThisDiv("#popUpForm");
        $("#popUpForm").fadeIn();
        $("#fade").fadeIn();
    });
};
var closeSearch = function() {
    $("#popUpForm").fadeOut(function() {
        $(this).html('');
    });
    $("#fade").fadeOut();
};

function guidGenerator() {
    var S4 = function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
};
var append_sms_button = function() {
    if ($("input.sms-config").val() == 'Y') {
        $("div.underTheTable").prepend('<button class="button pull-left" onclick="send_sms(this);"> <i class="fa fa-envelope"></i> Send SMS</button>');
    }
};
var send_sms = function(elm) {
    var voucher_id = parseInt($("input.jv_id").val()) || 0;
    if (voucher_id == 0) {
        return;
    }
    $(elm).prop("disabled", true);
    $.post("?", { sms_voucher_id: voucher_id }, function(data) {
        displayMessage(data);
        $(elm).prop("disabled", false);
    });
};
var send_sms_form = function(elm, form_id) {
    form_id = parseInt(form_id) || 0;
    if (form_id == 0) {
        return;
    }
    $(elm).prop("disabled", true);
    $.post("?", { send_sms_by_id: form_id }, function(data) {
        displayMessage(data);
        $(elm).prop("disabled", false);
    });
};
var send_sms_from_list = function(elm, url) {
    var id = parseInt($(elm).attr('data-id')) || 0;
    if (id) {
        $.post(url, { send_sms_by_id: id }, function(data) {
            displayMessage(data);
        });
    }
}
