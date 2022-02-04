
CREATE TABLE users (
	id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
	email VARCHAR(50) NOT NULL,
	password VARCHAR(30) NOT NULL,
    config VARCHAR(1000) NOT NULL
);

CREATE TABLE tasks (
	id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	note VARCHAR(200),
    create_at TIMESTAMP NOT NULL,
	done_at TIMESTAMP,
    isDone BOOLEAN NOT NULL,
    important BOOLEAN NOT NULL,

	user_id INTEGER NOT NULL,

	FOREIGN KEY (user_id) REFERENCES users(id)
);
