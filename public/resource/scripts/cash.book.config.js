/* global $ */
/* global displayMessage */
//var $ = $.noConflict(true);
$(document).ready(function () {
  $(".debit,.credit").numericFloatOnly();
  calculate_cash_balance();
  $.fn.quickSubmitDrCr = function () {
    var row_id = 0;
    var amount = 0;
    var type = "";
    var d_r = $("input.debit").val();
    var c_r = $("input.credit").val();
    if (d_r > 0) {
      amount = d_r;
      type = "Dr";
    } else {
      amount = c_r;
      type = "Cr";
    }
    var regex = /^[0-9]*(?:\.\d{1,2})?$/;
    if (!regex.test(amount)) {
      return false;
    }
    var narration = $(".narration").val();
    var accCode = $("select.accCodeSelector option:selected").val();
    var accTitle = $("select.accCodeSelector option:selected").text();
    var jvId = $("input[name='jvId']").val();
    if (
      (amount !== "") &
      (type !== "") &
      (narration !== "") &
      (accCode !== "") &
      (accTitle !== "")
    ) {
      $(this).blur();
      if (type == "Dr") {
        var Dr = amount;
        var Cr = "";
      } else {
        var Dr = "";
        var Cr = amount;
      }
      var amountSum = 0;
      amountSum += parseFloat(Dr) || 0;
      amountSum += parseFloat(Cr) || 0;
      if (amountSum == 0) {
        displayMessage("Transaction With Zero Amount Is Not Valid!");
        return false;
      }
      if ($(".updateMode").length > 0) {
        row_id = parseInt($(".updateMode").attr("row-id")) || 0;
      }
      var row =
        '<tr class="transactions amountRow" row-id="' +
        row_id +
        '">' +
        '<td class="accCode text-center">' +
        accCode +
        "</td>" +
        '<td class="accTitle text-left">' +
        accTitle +
        "</td>" +
        '<td class="narration text-left">' +
        narration +
        "</td>" +
        '<td class="debitColumn text-center">' +
        Dr +
        "</td>" +
        '<td class="creditColumn text-center">' +
        Cr +
        "</td>" +
        '<td class="text-center">' +
        '<a onclick="edit_row(this);" id="view_button"><i class="fa fa-pencil"></i></a>' +
        '<a class="pointer" onClick="jvFunctions.deleteRow(this);"><i class="fa fa-times"></i></a>' +
        "</td>" +
        "</tr>";
      if ($(".updateMode").length > 0) {
        $(".updateMode").replaceWith(row);
      } else {
        $(row).insertAfter($(".transactions").last());
      }
      $(".narration,.debit,.credit,.accountCode,.accountTitle").val("");
      $("select.accCodeSelector option:selected").prop("selected", false);
      $("select.accCodeSelector option").first().prop("selected", true);
      $("select.accCodeSelector").selectpicker("refresh");
      $(".debitColumn").sumColumn(".debitTotal");
      $(".creditColumn").sumColumn(".creditTotal");
      calculate_cash_balance();
      $(document).showDifference();
      $("button.dropdown-toggle").focus();
    }
  };

  $.fn.saveJournal = function () {
    // if($(".save_voucher").prop("disabled")==true){
    // 	return;
    // }
    // $(".save_voucher").prop("disabled",true);

    $("#screenLocked").modal("show");

    var difference = $(this).checkDifference();
    if (difference != 0) {
      //displayMessage('Voucher Is Not Balanced!');
      //return false;
    }
    var jvNum = $("input[name='jvNum']").val();
    var jvDate = $("input[name='jvDate']").val();

    if (jvDate == "") {
      displayMessage("Error! voucher date is missing.");
      // $(".save_voucher").prop("disabled",false);
      $("#screenLocked").modal("hide");
      return false;
    }
    if ($(".amountRow").length == 0) {
      displayMessage("No Transaction Exists!");
      // $(".save_voucher").prop("disabled",false);
      $("#screenLocked").modal("hide");
      return false;
    }
    var transaction = {};
    var voucher_amount = 0;
    var accCode, accTitle, narration, debit, credit, row_id;
    $(".amountRow").each(function (index, element) {
      accCode = $(this).children(".accCode").text();
      accTitle = $(this).children(".accTitle").text().trim();
      narration = $(this).children(".narration").text().trim();
      debit = $(this).children(".debitColumn").text();
      credit = $(this).children(".creditColumn").text();
      row_id = $(this).attr("row-id");

      voucher_amount += parseFloat(debit) || 0;
      voucher_amount += parseFloat(credit) || 0;

      transaction[index] = {
        account_code: accCode,
        account_title: accTitle,
        narration: narration,
        debit: debit,
        credit: credit,
      };
    });
    //transaction = JSON.stringify(transaction);
    console.log(jvNum);
    $.post(
      "/cbs",
      {
        jvNum: jvNum,
        jvDate: jvDate,
        transactions: transaction,
      },
      function (data) {
        if (data["ID"] == 0) {
          $(".save_voucher").prop("disabled", false);
          $("#screenLocked").modal("hide");
          displayMessage(data["MSG"]);
        } else {
          //$(".save_voucher").prop("disabled",false);
          displayMessage(data["MSG"]);
          $("#screenLocked").modal("hide");
          window.location.href = "/cbs/" + data["ID"];
        }
      }
    );
  };
  $.fn.showUpdateFox = function () {
    var idValue = $(this).attr("do");
    $.post(
      "pop-up-form/update-voucher-detail.php",
      { jid: idValue },
      function (data) {
        $("#popUpForm").html(data);
        $("#popUpForm").centerThisDiv();
        $("#popUpForm").fadeIn();
        $("#fade").fadeIn();
        $("#popUpForm select").selectpicker();
        $("#popUpForm .closePopUpForm").click(function () {
          $("#popUpForm").fadeOut().delay();
          $("#fade").fadeOut();
        });
        $("#popUpForm input[type='text']").attr("autocomplete", "off");
        $("#popUpForm button.selectpicker:first").focus();
        $("#popUpForm select.prodCode").change(function () {
          $("#popUpForm input[name='quality']").focus();
        });
        $("#popUpForm input[name='quality']").setFocusTo("input[name='color']");
        $("#popUpForm input[name='color']").setFocusTo("input[name='than']");
        $("#popUpForm input[name='than']").setFocusTo(
          "#popUpForm button.selectpicker:last"
        );
        $("#popUpForm select.measure").change(function () {
          $("#popUpForm input[name='length']").focus();
        });
        $("#popUpForm input[name='length']").setFocusTo(
          "#popUpForm input[type='submit']"
        );
        $("#popUpForm input[name='than']").keyup(function () {
          $(this).multiplyTwoFeilds(
            "#popUpForm input[name='length']",
            "#popUpForm input[name='total']"
          );
        });
        $("#popUpForm input[name='length']").keyup(function () {
          $(this).multiplyTwoFeilds(
            "#popUpForm input[name='than']",
            "#popUpForm input[name='total']"
          );
        });
        $("#popUpForm select").selectpicker("refresh");
      }
    );
  };
  $.fn.deleteVoucher = function () {
    var idValue = $("input.jVoucher_id").val();
    var clickedDel = $(this);
    $("#fade").hide();
    $("#popUpDel").remove();
    $("body").append(
      "<div id='popUpDel'><p class='confirm'>Are You Sure?</p><a class='dodelete btn btn-danger'>Confirm</a><a class='nodelete btn btn-info'>Cancel</a></div>"
    );
    $("#popUpDel").centerThisDiv();
    $("#popUpDel").hide();
    $("#fade").fadeIn("slow");
    $("#popUpDel").fadeIn();
    $(".dodelete").click(function () {
      var floatOrSuper = $(".super").length ? "super" : "float";
      window.location.href = "journal-voucher.php?delete=" + idValue;
    });
    $(".nodelete").click(function () {
      $("#fade").fadeOut();
      $("#popUpDel").fadeOut(function () {
        $("#popUpDel").remove();
      });
    });
    $(".close_popup").click(function () {
      $("#fade").fadeOut("fast");
      $("#popUpDel").fadeOut(function () {
        $("#popUpDel").remove();
      });
    });
  };
  $.fn.sumColumn = function (showTotal) {
    var totalThaans = 0;
    $(this).each(function () {
      var rowVal = parseFloat($(this).text().replace(",", "")) || 0;
      totalThaans += rowVal;
    });
    $(showTotal).text(totalThaans.toFixed(2));
  };
  $.fn.setFocusTo = function (Elm) {
    $(this).keydown(function (e) {
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
  $.fn.setFocusToIfVal = function (Elm) {
    $(this).keydown(function (e) {
      if ($(this).val() == "") {
        if (e.keyCode == 13) {
          e.preventDefault();
          $(Elm).focus();
        }
      }
    });
  };
  $.fn.escFocusTo = function (Elm) {
    $(this).keydown(function (e) {
      if (e.keyCode == 27) {
        e.preventDefault();
        $(Elm).focus();
      }
    });
  };
  $(function () {
    $(window).keyup(function (e) {
      if (e.keyCode == 27) {
        $("#popUpDel").slideUp();
        $("#xfade").fadeOut();
      }
    });
  });
  $.fn.checkDifference = function () {
    if ($("td.debitTotal").text() !== "" && $("td.creditTotal").text()) {
      var debitColumn = parseFloat($("td.debitTotal").text() || 0);
      var creditColumn = parseFloat($("td.creditTotal").text() || 0);
      if (debitColumn > creditColumn) {
        return debitColumn - creditColumn;
      } else {
        return creditColumn - debitColumn;
      }
    }
  };
  $.fn.showDifference = function () {
    if ($("td.debitTotal").text() !== "" && $("td.creditTotal").text()) {
      var debitColumn = parseFloat($("td.debitTotal").text()) || 0;
      var creditColumn = parseFloat($("td.creditTotal").text()) || 0;
      if (debitColumn > creditColumn) {
        $("td.drCrDiffer").text((debitColumn - creditColumn).toFixed(2));
      } else {
        $("td.drCrDiffer").text((creditColumn - debitColumn).toFixed(2));
      }
    }
  };
  $.fn.centerThisDiv = function () {
    var win_hi = $(window).height() / 2;
    var win_width = $(window).width() / 2;
    win_hi = win_hi - $(this).height() / 2;
    win_width = win_width - $(this).width() / 2;
    $(this).css({
      position: "fixed",
      top: win_hi,
      left: win_width,
    });
  };
});
var jvFunctions = {
  messageText: "Are you Sure?",
  yesButton: "Y",
  yesButtonText: "Confirm",
  noButton: "Y",
  noButtonText: "Cancel",
  centerThisDiv: function (elementSelector) {
    var win_hi = $(window).height() / 2;
    var win_width = $(window).width() / 2;
    var elemHeight = $(elementSelector).height() / 2;
    var elemWidth = $(elementSelector).width() / 2;
    var posTop = win_hi - elemHeight;
    var posLeft = win_width - elemWidth;
    $(elementSelector).css({
      position: "fixed",
      top: posTop,
      left: posLeft,
      margin: "0px",
    });
    $(elementSelector).fadeIn();
  },
  showMessage: function () {
    var popUpDiv =
      "<div id='popUpDel'><p class='confirm'>" + this.messageText + "</p>";
    if (this.yesButton == "Y") {
      popUpDiv +=
        "<a class='dodelete btn btn-danger'>" + this.yesButtonText + "</a>";
    }
    if (this.noButton == "Y") {
      popUpDiv +=
        "<a class='nodelete btn btn-info'>" + this.noButtonText + "</a>";
    }
    popUpDiv += "</div>";
    $("body").append(popUpDiv);
    $("#popUpDel").hide();
    $("#fade").fadeIn();
    $("#popUpDel").fadeIn();
    this.centerThisDiv("#popUpDel");
  },
  closePopUp: function () {
    $("#fade").fadeOut();
    if ($("#popUpForm").length) {
      $("#popUpForm").fadeOut(function () {
        $(this).remove();
      });
    }
    if ($("#popUpDel").length) {
      $("#popUpDel").remove();
    }
  },
  showDifference: function () {
    if ($("td.debitTotal").text() != "" && $("td.creditTotal").text() != "") {
      var debitColumn = parseFloat($("td.debitTotal").text() || 0);
      var creditColumn = parseFloat($("td.creditTotal").text() || 0);
      if (debitColumn > creditColumn) {
        $("td.drCrDiffer").text(debitColumn - creditColumn);
      } else {
        $("td.drCrDiffer").text(creditColumn - debitColumn);
      }
    }
  },
  showUpdater: function (thisElm) {
    var row_id = $(thisElm).parent().parent().attr("row-id");
    var thisRow = $(thisElm).parent().parent();

    var accCode = thisRow.find("td.accCode").text();
    var accTitle = thisRow.find("td.accTitle").text();
    var narration = thisRow.find("td.narration").text();
    var debitColumn = parseFloat(thisRow.find("td.debitColumn").text()) || 0;
    var creditColumn = parseFloat(thisRow.find("td.creditColumn").text()) || 0;
    if (debitColumn != 0) {
      var type = "Dr";
      var amount = debitColumn;
    } else if (creditColumn != 0) {
      var type = "Cr";
      var amount = creditColumn;
    }
    var main = this;
    if (row_id != "") {
      $("body").append('<div id="popUpForm"></div>');
      $.post(
        "pop-up-form/update-voucher-detail.php",
        { jDetail: row_id },
        function (data) {
          if (data != "") {
            $("#popUpForm").html(data);
            var AccCodeOptionList = $(".accCodeSelector").html();
            $("#popUpForm")
              .find("select.accCodePopup")
              .append(AccCodeOptionList);
            $("#popUpForm").find("input[name='jv_detail_id']").val(row_id);

            $("#popUpForm")
              .find("select[name='accCode'] option")
              .prop("selected", false);
            $("#popUpForm")
              .find("select[name='accCode'] option[value='" + accCode + "']")
              .prop("selected", true);

            $("#popUpForm").find("input[name='narration']").val(narration);

            $("#popUpForm")
              .find("input[type='radio']")
              .each(function (i, v) {
                if ($(this).val() == type) {
                  $(this).prop("checked", true);
                } else {
                  $(this).prop("checked", false);
                }
              });

            $("#popUpForm").find("input[name='amount']").val(amount);
            $("#popUpForm").find("select.accCodePopup").selectpicker();
            main.centerThisDiv("#popUpForm");
            $("#fade").fadeIn();
            $("#popUpForm").fadeIn();
          }
        }
      );
    }
  },
  updateJvDetails: function () {
    var main = this;
    if ($("#popUpForm").length) {
      var jv_id = $("#popUpForm").find("input[name='jv_id']").val();
      var jv_detail_id = $("#popUpForm")
        .find("input[name='jv_detail_id']")
        .val();
      var accCode = $("#popUpForm")
        .find("select[name='accCode'] option:selected")
        .val();
      var accTitle = $("#popUpForm")
        .find("select[name='accCode'] option:selected")
        .text();
      var narration = $("#popUpForm").find("input[name='narration']").val();
      var type = $("#popUpForm").find("input[name='type']:checked").val();
      var amount = $("#popUpForm").find("input[name='amount']").val();

      $("tr").each(function (index, element) {
        var row_id = parseInt($(this).attr("row-id")) || 0;
        var thisRow = $(this);
        if (row_id == jv_detail_id) {
          thisRow.find("td.accCode").text(accCode);
          thisRow.find("td.accTitle").text(accTitle);
          thisRow.find("td.narration").text(narration);
          if (type == "Dr") {
            thisRow.find("td.debitColumn").text(amount);
            thisRow.find("td.creditColumn").text("");
          } else if (type == "Cr") {
            thisRow.find("td.creditColumn").text(amount);
            thisRow.find("td.debitColumn").text("");
          }
        }
      });
      $(".debitColumn").sumColumn(".debitTotal");
      $(".creditColumn").sumColumn(".creditTotal");
      main.showDifference();
      main.closePopUp();
    }
  },
  deleteRow: function (thisElm) {
    var row_id = parseInt($(thisElm).parent().parent().attr("row-id")) || 0;
    var thisRow = $(thisElm).parent().parent();
    var main = this;
    main.messageText = "Do you want to Delete?";
    main.showMessage();
    $(".dodelete").click(function () {
      thisRow.remove();
      $("body").append(
        '<input type="hidden" class="deleted_transaction" value="' +
          row_id +
          '">'
      );
      $(".debitColumn").sumColumn(".debitTotal");
      $(".creditColumn").sumColumn(".creditTotal");
      main.showDifference();
      main.closePopUp();
    });
    $(".nodelete").click(function () {
      main.closePopUp();
    });
  },
};
var getAccountBalance = function (account_code, elm_class) {
  $.post(
    "/db/get-account-balance",
    { supplierAccCode: account_code },
    function (data) {
      //		data = $.parseJSON(data);
      $("." + elm_class)
        .text(" Balance : " + data["BALANCE"])
        .stDigits();
    }
  );
};
var calculate_cash_balance = function () {
  var jv_id = parseInt($("input.jVoucher_id").val()) || 0;
  var bal_type = "DR";
  var cach_acc = $("input.cash_default").val();
  $.post(
    "/db/get-account-balance",
    { supplierAccCode: cach_acc },
    function (data) {
      //		data = $.parseJSON(data);
      bal = parseFloat(data["AMOUNT"]) || 0;
      $("input.cash_balance").attr("data-balance", data["AMOUNT"]);
      if (jv_id == 0) {
        var debits = parseFloat($("td.debitTotal").text()) || 0;
        var credit = parseFloat($("td.creditTotal").text()) || 0;
        var bal = parseFloat($("input.cash_balance").attr("data-balance")) || 0;
        bal += credit;
        bal -= debits;
        if (bal < 0) {
          bal_type = "CR";
        }
      }
      $("input.cash_balance").val(data["BALANCE"]);
    }
  );
};

var getCashBalance = function () {
  if ($("select.cash_accounts_list").length) {
    cash_in_hand = $("select.cash_accounts_list option:selected").val();
  } else {
    cash_in_hand = $("input.cash-in-hand").val();
  }
  $.post(
    "/db/get-account-balance",
    { account_code: cash_in_hand },
    function (data) {
      $(".insertAccTitle")
        .text(" Balance : " + data["BALANCE"])
        .stDigits()
        .show();
    }
  );
};
