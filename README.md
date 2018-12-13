# Shingo Affiliate Portal
Provides services for affiliates and facilitators to create workshops,
and for affiliate managers to manage workshops, facilitators, and their affiliates.

# Building
1. Clone the repository
2. Install dependencies with `npm i`
3. Build a static site with `npm run build`, or serve a development version with `npm start`
   - if needed, serve with AOT compilation with `npm start -- --aot` or `ng serve --aot`
   
# Deploying
1. Make sure docker is installed on your computer and accessible from the terminal
2. Run the `build.sh` script in the root project directory. Optionally push with `./build.sh -p`.
   Run `./build.sh --help` for all options
3. Login to the docker repository and push the new image with `docker push docker.shingo.org/shingo-affiliates:latest`.
   It is preferred to use the `-p` parameter of the build.sh script instead
4. SSH to the server and restart the docker image with
`docker pull docker.shingo.org/shingo-affiliates:latest && docker rm -f shingo-affiliates && docker run -d --name shingo-affiliates --network shingo-net docker.shingo.org/shingo-affiliates:latest`
