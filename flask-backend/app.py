from flask import Flask, jsonify, request  # Import request to get data from frontend
from flask_cors import CORS  # Import CORS from flask-cors
import RAG  # Import the Python script as a module

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/run-script', methods=['POST'])
def run_script():
    try:
        # Extract data sent from the frontend
        data = request.get_json()  # Get JSON data from the request
        input_value = data.get('input_value')  # Extract specific input value
        print("input value", input_value)
        # Call the function from RAG and pass the input value
        output = RAG.run(input_value)
        print("Output from RAG:", output)
        return jsonify({'output': output}), 200
    except Exception as e:
        print("error", e)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)  # Ensure Flask runs on port 5001
