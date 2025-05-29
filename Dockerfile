FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy project
COPY . .

# Set proper permissions and create data directory
RUN mkdir -p /app/data && chmod 755 /app/data

# Expose port
EXPOSE 5000

# Set Python path so imports work correctly
ENV PYTHONPATH=/app/src
WORKDIR /app/src

# Run the app with Gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app"]