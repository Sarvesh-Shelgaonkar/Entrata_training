# This is a template for a bash script that can be used to set up a new project. It creates a directory structure and initializes a git repository.

# Creating Directory Structure
mkdir -p src
mkdir -p research

#Creating Files
touch src/main.py
touch src/helper.py
touch src/prompt.py
touch .env
touch setup.py
touch app.py
touch research/trials.ipynb
touch requirements.txt

echo "Directory structure created and files initialized."

