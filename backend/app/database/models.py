from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.database.session import Base

class Prediction(Base):
    __tablename__ = 'predictions'
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    status = Column(String, nullable=False)
    attack_percentage = Column(Float, nullable=False)
    attack_type = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    normal_count = Column(Integer, default=0)
    dos_count = Column(Integer, default=0)
    fuzzy_count = Column(Integer, default=0)
    gear_count = Column(Integer, default=0)
    rpm_count = Column(Integer, default=0)
    report_path = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
