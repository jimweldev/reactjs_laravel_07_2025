FROM php:8.4-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    iproute2 \
    net-tools \
    unzip \
    git \
    pkg-config \
    libcurl4-openssl-dev \
    libssl-dev \
    zlib1g-dev \
    libzip-dev \
    libpq-dev \
    libonig-dev \
    libxml2-dev \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install \
    pdo \
    pdo_mysql \
    zip \
    xml \
    mbstring \
    bcmath \
    pcntl \
    sockets \
    opcache

# Install swoole manually from PECL
RUN curl -L -o swoole.tgz https://pecl.php.net/get/swoole && \
    tar -xzf swoole.tgz && \
    cd swoole-* && \
    phpize && \
    ./configure \
        --enable-sockets \
        --enable-openssl \
        --enable-mysqlnd \
        --enable-swoole-curl \
        --disable-brotli && \
    make -j"$(nproc)" && make install && \
    echo "extension=swoole.so" > /usr/local/etc/php/conf.d/docker-php-ext-swoole.ini && \
    cd .. && rm -rf swoole*

# Set working directory
WORKDIR /var/www

# Copy application code
COPY . .

# Default command
CMD ["php", "-a"]
