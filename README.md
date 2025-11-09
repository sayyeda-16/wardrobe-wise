# wardrobe-wise

## setup instructions

git clone <repo_url>
cd <project_folder>
python -m venv venv
venv\Scripts\activate # Windows

# or

source venv/bin/activate # macOS/Linux
pip install -r requirements.txt

make .env, put relevent keys
save then run: python manage.py dbshell
