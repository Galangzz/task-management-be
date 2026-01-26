ALTER TABLE authentications
ADD CONSTRAINT fk_authentications_users
Foreign Key (user_id) REFERENCES users(id)
ON DELETE CASCADE
ON UPDATE CASCADE;