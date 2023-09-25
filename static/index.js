//Crie a variável de data
var date = new Date()
let display_date = "Data: " + date.toLocaleDateString('pt-BR', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })

//Carregue o DOM HTML
$(document).ready(function () {
    $("#display_date").html(display_date)
    $("#save_button").prop("disabled", true)

})
//Defina a variável para armazenar a emoção prevista
let predicted_emotion

//HTML-->JavaScript--->Flask
//Flask--->JavaScript--->HTML

//seletor jQuery e ação de clique
$(function () {
    $("#predict_button").click(function () {
        let input_data = {
            "text": $("#text").val()
        }
        //chamada AJAX

        $.ajax({

            type: 'POST',
            url: "/predict-emotion",
            data: JSON.stringify(input_data),
            dataType: "json",
            contentType: 'application/json',

            success: function (result) {

                // Resultado recebido do Flask ----->JavaScript
                predicted_emotion = result.data.predict_emotion
                emo_url = result.data.predict_emoticon


                // Exibir resultado usando JavaScript----->HTML
                $("#prediction").html(predicted_emotion)
                $('#prediction').css("display", "block");

                $("#emo_img_url").attr('src', emo_url);
                $('#emo_img_url').css("display", "block");
                $("#save_button").prop("disabled", false)
            },
            error: function (result) {
                alert(result.responseJSON.message)
            }
        });
    });

    $("#save_button").click(function () {
        save_data = {
            "date": display_date,
            "text": $("#text").val(),
            "emotion": predicted_emotion,
        }

        $.ajax({

            type: 'POST',
            url: "/save-entry",
            data: JSON.stringify(save_data),
            dataType: "json",
            contentType: 'application/json',

            success: function () {
                alert("Dados salvo com sucesso")
                window.location.reload()
            },
            error: function (result) {
                alert(result.responseJSON.message)
            }
        });
    })

})
function displayBot() {
    $('#open_button').click(function () {
        $('.chatbox__chat').toggle()
    });
    //Inicie a conversa com o robô
    askBot()
}

function askBot() {
    $("#send_button").click(function () {

        var user_bot_input_text = $("#bot_input_text").val()

        if (user_bot_input_text != "") {

            $("#chat_messages").append('<div class="user__messages">' + user_bot_input_text + ' </div>')

            //Limpe a caixa de entrada de texto após enviar a mensagem
            $("#bot_input_text").val('');

            let chat_input_data = {
                "user_bot_input_text": user_bot_input_text
            }
            //Escreva a chamada AJAX aqui
            $.ajax({
                type: 'POST',
                url: "/chat-bot",
                data: JSON.stringify(chat_input_data),
                dataType: "json",
                contentType: 'application/json',

                success: function (result) {
                    $("#chat_messages").append('<div class="bot__messages">' + result.data + ' </div>')
                    $("#chatbox__messages__cotainer").animate({
                        scrollTop: $("#chatbox__messages__cotainer")[0].scrollHeight
                    }, 1000)
                },
                error: function (result) {
                    alert(result.responseJSON.message)
                }
            });

        }

    })

    //Envie uma mensagem se a tecla Enter (código de tecla 13) for pressionada 
    if (user_bot_input_text != "") {
        $("#bot_input_text").keypress(function (e) {
            if (e.which == 13) {
                $("#send_button").click()
            }
        })
    }
}