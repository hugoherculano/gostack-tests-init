const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  try {
    return response.status(200).json(repositories);
  } catch {
    return response.status(400).json({ message: 'Error in repository listing! :/' });
  }
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  if(!title || !url || !techs) {
    return response.status(400).json({ message: 'Creation data is incomplete!'});
  }

  try {

    const repository = {
      id: uuid(),
      title,
      url,
      techs,
      likes: 0
    }

    repositories.push(repository);

    return response.status(201).json(repository);
  } catch {
    return response.status(400).json({ message: 'Error in creation! :/' });
  }  
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const { title, url, techs } = request.body;

  try {
    const repository = repositories.find(item => {
      return id === item.id;
    });

    if(!repository) return response.status(400).json({ message: 'Repository not found!'});

    const newRepository = {
      ...repository,
      title,
      url,
      techs,
    }

    const repositoryIndex = repositories.findIndex((item) => item.id === id);

    repositories[repositoryIndex] = newRepository;

    return response.status(200).json(newRepository);

  } catch {
    return response.status(400).json({ message: 'Error in update! :/' });
  }
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  try {
    const indexRepository = repositories.findIndex(item => {
      return item.id === id;
    });

    if(indexRepository === -1) {
      return response.status(400).json({ message: 'Repository not found!'});
    }

    repositories.splice(indexRepository, 1);

    return response.status(204).json();

  } catch {
    return response.status(400).json({ message: 'Error in delete! :/' });
  }
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  try {
    const repository = repositories.find(item => {
      return id === item.id;
    });

    if(!repository) return response.status(400).json({ message: 'Repository not found!'});

    const amountLikes = repository.likes + 1;

    const newRepository = {
      ...repository,
      likes: amountLikes
    }

    const repositoryIndex = repositories.findIndex((item) => item.id === id);

    repositories[repositoryIndex] = newRepository;

    return response.status(200).json(newRepository);

  } catch {
    return response.status(400).json({ message: 'Error in update likes! :/' });
  }
});

module.exports = app;
