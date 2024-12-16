import mysql.connector
import json
#database connection details
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "euch7soo",
    "autocommit": True
}

#events and tasks data
events = [
    {
        "id": 1,
        "name": "Apple Offer",
        "description": "An elderly woman offers you a delicious-looking apple. Do you trust her enough to accept it?",
        "image": "./picsforpeli//apple_bg.png",
        "choices": [
            {"option": "yes", "text": "Accept the apple"},
            {"option": "no", "text": "Decline the apple"}
        ],
        "outcomes": {
            "yes": "After eating the apple, you feel refreshed and full of energy.",
            "no": "You politely decline the apple. Nothing changes."
        },
        "health_impact": {
            "yes": 1,
            "no": 0
        }
    },
    {
        "id": 2,
        "name": "Wallet Discovery",
        "description": "You find a wallet near a vending machine. Should you investigate?",
        "image": "./picsforpeli/wallet_bg.png",
        "choices": [
            {"option": "yes", "text": "Pick up the wallet"},
            {"option": "no", "text": "Ignore the wallet"}
        ],
        "outcomes": {
            "yes": "You return the wallet to its owner, who rewards you with gratitude and a snack.",
            "no": "You ignore the wallet and move on. Nothing changes."
        },
        "health_impact": {
            "yes": 1,
            "no": 0
        }
    },
    {
        "id": 3,
        "name": "Free Coffee Offer",
        "description": "A staff member offers you a free cup of coffee. Would you like to accept it?",
        "image": "./picsforpeli/coffee_bg.png",
        "choices": [
            {"option": "yes", "text": "Accept the coffee"},
            {"option": "no", "text": "Decline the coffee"}
        ],
        "outcomes": {
            "yes": "The coffee is energizing and warms you up, making you feel great.",
            "no": "You politely decline the coffee. Nothing changes."
        },
        "health_impact": {
            "yes": 1,
            "no": 0
        }
    },
    {
        "id": 4,
        "name": "Storm Alert",
        "description": "A storm is coming, and it’s unsafe to travel for the next 2 hours. What do you choose to do?",
        "image": "./picsforpeli/storm_bg.png",
        "choices": [
            {"option": "yes", "text": "Wait for the storm to pass"},
            {"option": "no", "text": "Ignore the storm and keep traveling"}
        ],
        "outcomes": {
            "yes": "You wait for the storm to pass. You take a little nap, boosting your energy.",
            "no": "You decide to travel anyway. You get lost, causing a delay and health loss."
        },
        "health_impact": {
            "yes": 1,
            "no": -1
        }
    },
    {
        "id": 5,
        "name": "Outfit Compliment",
        "description": "Someone compliments your outfit. How do you respond?",
        "image": "./picsforpeli/compliment_bg.png",
        "choices": [
            {"option": "yes", "text": "Respond positively"},
            {"option": "no", "text": "Ignore or respond negatively"}
        ],
        "outcomes": {
            "yes": "You feel great and thank the person, returning the compliment.",
            "no": "You feel uncomfortable and walk away."
        },
        "health_impact": {
            "yes": 1,
            "no": -1
        }
    }
]




tasks = [
    {
        "id": 1,
        "name": "Find Clue on Board",
        "description": "You find a mysterious board in the airport lounge. It has multiple clues written in code. Choose the correct code to find the antidote.",
        "image": "./picsforpeli/quiz_bg.png",
        "reward_health": 1,  # Adding reward_health
        "penalty_health": 0,  # Adding penalty_health
        "choices": [
            {"option": "X32YZ", "text": "Choose X32YZ"},
            {"option": "M3615", "text": "Choose M3615"},
            {"option": "H2S99", "text": "Choose H2S99"}
        ],
        "outcomes": {
            "M3615": "Correct! The code 'M3615' reveals the antidote location.",
            "X32YZ": "Wrong! The correct code was 'M3615'. You missed the antidote.",
            "H2S99": "Wrong! The correct code was 'M3615'. You missed the antidote."
        }
    },
    {
        "id": 2,
        "name": "Help an Airport Mechanic",
        "description": "You notice an airport mechanic struggling to repair an important system. They ask you to help solve a problem before the system overheats. You have 3 attempts to guess the right fix.",
        "image": "./picsforpeli/electrician_bg.png",
        "reward_health": 0,  # Adding reward_health
        "penalty_health": 0,  # Adding penalty_health
        "choices": [
            {"option": "1", "text": "Try number 1 to fix the system"},
            {"option": "2", "text": "Try number 2 to fix the system"},
            {"option": "3", "text": "Try number 3 to fix the system"},
            {"option": "4", "text": "Try number 4 to fix the system"},
            {"option": "5", "text": "Try number 5 to fix the system"}
        ],
        "outcomes": {
            "1": "You guessed correctly! The mechanic thanks you with an antidote!",
            "2": "Wrong fix. Try again.",
            "3": "Wrong fix. Try again.",
            "4": "Wrong fix. Try again.",
            "5": "Wrong fix. Try again.",
            "max_attempts": "The correct fix was 1. The system fails, and you leave empty-handed."
        }
    },
    {
        "id": 3,
        "name": "Solve a Broken Luggage Machine",
        "description": "The airport's luggage sorting system is malfunctioning. The line is getting longer, and passengers are frustrated. You decide to step in and fix the problem.",
        "image": "./picsforpeli/luggage_bg.png",
        "reward_health": 1,  # Adding reward_health
        "penalty_health": 0,  # Adding penalty_health
        "choices": [
            {"option": "1", "text": "Try to fix the mechanical issue"},
            {"option": "2", "text": "Work on the software issue"},
            {"option": "3", "text": "Ask the airport staff for help"}
        ],
        "outcomes": {
            "1": "You fix the mechanical issue and the system starts working again. You gain access to an antidote!",
            "2": "You repair the software and the luggage system operates smoothly. You find a hidden antidote!",
            "3": "You ask for help, and the staff give you a map with an antidote location."
        }
    },
    {
        "id": 4,
        "name": "Hack a Malfunctioning Security System",
        "description": "The airport's security system has malfunctioned, causing chaos at the security checkpoint. You decide to hack into the system to fix the issue.", 
        "image": "./picsforpeli/code_bg.png",
        "reward_health": 1, 
        "penalty_health": 0,
        "choices": [ 
            {"option": "1", "text": "Attempt to fix the software issue yourself"},
            {"option": "2", "text": "Notify the security staff and wait for their IT expert"}, 
            {"option": "3", "text": "Try to bypass the system and manually reset it"} 
        ], 
        "outcomes": { "1": "You successfully fix the software issue, restoring the security system. The staff thank you and you gain an antidote!",
            "2": "The IT expert arrives and resolves the issue, but the delay causes further stress and chaos, affecting your health.",
            "3": "Your bypass attempt fails, causing the system to lock down further. Security reprimands you and you lose some health." },
    },

    {
        "id": 5,
        "name": "Help a Lost Child",
        "description": "A child approaches you at the airport, looking lost and scared. They ask you to help them find their parents. You decide to assist them.",
        "image": "./picsforpeli/lost_child_bg.png",
        "reward_health": 0,  # Adding reward_health
        "penalty_health": 0,  # Adding penalty_health
        "choices": [
            {"option": "1", "text": "Look in the lost and found section"},
            {"option": "2", "text": "Look near the gates"},
            {"option": "3", "text": "Ask airport staff to make an announcement"}
        ],
        "outcomes": {
            "1": "You find the parents in the lost and found section. They give you an antidote in gratitude!",
            "2": "The parents are waiting in the lounge. They thank you and give you an antidote!",
            "3": "The staff help make an announcement. The parents come to pick up the child, and they give you an antidote!"
        }
    },
    {
        "id": 6,
        "name": "Retrieve Lost Passenger Documents",
        "description": "A passenger approaches you, looking stressed. They've lost their documents. You decide to help by following a series of clues.",
        "image": "./picsforpeli/documents_bg.png",
        "reward_health": 1,  # Adding reward_health
        "penalty_health": 0,  # Adding penalty_health
        "choices": [
            {"option": "1", "text": "Look in the luggage storage area"},
            {"option": "2", "text": "Look in the airport lounge"},
            {"option": "3", "text": "Look in the bathrooms"}
        ],
        "outcomes": {
            "1": "Wrong choice. The documents remain missing.",
            "2": "You find the documents in the lounge! The passenger rewards you with an antidote.",
            "3": "Wrong choice. The documents remain missing."
        }
    },
    {
        "id": 7,
        "name": "Navigate Power Outage",
        "description": "The airport experiences a sudden power outage. You must navigate to safety.",
        "image": "./picsforpeli/outage_bg.png",
        "reward_health": 0,  # Adding reward_health
        "penalty_health": 0,  # Adding penalty_health
        "choices": [
            {"option": "1", "text": "Choose the main hallway"},
            {"option": "2", "text": "Choose the emergency stairs"},
            {"option": "3", "text": "Choose the lounge"}
        ],
        "outcomes": {
            "1": "You safely navigate through the main hallway and find an antidote!",
            "2": "You safely navigate through the emergency stairs and find an antidote!",
            "3": "You safely navigate through the lounge and find an antidote!"
        }
    },
    {
        "id": 8,
        "name": "Find Hidden Message",
        "description": "You overhear a cryptic message being announced in the airport. It might lead to an antidote!",
        "image": "./picsforpeli/message_bg.png",
        "reward_health": 1,  # Adding reward_health
        "penalty_health": 0,  # Adding penalty_health
        "choices": [
            {"option": "1", "text": "Answer: All of them"},
            {"option": "2", "text": "Answer: February"},
            {"option": "3", "text": "Answer: December"}
        ],
        "outcomes": {
            "1": "Correct! The riddle reveals the antidote location.",
            "2": "Wrong answer. The message remains a mystery.",
            "3": "Wrong answer. The message remains a mystery."
        }
    },
    {
        "id": 9,
        "name": "Pharmacy Backroom Task",
        "description": "As you sit in the airport café, you overhear two employees whispering: 'There’s an antidote in the pharmacy backroom near Gate 12. It’s hidden with the other experimental meds.' You decide to sneak in to retrieve it.",
        "reward_health": 0,  # Adding reward_health
        "image": "./picsforpeli/backroom_bg.png",
        "penalty_health": 0,  # Adding penalty_health
        "choices": [
            {"option": "sneak", "text": "Sneak into the backroom"}
        ],
        "outcomes": {
            "sneak": "You carefully make your way to the pharmacy, avoiding prying eyes. There it is—the antidote! You grab the antidote and quickly leave before anyone notices."
        }
    },
    {
        "id": 10,
        "name": "Candy Deal Task",
        "description": "You are sitting in the airport lounge, and suddenly, you spot something shiny under a bench. It's an antidote! Just as you reach for it, a child rushes over and snatches it away. The child looks at you and says, 'If you want this antidote, you have to buy me candy first! I want the biggest candy bar in the store!'",
        "image": "./picsforpeli/candy_trade_bg.png",
        "reward_health": 1,  # Adding reward_health
        "penalty_health": 0,  # Adding penalty_health
        "choices": [
            {"option": "1", "text": "Agree to buy the candy and go to the store."},
            {"option": "2", "text": "Refuse and try to take the antidote from the child."},
            {"option": "3", "text": "Try to convince the child that the antidote is more important than candy."}
        ],
        "outcomes": {
            "1": "You buy the candy, and the child hands you the antidote with a big smile!",
            "2": "The child refuses to give you the antidote and runs away with it. You lost your chance!",
            "3": "The child laughs and says, 'No way! Candy is way cooler than that!' Looks like you'll have to buy the candy after all."
        }
    }
]

#mysql connection
try:
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    print("Connected to MySQL server successfully.")
except mysql.connector.Error as err:
    print(f"Error: {err}")
    exit(1)

# Recreate the `miafe` database (from the one made by mia)
try:
    cursor.execute("DROP DATABASE IF EXISTS miafe;")
    cursor.execute("CREATE DATABASE miafe;")
    print("Database `miafe` recreated successfully.")
except mysql.connector.Error as err:
    print(f"Error recreating database: {err}")
    exit(1)

# Use the `miafe` database
try:
    cursor.execute("USE miafe;")
except mysql.connector.Error as err:
    print(f"Error selecting database: {err}")
    exit(1)

# Create tables
create_tables_sql = [
    """CREATE TABLE IF NOT EXISTS events (
        event_id INT(11) NOT NULL,
        name VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        image VARCHAR(255) NOT NULL UNIQUE,
        choices JSON NOT NULL,
        outcomes JSON NOT NULL,
        health_impact JSON NOT NULL,
        PRIMARY KEY (event_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;""",

    """CREATE TABLE IF NOT EXISTS tasks (
        task_id INT(11) NOT NULL,
        name VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        image VARCHAR(255) NOT NULL UNIQUE,
        reward_health INT(10) NOT NULL,
        penalty_health INT(10) NOT NULL,
        choices JSON NOT NULL,
        outcomes JSON NOT NULL,
        PRIMARY KEY (task_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;""",
     
    """CREATE TABLE IF NOT EXISTS leaderboard (
    leaderboard_id INT(11) NOT NULL AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL,
    healthbar_final INT(10) NOT NULL,
    time INT(11) NOT NULL,
    PRIMARY KEY (leaderboard_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;""",

]


for sql in create_tables_sql:
    try:
        cursor.execute(sql)
        print(f"Table created or already exists: {sql.split()[2]}")
    except mysql.connector.Error as err:
        print(f"Error creating table: {err}")
        exit(1)

# Populate the `event` table
try:
    for event in events:
        cursor.execute(
            """
            INSERT INTO events (event_id, name, description,image ,choices, outcomes, health_impact)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (
                event["id"],
                event["name"],
                event["description"],
                event["image"],
                json.dumps(event["choices"]),
                json.dumps(event["outcomes"]),
                json.dumps(event["health_impact"]),
            )
        )
    print("Events data inserted successfully.")
except mysql.connector.Error as err:
    print(f"Error inserting event data: {err}")
    exit(1)

# Populate the `task` table
try:
    for task in tasks:
        cursor.execute(
            """
            INSERT INTO tasks (task_id, name, description,image ,reward_health, penalty_health, choices, outcomes)
            VALUES (%s, %s, %s, %s, %s, %s, %s,%s)
            """,
            (
                task["id"],
                task["name"],
                task["description"],
                task["image"],
                task["reward_health"],
                task["penalty_health"],
                json.dumps(task["choices"]),
                json.dumps(task["outcomes"]),
            )
        )
    print("Tasks data inserted successfully.")
except mysql.connector.Error as err:
    print(f"Error inserting task data: {err}")
    exit(1)
    
Leaderboard = [
    {'name': 'Player1', 'health': 100, 'time': 20},
    {'name': 'Player2', 'health': 80, 'time': 50},
]
try:
    for entry in Leaderboard:
        cursor.execute(
            """
            INSERT INTO leaderboard (name, healthbar_final, time)
            VALUES (%s, %s, %s)
            """,
            (
                entry["name"],
                entry["health"],
                entry["time"],
            )
        )
    print("Leaderboard data inserted successfully.")
except mysql.connector.Error as err:
    print(f"Error inserting leaderboard data: {err}")
    exit(1)
# Close the connection
cursor.close()
connection.close()
print("Database setup and population completed successfully.")
