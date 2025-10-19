from src.db.connection import get_database
from src.db.models.user import UserInDB
from bson import ObjectId
from pymongo.database import Database

class UserRepository:
    def __init__(self, db: Database):
        self.collection = db["users"]

    def get_by_email(self , email:str):
        user = self.collection.find_one({"email":email})
        print(user)
        if user :
            return UserInDB(**user)
        return None

    def create(self , email:str , hashed_password:str):
        result = self.collection.insert_one({
            "email":email,
            "hashed_password":hashed_password
            })

        return str(result.inserted_id)