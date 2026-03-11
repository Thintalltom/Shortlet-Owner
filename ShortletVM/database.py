from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLite (current)
SQLALCHEMY_DATABASE_URL = "sqlite:///./shortlet.db"

# PostgreSQL (for production)
# SQLALCHEMY_DATABASE_URL = "postgresql://user:password@localhost/dbname"

# MySQL (for production)
# SQLALCHEMY_DATABASE_URL = "mysql+pymysql://user:password@localhost/dbname"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={
        "check_same_thread": False} if "sqlite" in SQLALCHEMY_DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database and run migrations"""
    Base.metadata.create_all(bind=engine)

    # Add missing columns to properties table if they don't exist
    with engine.connect() as conn:
        try:
            conn.execute(
                text("ALTER TABLE properties ADD COLUMN owner_id INTEGER"))
            conn.commit()
        except Exception as e:
            # Column already exists or other error
            pass

        try:
            conn.execute(
                text("ALTER TABLE properties ADD COLUMN status VARCHAR DEFAULT 'available'"))
            conn.commit()
        except Exception as e:
            # Column already exists or other error
            pass

        try:
            conn.execute(
                text("ALTER TABLE properties ADD COLUMN available_from DATE"))
            conn.commit()
        except Exception as e:
            # Column already exists or other error
            pass

        try:
            conn.execute(
                text("ALTER TABLE properties ADD COLUMN available_to DATE"))
            conn.commit()
        except Exception as e:
            # Column already exists or other error
            pass
