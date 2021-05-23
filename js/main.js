(function ($) {

	"use strict";

	var fullHeight = function () {

		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function () {
			$('.js-fullheight').css('height', $(window).height());
		});

	};
	fullHeight();

	$('#sidebarCollapse').on('click', function () {
		$('#sidebar').toggleClass('active');
	});

})(jQuery);

var apiUrl = "http://localhost:5000/";
var i = 0;

$(document).ready(function () {
	getAll();
});


function getAll() {
	$.ajax({
		type: "get",
		url: apiUrl + "api/Meetings",
		success: function (response) {
			console.log(response);
			listMeetings(response);
		},
		error: function (xhr) {
			console.log(xhr.responseJSON)
		}
	})
};

function listMeetings(meetings) {
	if (meetings.length < 1) {
		$("#main-div").append('<p class="text-center">Toplantı bulunamadı</p>');
	}
	else {
		$.each(meetings, function (key, value) {
			$("#main-table-body").append('<tr class="clickable-row" id="' + value.id + '">' +
				'<td class="meeting-id">' + value.topic + '</td>' +
				'<td>' + value.date + '</td>' +
				'<td>' + value.startTime + '</td>' +
				'<td>' + value.endTime + '</td>' +
				'<td>' + value.participants.length + '</td>' +
				'</tr>');
		});
	}
};

$("body").on("click", ".clickable-row", function (event) {
	var id = $(this).attr("id");
	$.ajax({
		type: "get",
		url: apiUrl + "api/meetings/" + id,
		success: function (response) {
			details(response);
		},
		error: function (xhr, error, status) {
			console.log(xhr.responseJSON);
		}
	});
});

function details(response) {
	$("#main-h2").text("Toplantı Detayları");
	$("#main-div").empty();
	$("#main-div").append(
		'<p><b>Konu: </b>' + response.topic + '</p>' +
		'<p><b>Tarih: </b>' + response.date + '</p>' +
		'<p><b>Başlangıç Saati: </b>' + response.startTime + '</p>' +
		'<p><b>Bitiş Saati: </b>' + response.endTime + '</p>' +
		'<p class="text-center"><b>Katılımcılar</b></p>'
	);
	$("#main-buttons").append('<h2 class="d-inline float-right">' +
		'<a class="btn btn-warning" href="#" onclick="editMeeting(' + response.id + ')"><i class="fa fa-edit"></i></a>' +
		'<a class="btn btn-danger ml-1" href="#" onclick="deleteMeeting(' + response.id + ')"><i class="fa fa-trash-o"></i></a>' +
		'</h2>');

	if (response.participants.length < 1) {
		$("#main-div").append('<p class="text-center"> Katılımcı bulunamadı<p>');
	}
	else {
		$.each(response.participants, function (key, value) {
			$("#main-div").append('<p class="text-center">' + value.fullname + '<p>')
		});
	}
}

function createMeeting() {
	$("#main-h2").text("Toplantı Oluştur");
	$("#main-div").empty();
	$("#main-div").append(
		'<form id="createMeetingForm">' +
		'                <div class="col-lg-6">' +
		'                    <div class="form-group">' +
		'                        <label for="topicInput" class="text-black">Konu</label>' +
		'                        <input type=" text" class="form-control" id="topicInput" name="topic" required>' +
		'                    </div>' +
		'                    <div class="form-group">' +
		'                        <label for="dateInput" class="text-black">Tarih</label>' +
		'                        <input type="datetime-local" class="form-control" id="dateInput" name="date">' +
		'                    </div>' +
		'                    <div class="form-group">' +
		'                        <label for="endTimeInput" class="text-black">Bitiş Saati</label>' +
		'                        <input type=" text" class="form-control" id="endTimeInput" name="endTime"' +
		'                            placeholder="Saat:Dakika">' +
		'                    </div>' +
		'                    <p class="mb-1">Katılımcı</p>' +
		'                    <div class="input-group mb-3">' +
		'                        <input type=" text" class="form-control" id="participantInput"' +
		'                            placeholder="Ad-Soyad">' +
		'                        <div class="input-group-append">' +
		'                            <a href="#" onclick="addParticipant()" class="btn btn-primary"><i class="fa fa-plus"></i></a>' +
		'                        </div>' +
		'                    </div>' +
		'                    <button class="btn btn-primary" type="submit"><i class="fa fa-save"></i>' +
		'                        Kaydet</button>' +
		'                </div>' +
		'            </form>' + '<p class="ml-3 mt-3"><b>Katılımcılar</b></p>'

	);
}

$("body").on("submit", "#createMeetingForm", function (event) {
	event.preventDefault();
	$.ajax({
		type: "post",
		url: apiUrl + "api/meetings",
		data: $("#createMeetingForm").serialize(),
		success: function () {
			i = 0;
			window.location.href = "/index.html";
			window.alert("Toplantı Oluşturuldu")
		},
		error: function (xhr, error, status) {
			console.log(xhr.responseJSON);
			window.alert("Veri Tiplerini Uygun Giriniz!");
		}
	});
});

function deleteMeeting(id) {
	$.ajax({
		type: "delete",
		url: apiUrl + "api/meetings/" + id,
		success: function (response) {
			window.location.href = "/index.html";
			window.alert("Toplantı Silindi")
		},
		error: function (xhr, error, status) {
			window.alert("Toplantı Silinirken Hata!")
			console.log(xhr.responseJSON);
		}
	});
}


function editMeeting(id) {
	$("#main-h2").text("Toplantı Güncelle");
	$("#main-buttons").empty();
	$("#main-div").empty();
	$.ajax({
		type: "get",
		url: apiUrl + "api/Meetings/" + id,
		success: function (response) {
			$("#main-div").append(
				'<form id="editMeetingForm">' +
				'                <div class="col-lg-6">' +
				'                    <input type="hidden" id="' + response.id + '" value="' + response.id + '" name="id">' +
				'                    <div class="form-group">' +
				'                        <label for="topicInput" class="text-black">Konu</label>' +
				'                        <input type=" text" class="form-control" id="topicInput" name="topic" value ="' + response.topic + '"required>' +
				'                    </div>' +
				'                    <div class="form-group">' +
				'                        <label for="dateInput" class="text-black">Tarih</label>' +
				'                        <input type="datetime-local" class="form-control" id="dateInput" name="date" value="' + response.date + '">' +
				'                    </div>' +
				'                    <div class="form-group">' +
				'                        <label for="endTimeInput" class="text-black">Bitiş Saati</label>' +
				'                        <input type=" text" class="form-control" id="endTimeInput" name="endTime"  value="' + response.endTime + '"' +
				'                            placeholder="Saat:Dakika">' +
				'                    </div>' +
				'                    <p class="mb-1">Katılımcı</p>' +
				'                    <div class="input-group mb-3">' +
				'                        <input type=" text" class="form-control" id="participantInput"' +
				'                            placeholder="Ad-Soyad">' +
				'                        <div class="input-group-append">' +
				'                            <a href="#" onclick="addParticipantEdit()" class="btn btn-primary"><i class="fa fa-plus"></i></a>' +
				'                        </div>' +
				'                    </div>' +
				'                    <button class="btn btn-primary" type="submit"><i class="fa fa-save"></i>' +
				'                        Kaydet</button>' +
				'                </div>' +
				'            </form>' + '<p class="ml-3 mt-3"><b>Katılımcılar</b></p>'
			);
			$.each(response.participants, function (key, value) {
				$("#main-div").append('<p class="ml-3">' + value.fullname + '</p>');
				$("#editMeetingForm").append('<input type="hidden" name="participants[' + i + '][fullname]" value="' + value.fullname + '">');
				i++;

			});
		},
		error: function (xhr) {
			console.log(xhr.responseJSON)
		}
	});

}

function addParticipantEdit() {
	var participant = $("#participantInput").val();
	$("#main-div").append('<p class="ml-3">' + participant + '</p>');
	$("#editMeetingForm").append('<input type="hidden" name="participants[' + i + '][fullname]" value="' + participant + '">');
	$("#participantInput").val("");
	i++;
}

$("body").on("submit", "#editMeetingForm", function (event) {
	event.preventDefault();
	var id = $("input[name='id']").val();
	console.log(id);
	$.ajax({
		type: "put",
		url: apiUrl + "api/meetings/" + id,
		data: $("#editMeetingForm").serialize(),
		success: function () {
			i = 0;
			window.location.href = "/index.html";
			window.alert("Toplantı Güncellendi")
		},
		error: function (xhr, error, status) {
			window.alert("Toplantı Güncellenirken Hata!")
			console.log(xhr.responseJSON);
		}
	});
});


function addParticipant() {
	var participant = $("#participantInput").val();
	$("#main-div").append('<p class="ml-3">' + participant + '</p>');
	$("#createMeetingForm").append('<input type="hidden" name="participants[' + i + '][fullname]" value="' + participant + '">');
	$("#participantInput").val("");
	i++;
}
