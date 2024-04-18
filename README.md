# ai-charades-client

ai-charades is a web-based game inspired by Charades that uses OpenAIs DALL-E for image generation.

This is the client for ai-charades. The server can be found [here](https://github.com/Seryjnyy/ai-charades-server.git).

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about">About</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>c
    </li>
    <li><a href="#status">Status</a></li>
    <li><a href="#usage">Usage</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#for-development-locally">For development locally</a></li>
        <li><a href="#build-and-deploy">Build and deploy</a></li>
      </ul>
    </li>
  </ol>
</details>

## About

AI is here to stay, so why not learn to use it better? A part of that is prompting. The better your prompts, the better your results.

That is why the game forces the users to create prompts to explain certain things, like cartoon characters, without using key words.

You have to get crafty to explain it properly to get an image that the other user will get.

The game involves two rounds.

- First round is about creating prompts for topics that you got.
- Second round is when you get the other players generated images and guess the topic.
- Finally, you get the results to see how everyone got on.

## Built with

- React
- Vite
- MUI
- Socket.io
- Zustand

## Status

The main game features are all there.

The codebase, however, is not cleaned up or refactored yet. Apologies.

If you find bugs or issues do let me know.

## Usage

You can set up and host both the server and the client if you want to. This will allow you to use your own OpenAI key.

## Getting started

- You can run it locally, build and deploy it, or add it to your own repo for CI/CD.
- You will need to go to src/utility/server.ts file and add the address of the server, including the ports for HTTPS and WSS connections.

  ```
   export const SERVER_URL = "https://localhost:443";
   export const SERVER_SOCKET_URL = "wss://localhost:443";
  ```

### For development locally

- Run it locally.
  ```
  npm run dev
  ```
  - This will use vite, visit [localhost:5173](http://localhost:5173/) to see the site.
    - Note: Check the console to get the link, as it might use another port.

### Build and deploy

- Build the application.
  ```
  npm run build
  ```
- You can then upload the files to a site like Netlify.
