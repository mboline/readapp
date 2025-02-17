import cloudinary
import cloudinary.api
from datetime import datetime, timedelta
import pytz

# Configure your Cloudinary credentials
cloudinary.config(
    cloud_name = "dytzehkji",
    api_key = "912423588137146",
    api_secret = "5_r1bTGtIXUwDnhOdzGpViJVVUc"
)

# Calculate the timestamp for 10 minutes ago
ten_minutes_ago = datetime.now(pytz.UTC) - timedelta(minutes=60)

# Get all resources (you might need to adjust max_results if you have a large number of files)
result = cloudinary.api.resources(
    type='upload',
    max_results=500,
    direction='desc'
)

# Filter and prepare the output
output = []
recent_resources = []

for resource in result['resources']:
    created_at = datetime.strptime(resource['created_at'], '%Y-%m-%dT%H:%M:%SZ').replace(tzinfo=pytz.UTC)
    if created_at > ten_minutes_ago:
        recent_resources.append(resource)
        public_id = resource['public_id']
        format = resource['format']
        url = cloudinary.utils.cloudinary_url(public_id, format=format)[0]
        
        output.append(f"Image Name (Public ID): {public_id}")
        output.append(f"Cloudinary URL: {url}")
        output.append(f"Created At: {created_at}")
        output.append("---")

output.append(f"Total recent resources found: {len(recent_resources)}")

# Print to console and write to file
print("\n".join(output))

with open('cloudinary_output.txt', 'w') as file:
    file.write("\n".join(output))

print(f"Output has been written to cloudinary_output.txt")
