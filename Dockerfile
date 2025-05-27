FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Create data directory for SQLite database
RUN mkdir -p /app/data

# Copy the requirements file
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application files
COPY src/ ./src/

# Expose the port the app runs on
EXPOSE 5000

# Set environment variables
ENV FLASK_APP=src/app.py
ENV SECRET_KEY=your-production-secret-key

# Set the command to run the application
CMD ["python", "src/app.py"]