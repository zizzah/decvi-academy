# db/session.py
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL="postgresql://postgres.azumgxvowpberhubdeux:xfo0GgoVZu2x5Li4@aws-1-us-east-1.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1"

engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def get_session() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session
