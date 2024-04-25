FROM python:3.7.17
RUN mkdir /backend
WORKDIR /backend
COPY ./requirements.txt /backend/requirements.txt
RUN apt-get clean && \
    apt-get -y update && \
    apt-get install -y --no-install-recommends \
    unzip bzip2 \
    openssl libssl-dev \
    libglfw3-dev libgles2-mesa-dev \
    libegl1-mesa-dev \
    curl wget \
    ca-certificates \
    locales \
    bash \
    sudo \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
RUN pip install --upgrade pip && \
    pip install -r requirements.txt
# COPY . .