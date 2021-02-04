#!/usr/bin/env bash
printf "\n\n######## game admin hq build ########\n"

IMAGE_REPOSITORY=${IMAGE_REPOSITORY:-quay.io/redhatdemo/2021-game-admin-hq:latest}
SOURCE_REPOSITORY_URL=${SOURCE_REPOSITORY_URL:-git@github.com:rhdemo/2021-admin-hq.git}
SOURCE_REPOSITORY_REF=${SOURCE_REPOSITORY_REF:-master}

echo "Building ${IMAGE_REPOSITORY} from ${SOURCE_REPOSITORY_URL} on ${SOURCE_REPOSITORY_REF}"

# Don't copy local node_modules from the host into the build container
rm -rf node_modules/

s2i build -c . registry.access.redhat.com/ubi8/nodejs-14 ${IMAGE_REPOSITORY}
