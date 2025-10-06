-- Database initialization script
-- This script creates the necessary tables and initial data

-- Create items table
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on created_at for better query performance
CREATE INDEX IF NOT EXISTS idx_items_created_at ON items(created_at);

-- Insert some sample data
INSERT INTO items (name, description) VALUES
    ('Sample Item 1', 'This is a test item created during database initialization'),
    ('Kubernetes Pod', 'A sample item representing a Kubernetes pod'),
    ('Docker Container', 'A sample item representing a Docker container'),
    ('Microservice', 'A sample item representing a microservice architecture');

-- Create a function to update the updated_at column automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_items_updated_at 
    BEFORE UPDATE ON items 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions to the application user
GRANT SELECT, INSERT, UPDATE, DELETE ON items TO k8s_user;
GRANT USAGE, SELECT ON SEQUENCE items_id_seq TO k8s_user;