# Use an official Python image
FROM python:3.10.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory in the container
WORKDIR /app

# Copy requirements file and install dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the project files into the container
COPY . /app

# Expose port 8000
EXPOSE 8000

# Command to run Django's development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
