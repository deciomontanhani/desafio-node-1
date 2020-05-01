const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function validateIdFormat(request, response, next) {

  const { id } = request.params;

  if (!isUuid(id)) {
    response.status(400).json({ error: "Invalid Id" });
    return
  }

  return next();
}

const repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {

  const { title, url, techs } = request.body;

  const repo = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repo);

  response.json(repo);
});

app.put("/repositories/:id", validateIdFormat, (request, response) => {

  const { id } = request.params;

  const { title, url, techs } = request.body;

  const index = repositories.findIndex(repo => repo.id === id);

  if (index < 0) {
    response.status(400).json({ error: "Invalid Id" })
  }

  let repo = repositories[index]

  let newInfo = { ...repo, title, url, techs };

  repositories[index] = newInfo;

  response.json(newInfo);

});

app.delete("/repositories/:id", validateIdFormat, (request, response) => {

  const { id } = request.params;
  const index = repositories.findIndex(repo => repo.id === id);

  if (index < 0) {
    response.status(400).json({ error: "Invalid Id" })
  }

  repositories.splice(index, 1);

  response.status(204).send();
});

app.post("/repositories/:id/like", validateIdFormat, (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(repo => repo.id === id);

  if (index < 0) {
    response.status(400).json({ error: "Invalid Id" })
  }

  repositories[index].likes += 1

  response.json({ likes: repositories[index].likes });

});

module.exports = app;
