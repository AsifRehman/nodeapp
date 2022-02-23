$(document).ready(function () {
	$.fn.quickSubmitDrCr = function () {
		var amount = $(".amount").val();
		var regex = /^[0-9]*(?:\.\d{1,2})?$/;
		if (!regex.test(amount)) {
			return false;
		}
		var config_bill_effect = $(".config_bill_effect").val();
		if (config_bill_effect == "Y") {
			var billAmount = $("input[name=billAmount]").val();
			if (amount > billAmount) {
				displayMessage("Amount can't be more then " + billAmount);
				return;
			}
		}

		var narration = $(".narration").val();
		var accCode = $("select.accCodeSelector option:selected").val();
		var accTitle = $("select.accCodeSelector option:selected").text();
		var billNo = $("select.billNoSelector option:selected").val() || 0;

		var billNoText = $("select.billNoSelector option:selected").html() || "";
		var n = billNoText.lastIndexOf(":");
		var receviableAmount = billNoText.substring(n + 1);
		amount = parseFloat(amount);
		receviableAmount = parseFloat(receviableAmount);
		if (amount > receviableAmount) {
			displayMessage("Amount can't be more then " + receviableAmount);
			return;
		}

		if (amount == 0) {
			displayMessage("Transaction With Zero Amount Is Not Valid!");
			return false;
		}
		if (amount != "" && narration != "" && accCode != "" && accTitle != "") {
			$(this).blur();
			// $("<tr class=\"transactions amountRow\"><td style=\"text-align:right;\" class='accCode'>"+accCode+"</td><td style=\"text-align:left;\" class='accTitle'>"+accTitle+"</td><td style=\"text-align:left;\" class='narration'>"+narration+"</td><td style=\"text-align:center;\" class=\"creditColumn\">"+amount+"</td><td style=\"text-align:center;\"><a class=\"pointer\" title=\"Delete\"> <i class=\"fa fa-times\"></i> </a></td></tr>").insertAfter($(".transactions").first());

			var TString = '<tr class="transactions amountRow">';
			TString +=
				"<td style=\"text-align:right;\" class='accCode'>" + accCode + "</td>";
			TString +=
				"<td style=\"text-align:left;\" class='accTitle'>" + accTitle + "</td>";
			if (config_bill_effect == "Y") {
				TString +=
					"<td style=\"text-align:center;\" class='billNo'>" + billNo + "</td>";
			}
			TString +=
				"<td style=\"text-align:left;\" class='narration'>" +
				narration +
				"</td>";
			TString +=
				'<td style="text-align:center;" class="creditColumn">' +
				amount +
				"</td>";
			TString +=
				'<td style="text-align:center;"><a class="pointer" title="Delete"> <i class="fa fa-times"></i> </a></td>';
			TString += "</tr>";
			$(TString).insertAfter($(".transactions").first());

			$(
				".accCodeSelector,.billNoSelector,.receiptNum,.amount,.accountCode,.accountTitle"
			).val("");
			$("a.pointer").click(function () {
				$(this).parent("td").parent("tr").remove();
				$(".creditColumn").sumColumn(".creditTotal");
			});
			$(".creditColumn").sumColumn(".creditTotal");
			$("select.accCodeSelector").selectpicker("refresh");
			$("select.billNoSelector").selectpicker("refresh");
			setTimeout(function () {
				$("div.accCodeSelector button").focus();
			}, 100);
		}
	};

	$.fn.saveJournal = function () {
		console.log("calling journal function");
		// if($(".saveJournal").prop("disabled")==true){
		// 	return;
		// }
		// $(".saveJournal").prop("disabled",true);

		// $("#screenLocked").modal('show');

		var cashAc = "245020001";
		if ($("select.cash_accounts_list").length) {
			cashAc = $("select.cash_accounts_list option:selected").val();
		} else {
			cashAc = $("input.cash-in-hand").val();
		}

		var cpNum = $("input[name='cpNum']").val();
		var jvNum = $("input[name='jvNum']").val();
		var jvDate = $("input[name='jvDate']").val();

		var config_pnl_date = $("input.config_pnl_date").val();
		var jvDateProcess = jvDate.split("-");
		jvDate = jvDateProcess[2] + "-" + jvDateProcess[1] + "-" + jvDateProcess[0];
		if (new Date(jvDate) <= new Date(config_pnl_date)) {
			displayMessage("Date must be grater then date " + config_pnl_date);
			return;
		}
		console.log("jvdate");

		if (jvDate == "") {
			displayMessage("Error! voucher date is missing.");
			// $(".saveJournal").prop("disabled",false);
			return false;
		}
		if ($(".amountRow").length == 0) {
			displayMessage("No Transaction Exists!");
			// $(".saveJournal").prop("disabled",false);
			return false;
		}
		// $("#xfade").fadeIn();
		$("#screenLocked").modal("show");

		var transaction = {};
		console.log("transactions");
		$(".amountRow").each(function (index, element) {
			transaction[index] = {};
			transaction[index].row_id = 0;
			transaction[index].account_code = $(this).children(".accCode").text();
			transaction[index].account_title = $(this).children(".accTitle").text();
			transaction[index].narration = $(this).children(".narration").text();
			transaction[index].debit = $(this).children(".creditColumn").text();
		});
		console.log("abc");
		$.post(
			"/cps",
			{
				cashAc: cashAc,
				cpNum: cpNum,
				jvNum: jvNum,
				jvDate: jvDate,
				transactions: transaction,
			},
			function (data) {
				//data = $.parseJSON(data);
				console.log(data);
				if (data["ID"] == 0) {
					$(".save_voucher").prop("disabled", false);
					$("#screenLocked").modal("hide");
					displayMessage(data["MSG"]);
				} else {
					//$(".save_voucher").prop("disabled",false);
					displayMessage(data["MSG"]);
					$("#screenLocked").modal("hide");
					console.log("cps locations")
					window.location.href = "/cps/" + data["ID"];
				}
				return;

				displayMessage(data["MSG"]);

				if (data["OK"] !== "xxxx") {
					$(".saveJournal").hide();
					var $print_button =
						'<a class="button pull-right" target="_blank" href="voucher-cash-received.php?id=' +
						data["ID"] +
						'"><i class="fa fa-print"></i> Print </a>';
					$($print_button).insertAfter($(".saveJournal"));

					// append_sms_button();
					if ($("input.sms-config").val() == "Y") {
						$("div.underTheTable").prepend(
							'<button class="button pull-left sendSMS" vid="' +
							data["ID"] +
							'"> <i class="fa fa-envelope"></i> Send SMS</button>'
						);
					}

					$(".pointer").hide();
				}
				// $("#xfade").fadeOut();
				$("#screenLocked").modal("hide");

				// else{
				// $(".saveJournal").prop("disabled",false);
				// }
			}
		);
	};

	$.fn.deleteRow = function () {
		var idValue = $(this).attr("do");
		var clickedDel = $(this);
		$("#fade").hide();
		$("#popUpDel").remove();
		$("body").append(
			"<div id='popUpDel'><p class='confirm'>Are You Sure?</p><a class='dodelete btn btn-danger'>Confirm</a><a class='nodelete btn btn-info'>Cancel</a></div>"
		);
		$("#popUpDel").hide();
		$("#popUpDel").centerThisDiv();
		$("#fade").fadeIn("slow");
		$("#popUpDel").fadeIn();
		$(".dodelete").click(function () {
			$.post("db/del-jvoucher-details.php", { jvid: idValue }, function (data) {
				if (data == 1) {
					$("#popUpDel")
						.children(".confirm")
						.text("1 Row Deleted Successfully!");
					clickedDel.parent("td").siblings("td").text("0").parent().slideUp();
					$("#popUpDel").children(".dodelete").hide();
					$("#popUpDel").children(".nodelete").text("Close");
					$(".debitColumn").sumColumn(".debitTotal");
					$(".creditColumn").sumColumn(".creditTotal");
				} else {
					$("#popUpDel").children(".confirm").text("Unable to Delete.");
					$("#popUpDel").children(".dodelete").hide();
					$("#popUpDel").children(".nodelete").text("Close");
				}
			});
		});
		$(".nodelete").click(function () {
			$("#fade").fadeOut();
			$("#popUpDel").fadeOut();
		});
		$(".close_popup").click(function () {
			$("#popUpDel").slideUp();
			$("#fade").fadeOut("fast");
		});
	};
	$.fn.sumColumn = function (showTotal) {
		var totalThaans = 0;
		if ($(this).length) {
			$(this).each(function () {
				var rowVal = $(this).text().replace(/\-/g, "");
				rowVal =
					rowVal.replace(/\s+/g, "") == "" ? 0 : rowVal.replace(/\s+/g, "");
				totalThaans += parseInt(rowVal);
				$(showTotal).text(totalThaans);
			});
		} else {
			$(showTotal).text(0);
		}
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
	$.fn.escFocusTo = function (Elm) {
		$(this).keydown(function (e) {
			if (e.keyCode == 27) {
				e.preventDefault();
				$(Elm).focus();
			}
		});
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
var getAccountBalance = function (account_code, element) {
	$.post(
		"/db/get-account-balance",
		{ account_code: account_code },
		function (data) {
			console.log(data);
			$(element)
				.text(" Balance : " + data["BALANCE"])
				.stDigits()
				.show();
		}
	);
};
var getBillsListOfAccounts = function (account_code) {
	var mode = "getUnpaidBillsList";
	$.post(
		"db/cash-receive.db.php",
		{ mode: mode, customerAccCode: account_code },
		function (data) {
			data = $.parseJSON(data);
			$("select.billNoSelector").html("");
			if (data["DATA"] == "YES") {
				var string = '<option value=""></option>';
				var bills = data["BILLS"];

				var title = "";
				var remainingAmt = 0;
				bills.forEach(function (item, index) {
					remainingAmt = item["TOTAL_AMOUNT"] - item["ALERT_BILL_AMOUNT"];
					title =
						"Bill:" +
						item["BILL_NO"] +
						", " +
						item["CUST_ACC_TITLE"] +
						", Amt:" +
						remainingAmt;
					string +=
						'<option value="' + item["BILL_NO"] + '">' + title + "</option>";
				});

				$("select.billNoSelector").html(string);
				$("select.billNoSelector").selectpicker("refresh");
			}
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
