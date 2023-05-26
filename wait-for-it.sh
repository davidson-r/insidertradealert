# #!/bin/bash

# # Wait for the database to be ready
# until pg_isready -h db -p 5432 -q
# do
#     echo "Waiting for the database to be ready..."
#     sleep 2
# done

# # Run your application build command
# pm2-runtime npm -- start