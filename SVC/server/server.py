from flask import Flask, jsonify,make_response,request
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import base64
import csv

from modules.total_function import *
OVER_SIZE_LIMIT = 200_000_000

csv.field_size_limit(OVER_SIZE_LIMIT)
app = Flask(__name__)
CORS(app)


#
@app.route('/', methods=['GET'])
def hello():
    return '<p>Hello World</p>'


@app.route('/api/data', methods=['GET'])
def get_data():
    data = {'name': 'tarou', 'age': 30, 'job': 'developer'}

    return jsonify(data)


@app.route('/api/csv', methods=['GET'])
def post_csv():
    
    with open('pseudo_data.csv', mode='r', encoding='utf-8') as file:
        # 辞書リーダーを使用してファイルを読み込む
        reader = csv.DictReader(file)
        # 各行からデータを読み取り、辞書のリストを作成
        data_list = [row for row in reader]
        
        # 'key2' のデータだけを抽出する
        key2_data = [row['key'] for row in data_list]
    return jsonify(key2_data)

CDIR = os.path.abspath(os.path.dirname(__file__))
UPLOAD_FOLDER = CDIR + '/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


@app.route('/upload', methods=['POST'])
def upload():
    return upload_file(app)    

if __name__ == '__main__':
    
    app.run(debug=True)