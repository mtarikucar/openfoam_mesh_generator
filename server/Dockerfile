# Start from the official Ubuntu (Jammy 22.04 LTS) image
FROM ubuntu:jammy

# Install any extra things we might need
RUN apt-get update && apt-get install -y \
        vim \
        ssh \
        sudo \
        wget \
        software-properties-common \
        curl \
        gnupg && \
    rm -rf /var/lib/apt/lists/*

# Create a new user called foam
RUN useradd --user-group --create-home --shell /bin/bash foam && \
    echo "foam ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Add OpenFOAM repository and install it
RUN sh -c "wget -O - http://dl.openfoam.org/gpg.key | apt-key add -" && \
    add-apt-repository http://dl.openfoam.org/ubuntu && \
    apt-get update && \
    apt-get install -y --no-install-recommends openfoam10 && \
    rm -rf /var/lib/apt/lists/* && \
    echo "source /opt/openfoam10/etc/bashrc" >> /home/foam/.bashrc && \
    echo "export OMPI_MCA_btl_vader_single_copy_mechanism=none" >> /home/foam/.bashrc

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
    apt-get install -y nodejs

# Set the working directory
WORKDIR /usr/src/app

# Install application dependencies
COPY package.json ./
RUN npm install

# Copy application files
COPY . .

# Change file ownership to user 'foam'
RUN chown -R foam:foam /usr/src/app

# Expose the application port
EXPOSE 3000

# Create a startup script to ensure OpenFOAM environment is loaded
RUN echo "#!/bin/bash" > /usr/src/app/startup.sh && \
    echo "source /opt/openfoam10/etc/bashrc" >> /usr/src/app/startup.sh && \
    echo "node index.js" >> /usr/src/app/startup.sh && \
    chmod +x /usr/src/app/startup.sh

# Switch to user 'foam'
USER foam

# Start the application via the startup script
CMD ["/usr/src/app/startup.sh"]
