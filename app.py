from flask import Flask, render_template, url_for, request, jsonify
from text_sentiment_prediction import *
from predict_response import *

app = Flask(__name__)
@app.route('/')
def index():
    entries = show_entry()

    return render_template('index.html', entries = entries)


@app.route('/save-entry', methods=["POST"])
def save_entry():

    date = request.json.get("date")
    text = request.json.get("text")
    emotion = request.json.get("emotion")
    entry = f"{date} , {text} , {emotion} ,\n"
    # file_handle = open("./static/data_files/data_entry.csv", "a")
    # file_handle.write(entry)
    with open("./static/data_files/data_entry.csv", "a") as f:
        f.write(entry)
    return jsonify("success")

@app.route('/predict-emotion', methods=["POST"])
def predict_emotion():
    
    # Obtenha a entrada de texto do requisição POST 
    input_text = request.json.get("text")
    
    if not input_text:
        # Resposta a enviar se o input_text for indefinido
        response = {
            "status": "error",
            "message": "Digite um texto",
        }
        return jsonify(response)
    
    else:
        predict_emotion, predict_emoticon = predict(input_text)
        response = {
            "status": "success",
            "data": {
                "predict_emotion": predict_emotion,
                "predict_emoticon": predict_emoticon
            }
        }
        return jsonify(response)
        

        # Resposta a enviar se o input_text não for indefinido

        # Enviar resposta         
        
@app.route('/chat-bot', methods=["POST"])
def chat_bot():

    input_text = request.json.get("user_bot_input_text")
    bot_res = bot_response(input_text)
    response = {
        "status": "success",
        "data": bot_res
    }

    return jsonify(response)
       
app.run(debug=True)



    