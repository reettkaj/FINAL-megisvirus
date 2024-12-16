from flask import Flask, jsonify, request
import random
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

db_config = {
    "host": "localhost",
    "user": "root",
    "password": "euch7soo",
    "database": "miafe"
}

Leaderboard = [
    {'name': 'Player1', 'health': 100,'time':20},
    {'name': 'Player2', 'health': 80,'time':50},
]

events_and_tasks = [
    {'name': 'Rescue Mission', 'description': 'Save the citizens trapped in a building!'},
    {'name': 'Antidote Search', 'description': 'Find the antidote hidden in the forest.'},
    {'name': 'Fuel Run', 'description': 'Refuel the plane at a nearby station.'}
]

# Database connection
def get_db_connection():
    try:
        conn = mysql.connector.connect(**db_config)
        return conn
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return None

# Leaderboard Endpoint
@app.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    try:

        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("SELECT * FROM leaderboard ORDER BY healthbar_final DESC, time ASC")
        leaderboard_data = cursor.fetchall()

        leaderboard = []
        for row in leaderboard_data:
            leaderboard.append({
                "leaderboard_id": row[0],
                "player_id": row[1],
                "healthbar_final": row[2],
                "time": row[3]
            })

        cursor.close()
        connection.close()

        return jsonify({"leaderboard": leaderboard}), 200

    except Error as e:
        return jsonify({"error": str(e)}), 500

# API Endpoint to get events 
@app.route('/events', methods=['GET'])
def get_events():
    """Fetch all events from the database."""
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Failed to connect to the database'}), 500

    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM events")
        events = cursor.fetchall()
        return jsonify(events)
    except mysql.connector.Error as err:
        print(f"Error fetching events: {err}")
        return jsonify({'error': 'Failed to fetch events'}), 500
    finally:
        cursor.close()
        connection.close()
# API Endpoint to get etasks
@app.route('/tasks', methods=['GET'])
def get_tasks():
    """Fetch all tasks from the database."""
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Failed to connect to the database'}), 500

    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM tasks")
        tasks = cursor.fetchall()
        return jsonify(tasks)
    except mysql.connector.Error as err:
        print(f"Error fetching tasks: {err}")
        return jsonify({'error': 'Failed to fetch tasks'}), 500
    finally:
        cursor.close()
        connection.close()
# Update leaderboard (post game result)
@app.route('/update_leaderboard', methods=['POST'])
def update_leaderboard():
    try:
        player_data = request.get_json()
        player_id = player_data['name']
        health = player_data['health']
        time_spent = player_data['time']

        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("""
            INSERT INTO leaderboard (name, healthbar_final, time)   
            VALUES (%s, %s, %s)
        """, (player_id, health, time_spent))

        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({"message": "Leaderboard updated successfully!"}), 200

    except Exception as e:
        # Handle generic errors
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
