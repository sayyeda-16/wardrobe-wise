# wardrobe-wise

## setup instructions

### backend setup

- `python -m venv venv`
- `venv\Scripts\activate` # Windows
or
`source venv/bin/activate` # macOS/Linux

- `pip install -r requirements.txt`
- `python manage.py makemigrations`
- `python manage.py migrate`

make .env, put relevant keys,
save then run: `python manage.py dbshell`

### frontend setup

To start the frontend:

- run `cd frontend`
- run `npm install`
- test it with `npm start`
