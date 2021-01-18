DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd $DIR/..
echo "$(pwd)"
docker build -f Dockerfile.dev . -t summit-admin-hq-refresh

docker run --rm --net=summit -p 3001:3001 -v "$(pwd):/usr/src/app/" --name=summit-admin-hq-refresh summit-admin-hq-refresh